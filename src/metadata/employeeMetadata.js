const _ = require('lodash');
const redisClient = require('../utils/redis');
const { getSession, setSession } = require('../middlewares/clsHooked');
const { Employee, EmployeePosition, Department } = require('../models');
const { getRestaurantKey } = require('./common');
const constant = require('../utils/constant');

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
  getEmployeeFromCache,
  getEmployeesFromCache,
  getEmployeePositionFromCache,
  getEmployeePositionsFromCache,
  getDepartmentFromCache,
  getDepartmentsFromCache,
};
