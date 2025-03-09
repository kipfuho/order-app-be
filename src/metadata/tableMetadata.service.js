const _ = require('lodash');
const redisClient = require('../utils/redis');
const { getSession, setSession } = require('../middlewares/clsHooked');
const { Table, TablePosition } = require('../models');
const { getRestaurantKey } = require('./common');
const constant = require('../utils/constant');

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

module.exports = {
  getTableFromCache,
  getTablesFromCache,
  getTablePositionFromCache,
  getTablePositionsFromCache,
};
