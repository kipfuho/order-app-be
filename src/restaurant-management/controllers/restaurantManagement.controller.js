const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const restaurantManagementService = require('../services/restaurantManagement.service');

const getRestaurant = catchAsync(async (req, res) => {
  const restaurantId = _.get(req, 'params.restaurantId');
  const restaurant = await restaurantManagementService.getRestaurant(restaurantId);
  res.status(httpStatus.OK).send({ restaurant });
});

const createRestaurant = catchAsync(async (req, res) => {
  const createBody = req.body;
  const restaurant = await restaurantManagementService.createRestaurant(createBody);
  res.status(httpStatus.CREATED).send({ restaurant });
});

const updateRestaurant = catchAsync(async (req, res) => {
  const restaurantId = _.get(req, 'params.restaurantId');
  const updateBody = req.body;
  await restaurantManagementService.updateRestaurant(restaurantId, updateBody);
  res.status(httpStatus.OK).send({ message: 'Cập nhật thành công' });
});

const deleteRestaurant = catchAsync(async (req, res) => {
  const restaurantId = _.get(req, 'params.restaurantId');
  await restaurantManagementService.deleteRestaurant(restaurantId);
  res.status(httpStatus.OK).send({ message: 'Xoá thành công' });
});

module.exports = {
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
