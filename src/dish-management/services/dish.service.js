const { Dish } = require('../../models');
const { throwBadRequest } = require('../../utils/errorHandling');

const getDish = async (dishId) => {
  const dish = await Dish.findById(dishId);
  throwBadRequest(!dish, 'Không tìm thấy món ăn');
  return dish;
};

const createDish = async (createBody) => {
  const dish = await Dish.create(createBody);
  return dish;
};

const updateDish = async (dishId, updateBody) => {
  const dish = await Dish.findByIdAndUpdate(dishId, { $set: updateBody }, { new: true });
  throwBadRequest(!dish, 'Không tìm thấy món ăn');
  return dish;
};

const deleteDish = async (dishId) => {
  await Dish.deleteOne({ _id: dishId });
};

const getDishes = async () => {};

module.exports = {
  getDish,
  createDish,
  updateDish,
  deleteDish,
  getDishes,
};
