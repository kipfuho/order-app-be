const _ = require('lodash');
const redisClient = require('../utils/redis');
const { getSession, setSession } = require('../middlewares/clsHooked');
const { Restaurant, Table, TablePosition, Employee, EmployeePosition, Department } = require('../models');
const { getRestaurantKey } = require('./common');
const constant = require('../utils/constant');

const deleteRestaurantFromCache = async (key) => {};

const deleteTableFromCache = async (key) => {};

const deleteEmployeeFromCache = async (key) => {};

const deleteDepartmentFromCache = async (key) => {};

const _getRestaurantFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const restaurant = _.get(restaurantVal, 'restaurant');
  return restaurant;
};

const _getTablesFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const tables = _.get(restaurantVal, 'tables');
  return tables;
};

const _getTablePositionsFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const tablePositions = _.get(restaurantVal, 'tables');
  return tablePositions;
};

const _getEmployeesFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const employees = _.get(restaurantVal, 'employees');
  return employees;
};

const _getEmployeePositionsFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const employeePositions = _.get(restaurantVal, 'employees');
  return employeePositions;
};

const _getDepartmentsFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const departments = _.get(restaurantVal, 'departments');
  return departments;
};

const getRestaurantFromCache = async ({ restaurantId }) => {
  const key = getRestaurantKey({ restaurantId });
  const clsHookRestaurant = _getRestaurantFromClsHook({ key });
  if (!_.isEmpty(clsHookRestaurant)) {
    return clsHookRestaurant;
  }

  if (redisClient.isRedisConnected()) {
    const restaurantVal = await redisClient.getJson(key);
    const restaurant = _.get(restaurantVal, 'restaurant');
    if (!_.isEmpty(restaurant)) {
      setSession({ key, value: restaurantVal });
      return restaurant;
    }

    const restaurantModel = await Restaurant.find({ _id: restaurantId, status: constant.Status.enabled });
    const restaurantJson = restaurantModel.toJSON();
    const newRestaurantVal = { ...restaurantVal, restaurant: restaurantJson };
    redisClient.putJson({ key, jsonVal: newRestaurantVal });
    setSession({ key, value: newRestaurantVal });
    return restaurantJson;
  }

  const currentRestarantClsHookVal = getSession({ key });
  const restaurant = await Restaurant.find({ _id: restaurantId, status: constant.Status.enabled });
  const restaurantJson = restaurant.toJSON();
  setSession({ key, value: { ...currentRestarantClsHookVal, restaurant: restaurantJson } });
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
    if (!_.isEmpty(tables)) {
      setSession({ key, value: restaurantVal });
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

    const tableModels = await Table.find({ restaurantId, status: constant.Status.enabled }).populate('position');
    const tablesJson = tableModels.map((table) => table.toJSON());
    const newRestaurantVal = { ...restaurantVal, tables: tablesJson };
    redisClient.putJson({ key, jsonVal: newRestaurantVal });
    setSession({ key, value: newRestaurantVal });
    return tablesJson;
  }

  const currentRestarantClsHookVal = getSession({ key });
  const tables = await Table.find({ restaurantId, status: constant.Status.enabled }).populate('position');
  const tablesJson = tables.map((table) => table.toJSON());
  setSession({ key, value: { ...currentRestarantClsHookVal, tables: tablesJson } });
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
    if (!_.isEmpty(tablePostions)) {
      setSession({ key, value: restaurantVal });
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

    const tablePostionModels = await TablePosition.find({ restaurantId, status: constant.Status.enabled })
      .populate('dishCategories')
      .populate('tables');
    const tablePostionsJson = tablePostionModels.map((tablePostion) => tablePostion.toJSON());
    const newRestaurantVal = { ...restaurantVal, tablePostions: tablePostionsJson };
    redisClient.putJson({ key, jsonVal: newRestaurantVal });
    setSession({ key, value: newRestaurantVal });
    return tablePostionsJson;
  }

  const currentRestarantClsHookVal = getSession({ key });
  const tablePostions = await TablePosition.find({ restaurantId, status: constant.Status.enabled })
    .populate('dishCategories')
    .populate('tables');
  const tablePostionsJson = tablePostions.map((tablePostion) => tablePostion.toJSON());
  setSession({ key, value: { ...currentRestarantClsHookVal, tablePostions: tablePostionsJson } });
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
    if (!_.isEmpty(employees)) {
      setSession({ key, value: restaurantVal });
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

    const employeeModels = await Employee.find({ restaurantId, status: constant.Status.enabled })
      .populate('user')
      .populate('position');
    const employeesJson = employeeModels.map((employee) => employee.toJSON());
    const newRestaurantVal = { ...restaurantVal, employees: employeesJson };
    redisClient.putJson({ key, jsonVal: newRestaurantVal });
    setSession({ key, value: newRestaurantVal });
    return employeesJson;
  }

  const currentRestarantClsHookVal = getSession({ key });
  const employees = await Employee.find({ restaurantId, status: constant.Status.enabled })
    .populate('user')
    .populate('position');
  const employeesJson = employees.map((employee) => employee.toJSON());
  setSession({ key, value: { ...currentRestarantClsHookVal, employees: employeesJson } });
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
    if (!_.isEmpty(employeePositions)) {
      setSession({ key, value: restaurantVal });
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

    const employeePositionModels = await EmployeePosition.find({ restaurantId, status: constant.Status.enabled });
    const employeePositionsJson = employeePositionModels.map((employeePosition) => employeePosition.toJSON());
    const newRestaurantVal = { ...restaurantVal, employeePositions: employeePositionsJson };
    redisClient.putJson({ key, jsonVal: newRestaurantVal });
    setSession({ key, value: newRestaurantVal });
    return employeePositionsJson;
  }

  const currentRestarantClsHookVal = getSession({ key });
  const employeePositions = await EmployeePosition.find({ restaurantId, status: constant.Status.enabled });
  const employeePositionsJson = employeePositions.map((employeePosition) => employeePosition.toJSON());
  setSession({ key, value: { ...currentRestarantClsHookVal, employeePositions: employeePositionsJson } });
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
    if (!_.isEmpty(departments)) {
      setSession({ key, value: restaurantVal });
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

    const departmentModels = await Department.find({ restaurantId, status: constant.Status.enabled });
    const departmentsJson = departmentModels.map((department) => department.toJSON());
    const newRestaurantVal = { ...restaurantVal, departments: departmentsJson };
    redisClient.putJson({ key, jsonVal: newRestaurantVal });
    setSession({ key, value: newRestaurantVal });
    return departmentsJson;
  }

  const currentRestarantClsHookVal = getSession({ key });
  const departments = await EmployeePosition.find({ restaurantId, status: constant.Status.enabled });
  const departmentsJson = departments.map((department) => department.toJSON());
  setSession({ key, value: { ...currentRestarantClsHookVal, departments: departmentsJson } });
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
