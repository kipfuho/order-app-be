const _ = require('lodash');
const redisClient = require('../utils/redis');
const { getSession, setSession } = require('../middlewares/clsHooked');
const { Dish } = require('../models');

const _getKey = ({ restaurantId }) => `menuFull_${restaurantId}`;

const _getDishesFromClsHook = ({ key }) => {
  const menuVal = getSession({ key });
  const dishes = _.get(menuVal, 'dishes');
  return dishes;
};

const getDishFromCache = async ({ restaurantId, dishId }) => {
  if (!dishId) {
    return;
  }
  const key = _getKey({ restaurantId });
  const clsHookDishes = _getDishesFromClsHook({ key });
  if (!_.isEmpty(clsHookDishes)) {
    return _.find(clsHookDishes, (dish) => dish.id === dishId);
  }

  if (redisClient.isRedisConnected()) {
    const menuVal = await redisClient.getJson(key);
    const dishes = _.get(menuVal, 'dishes');
    setSession({ key, value: { dishes } });
    if (!_.isEmpty(dishes)) {
      return _.find(dishes, (dish) => dish.id === dishId);
    }
  }

  const dish = await Dish.findById(dishId).populate('category');
  return dish.toJSON();
};

const getDishesFromCache = async ({ restaurantId }) => {
  const key = _getKey({ restaurantId });
  const clsHookDishes = _getDishesFromClsHook({ key });
  if (!_.isEmpty(clsHookDishes)) {
    return clsHookDishes;
  }

  if (redisClient.isRedisConnected()) {
    const menuVal = await redisClient.getJson(key);
    const dishes = _.get(menuVal, 'dishes');
    if (!_.isEmpty(dishes)) {
      setSession({ key, value: menuVal });
      return dishes;
    }

    const dishModels = await Dish.find({ restaurantId, status: 'enabled' }).populate('category');
    const dishesJson = dishModels.map((dish) => dish.toJSON());
    redisClient.putJson({ key, jsonVal: { ...menuVal, dishes: dishesJson } });
    return dishesJson;
  }

  const dishes = await Dish.find({ restaurantId, status: 'enabled' }).populate('category');
  const dishesJson = dishes.map((dish) => dish.toJSON());
  return dishesJson;
};

module.exports = {
  getDishFromCache,
  getDishesFromCache,
};
