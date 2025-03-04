const _ = require('lodash');
const { Order } = require('../../models');
const orderUtilService = require('./orderUtils.service');

const createOrder = async ({ tableId, restaurantId, orderSessionId, newOrder }) => {
  const orderSession = await orderUtilService.getOrCreateOrderSession({ orderSessionId, tableId, restaurantId });
  const order = await orderUtilService.createNewOrder({ tableId, restaurantId, orderSessionId, newOrder });
  orderSession.orders = [order];
  return orderSession;
};

const increaseDishQuantity = async ({ orderId, dishId, newQuantity }) => {
  const order = await Order.findById(orderId);
  const dishOrder = _.find(order.dishOrders, { dishId });
  if (dishOrder) {
    dishOrder.quantity = newQuantity;
    await order.save();
  }
  return order.toJSON();
};

const decreaseDishQuantity = async ({ orderId, dishId, newQuantity }) => {
  const order = await Order.findById(orderId);
  const dishOrder = _.find(order.dishOrders, { dishId });
  if (dishOrder) {
    dishOrder.quantity = newQuantity;
    await order.save();
  }
  return order.toJSON();
};

const updateOrder = async ({ orderUpdates }) => {
  const orderIds = _.map(orderUpdates, 'orderId');
  const orders = await Order.find({ _id: { $in: orderIds } });
  const orderById = _.keyBy(
    _.map(orders, (order) => order.toJSON()),
    'id'
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const orderUpdate of orderUpdates) {
    const order = orderById[orderUpdate.orderId];
    if (order) {
      // more optimize may be?
      const dishOrder = _.find(order.dishOrders, { dishId: orderUpdate.dishId });
      if (dishOrder) {
        dishOrder.quantity = orderUpdate.quantity;
      }
    }
  }

  const bulkOps = [];
  _.forEach(orderById, (order) => {
    bulkOps.push({
      updateOne: {
        filter: { _id: order.id },
        update: {
          $set: {
            dishOrders: order.dishOrders,
          },
        },
      },
    });
  });

  await Order.bulkWrite(bulkOps);
};

const getOrders = () => {};

const getOrderDetail = () => {};

const payOrder = () => {};

const cancelOrder = () => {};

const cancelPaidStatus = () => {};

const getOrderHistory = () => {};

const updateCart = () => {};

const checkoutCart = () => {};

const discountDish = () => {};

const discountOrder = () => {};

module.exports = {
  createOrder,
  increaseDishQuantity,
  decreaseDishQuantity,
  updateOrder,
  getOrders,
  getOrderDetail,
  payOrder,
  cancelOrder,
  cancelPaidStatus,
  getOrderHistory,
  updateCart,
  checkoutCart,
  discountDish,
  discountOrder,
};
