const _ = require('lodash');
const redisClient = require('../utils/redis');
const { getSession, setSession } = require('../middlewares/clsHooked');
const { Restaurant, Table, TablePosition, Employee, EmployeePosition, Department } = require('../models');
const { getRestaurantKey } = require('./common');
const constant = require('../utils/constant');

const _getRestaurantFromClsHook = ({ key }) => {
  const restarantVal = getSession({ key });
  const restaurant = _.get(restarantVal, 'restaurant');
  return restaurant;
};

const _getTablesFromClsHook = ({ key }) => {
  const restarantVal = getSession({ key });
  const tables = _.get(restarantVal, 'tables');
  return tables;
};

const _getTablePositionsFromClsHook = ({ key }) => {
  const restarantVal = getSession({ key });
  const tablePositions = _.get(restarantVal, 'tables');
  return tablePositions;
};

const _getEmployeesFromClsHook = ({ key }) => {
  const restarantVal = getSession({ key });
  const employees = _.get(restarantVal, 'employees');
  return employees;
};

const _getEmployeePositionsFromClsHook = ({ key }) => {
  const restarantVal = getSession({ key });
  const employeePositions = _.get(restarantVal, 'employees');
  return employeePositions;
};

const _getDepartmentsFromClsHook = ({ key }) => {
  const restarantVal = getSession({ key });
  const departments = _.get(restarantVal, 'departments');
  return departments;
};

const getRestaurantFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookRestaurant = _getRestaurantFromClsHook({ key });
  if (!_.isEmpty(clsHookRestaurant)) {
    return clsHookRestaurant;
  }

  if (redisClient.isRedisConnected()) {
    const restarantVal = await redisClient.getJson(key);
    const restaurant = _.get(restarantVal, 'restaurant');
    if (!_.isEmpty(restaurant)) {
      setSession({ key, value: restarantVal });
      return restaurant;
    }

    const restaurantModel = await Restaurant.find({ _id: restaurantId, status: constant.status.enabled });
    const restaurantJson = restaurantModel.toJSON();
    redisClient.putJson({ key, jsonVal: { ...restarantVal, restaurant: restaurantJson } });
    return restaurantJson;
  }

  const restaurant = await Restaurant.find({ _id: restaurantId, status: constant.status.enabled });
  const restaurantJson = restaurant.toJSON();
  return restaurantJson;
};

const getTableFromCache = async ({ restaurantId, tableId }) => {
  if (!tableId) {
    return;
  }
  const key = getRestaurantKey({ restaurantId });
  const clsHookTables = _getTablesFromClsHook({ key });
  if (!_.isEmpty(clsHookTables)) {
    return _.find(clsHookTables, (table) => table.id === tableId);
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const tables = _.get(restaurantVal, 'tables');
    setSession({ key, value: { tables } });
    if (!_.isEmpty(tables)) {
      return _.find(tables, (table) => table.id === tableId);
    }
  }

  const table = await Table.findById(tableId).populate('position');
  return table.toJSON();
};

const getTablesFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookTables = _getTablesFromClsHook({ key });
  if (!_.isEmpty(clsHookTables)) {
    return clsHookTables;
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const tables = _.get(restaurantVal, 'tables');
    if (!_.isEmpty(tables)) {
      setSession({ key, value: restaurantVal });
      return tables;
    }

    const tableModels = await Table.find({ restaurantId, status: constant.status.enabled }).populate('position');
    const tablesJson = tableModels.map((table) => table.toJSON());
    redisClient.putJson({ key, jsonVal: { ...restaurantVal, tables: tablesJson } });
    return tablesJson;
  }

  const tables = await Table.find({ restaurantId, status: constant.status.enabled }).populate('position');
  const tablesJson = tables.map((table) => table.toJSON());
  return tablesJson;
};

const getTablePositionFromCache = async ({ restaurantId, tablePostionId }) => {
  if (!tablePostionId) {
    return;
  }
  const key = getRestaurantKey({ restaurantId });
  const clsHookTablePositions = _getTablePositionsFromClsHook({ key });
  if (!_.isEmpty(clsHookTablePositions)) {
    return _.find(clsHookTablePositions, (tablePostion) => tablePostion.id === tablePostionId);
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const tablePostions = _.get(restaurantVal, 'tablePostions');
    setSession({ key, value: { tablePostions } });
    if (!_.isEmpty(tablePostions)) {
      return _.find(tablePostions, (tablePostion) => tablePostion.id === tablePostionId);
    }
  }

  const tablePostion = await TablePosition.findById(tablePostionId).populate('category');
  return tablePostion.toJSON();
};

const getTablePositionsFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookTablePositions = _getTablePositionsFromClsHook({ key });
  if (!_.isEmpty(clsHookTablePositions)) {
    return clsHookTablePositions;
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const tablePostions = _.get(restaurantVal, 'tablePostions');
    if (!_.isEmpty(tablePostions)) {
      setSession({ key, value: restaurantVal });
      return tablePostions;
    }

    const tablePostionModels = await TablePosition.find({ restaurantId, status: constant.status.enabled })
      .populate('employeeCategories')
      .populate('tables');
    const tablePostionsJson = tablePostionModels.map((tablePostion) => tablePostion.toJSON());
    redisClient.putJson({ key, jsonVal: { ...restaurantVal, tablePostions: tablePostionsJson } });
    return tablePostionsJson;
  }

  const tablePostions = await TablePosition.find({ restaurantId, status: constant.status.enabled })
    .populate('employeeCategories')
    .populate('tables');
  const tablePostionsJson = tablePostions.map((tablePostion) => tablePostion.toJSON());
  return tablePostionsJson;
};

const getEmployeeFromCache = async ({ restaurantId, employeeId }) => {
  if (!employeeId) {
    return;
  }
  const key = getRestaurantKey({ restaurantId });
  const clsHookEmployees = _getEmployeesFromClsHook({ key });
  if (!_.isEmpty(clsHookEmployees)) {
    return _.find(clsHookEmployees, (employee) => employee.id === employeeId);
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const employees = _.get(restaurantVal, 'employees');
    setSession({ key, value: { employees } });
    if (!_.isEmpty(employees)) {
      return _.find(employees, (employee) => employee.id === employeeId);
    }
  }

  const employee = await Employee.findById(employeeId).populate('user').populate('position');
  return employee.toJSON();
};

const getEmployeesFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookEmployees = _getEmployeesFromClsHook({ key });
  if (!_.isEmpty(clsHookEmployees)) {
    return clsHookEmployees;
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const employees = _.get(restaurantVal, 'employees');
    if (!_.isEmpty(employees)) {
      setSession({ key, value: restaurantVal });
      return employees;
    }

    const employeeModels = await Employee.find({ restaurantId, status: constant.status.enabled })
      .populate('user')
      .populate('position');
    const employeesJson = employeeModels.map((employee) => employee.toJSON());
    redisClient.putJson({ key, jsonVal: { ...restaurantVal, employees: employeesJson } });
    return employeesJson;
  }

  const employees = await Employee.find({ restaurantId, status: constant.status.enabled })
    .populate('user')
    .populate('position');
  const employeesJson = employees.map((employee) => employee.toJSON());
  return employeesJson;
};

const getEmployeePositionFromCache = async ({ restaurantId, employeePositionId }) => {
  if (!employeePositionId) {
    return;
  }
  const key = getRestaurantKey({ restaurantId });
  const clsHookEmployeePositions = _getEmployeePositionsFromClsHook({ key });
  if (!_.isEmpty(clsHookEmployeePositions)) {
    return _.find(clsHookEmployeePositions, (employeePosition) => employeePosition.id === employeePositionId);
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const employeePositions = _.get(restaurantVal, 'employeePositions');
    setSession({ key, value: { employeePositions } });
    if (!_.isEmpty(employeePositions)) {
      return _.find(employeePositions, (employeePosition) => employeePosition.id === employeePositionId);
    }
  }

  const employeePosition = await EmployeePosition.findById(employeePositionId);
  return employeePosition.toJSON();
};

const getEmployeePositionsFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookEmployeePositions = _getEmployeePositionsFromClsHook({ key });
  if (!_.isEmpty(clsHookEmployeePositions)) {
    return clsHookEmployeePositions;
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const employeePositions = _.get(restaurantVal, 'employeePositions');
    if (!_.isEmpty(employeePositions)) {
      setSession({ key, value: restaurantVal });
      return employeePositions;
    }

    const employeePositionModels = await EmployeePosition.find({ restaurantId, status: constant.status.enabled });
    const employeePositionsJson = employeePositionModels.map((employeePosition) => employeePosition.toJSON());
    redisClient.putJson({ key, jsonVal: { ...restaurantVal, employeePositions: employeePositionsJson } });
    return employeePositionsJson;
  }

  const employeePositions = await EmployeePosition.find({ restaurantId, status: constant.status.enabled });
  const employeePositionsJson = employeePositions.map((employeePosition) => employeePosition.toJSON());
  return employeePositionsJson;
};

const getDepartmentFromCache = async ({ restaurantId, departmentId }) => {
  if (!departmentId) {
    return;
  }
  const key = getRestaurantKey({ restaurantId });
  const clsHookDepartments = _getEmployeePositionsFromClsHook({ key });
  if (!_.isEmpty(clsHookDepartments)) {
    return _.find(clsHookDepartments, (department) => department.id === departmentId);
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const departments = _.get(restaurantVal, 'departments');
    setSession({ key, value: { departments } });
    if (!_.isEmpty(departments)) {
      return _.find(departments, (department) => department.id === departmentId);
    }
  }

  const department = await Department.findById(departmentId);
  return department.toJSON();
};

const getDepartmentsFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookDepartments = _getDepartmentsFromClsHook({ key });
  if (!_.isEmpty(clsHookDepartments)) {
    return clsHookDepartments;
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const departments = _.get(restaurantVal, 'departments');
    if (!_.isEmpty(departments)) {
      setSession({ key, value: restaurantVal });
      return departments;
    }

    const departmentModels = await Department.find({ restaurantId, status: constant.status.enabled });
    const departmentsJson = departmentModels.map((department) => department.toJSON());
    redisClient.putJson({ key, jsonVal: { ...restaurantVal, departments: departmentsJson } });
    return departmentsJson;
  }

  const departments = await EmployeePosition.find({ restaurantId, status: constant.status.enabled });
  const departmentsJson = departments.map((department) => department.toJSON());
  return departmentsJson;
};

module.exports = {
  getRestaurantFromCache,
  getTableFromCache,
  getTablesFromCache,
  getTablePositionFromCache,
  getTablePositionsFromCache,
  getEmployeeFromCache,
  getEmployeesFromCache,
  getEmployeePositionFromCache,
  getEmployeePositionsFromCache,
  getDepartmentFromCache,
  getDepartmentsFromCache,
};
