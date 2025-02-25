const redisClient = require('../utils/redis');

const getRestaurantKey = ({ restaurantId }) => `restaurant_${restaurantId}`;
const getMenuKey = ({ restaurantId }) => `menu_${restaurantId}`;

const deleteRestaurantKey = async ({ restaurantId }) => {
  if (redisClient.isRedisConnected()) {
    redisClient.deleteKey(getRestaurantKey({ restaurantId }));
  }
};

const deleteMenuKey = async ({ restaurantId }) => {
  if (redisClient.isRedisConnected()) {
    redisClient.deleteKey(getMenuKey({ restaurantId }));
  }
};

module.exports = {
  getRestaurantKey,
  getMenuKey,
  deleteRestaurantKey,
  deleteMenuKey,
};
