const { Restaurant } = require('../../models');
const { throwBadRequest } = require('../../utils/errorHandling');

const getRestaurant = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  throwBadRequest(!restaurant, 'Không tìm thấy nhà hàng');
  return restaurant;
};

const createRestaurant = async (createBody) => {
  const restaurant = await Restaurant.create(createBody);
  return restaurant;
};

const updateRestaurant = async (restaurantId, updateBody) => {
  const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { $set: updateBody }, { new: true });
  throwBadRequest(!restaurant, 'Không tìm thấy nhà hàng');
  return restaurant;
};

const deleteRestaurant = async (restaurantId) => {
  await Restaurant.deleteOne({ _id: restaurantId });
};

const getRestaurantes = async () => {};

module.exports = {
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantes,
};
