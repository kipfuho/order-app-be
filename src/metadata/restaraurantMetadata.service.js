const _ = require('lodash');
const redisClient = require('../utils/redis');
const { getSession, setSession } = require('../middlewares/clsHooked');
const { Restaurant } = require('../models');
const { getRestaurantKey } = require('./common');
const constant = require('../utils/constant');

const _getRestaurantFromClsHook = ({ key }) => {
  const restaurantVal = getSession({ key });
  const restaurant = _.get(restaurantVal, 'restaurant');
  return restaurant;
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

module.exports = {
  getRestaurantFromCache,
};
