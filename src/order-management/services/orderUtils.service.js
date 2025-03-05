const _ = require('lodash');
const moment = require('moment-timezone');
const redisClient = require('../../utils/redis');
const { getRestaurantFromCache } = require('../../metadata/restaraurantMetadata.service');
const { getRestaurantTimeZone } = require('../../middlewares/clsHooked');
const { Order, OrderSession } = require('../../models');
const { getDishesFromCache } = require('../../metadata/dishMetadata.service');

const formatDateTimeToISOStringRegardingReportTime = ({ dateTime, reportTime }) => {
  try {
    const timeZone = getRestaurantTimeZone();
    let rpTime = reportTime;
    if (!rpTime) {
      rpTime = 0;
    }
    return moment(dateTime)
      .subtract(reportTime, 'h')
      .tz(timeZone)
      .toISOString(true)
      .replace(/\+0\d:00/, 'Z');
  } catch (err) {
    return dateTime.toISOString();
  }
};

const getNextAvailableOrderNo = async ({ restaurantId, keyBase, lastOrderNo }) => {
  let currentOrderNo = lastOrderNo;
  const retryTime = 10;
  if (redisClient.isRedisConnected()) {
    for (let counter = 0; counter < retryTime; counter += 1) {
      currentOrderNo += 1;
      const key = `${restaurantId}_${keyBase}_${currentOrderNo}`;
      // eslint-disable-next-line no-await-in-loop
      const canUseOrderNo = await redisClient.getCloudLock({ key, periodInSecond: 60 * 5 });
      if (canUseOrderNo) {
        return currentOrderNo;
      }
    }
  }
  return currentOrderNo + 1;
};

const getOrderSessionNoForNewOrderSession = async (restaurantId, createdAt) => {
  let lastActiveOrderSession;
  if (createdAt) {
    lastActiveOrderSession = await OrderSession.getLastActiveOrderSessionBeforeCreatedAt(restaurantId, createdAt);
  } else {
    lastActiveOrderSession = await OrderSession.getLastActiveOrderSessionSortByOrderSessionNo(restaurantId);
  }
  // not existed last active order session in this restaurant => default = 1
  if (_.isEmpty(lastActiveOrderSession)) {
    return 1;
  }
  const restaurant = await getRestaurantFromCache({ restaurantId });
  const reportTime = restaurant.reportTime || 0;
  // get orderSessionNo with default = 1
  const lastActiveOrderSessionNo = _.get(lastActiveOrderSession, 'orderSessionNo', 0);
  // check diffrent time between lastActiveOrderSession and current
  const current = formatDateTimeToISOStringRegardingReportTime({ dateTime: new Date(), reportTime });
  const lastActiveOrderSessionCreatedAt = formatDateTimeToISOStringRegardingReportTime({
    dateTime: _.get(lastActiveOrderSession, 'createdAt', new Date()),
    reportTime,
  });
  if (current.substring(0, 10) === lastActiveOrderSessionCreatedAt.substring(0, 10)) {
    return getNextAvailableOrderNo({
      restaurantId,
      keyBase: 'orderSessionNo',
      lastOrderNo: lastActiveOrderSessionNo,
    });
  }
  return getNextAvailableOrderNo({
    restaurantId,
    keyBase: 'orderSessionNo',
    lastOrderNo: 0,
  });
};

const getOrCreateOrderSession = async ({ orderSessionId, tableId, restaurantId }) => {
  if (orderSessionId) {
    const orderSession = await OrderSession.findById(orderSessionId);
    return orderSession;
  }

  const orderSessionNo = await getOrderSessionNoForNewOrderSession(restaurantId);
  const orderSession = await OrderSession.create({ tables: [tableId], restaurantId, orderSessionNo });

  return orderSession.toJSON();
};

const createNewOrder = async ({ tableId, restaurantId, orderSessionId, newOrder, orderNo }) => {
  const dishes = await getDishesFromCache({ restaurantId });
  const dishById = _.keyBy(dishes, 'id');
  const dishOrders = newOrder.dishOrders.map((dishOrder) => {
    const { dishId, quantity, name, taxRate, price, isTaxIncludedPrice } = dishOrder;
    if (!dishId) {
      return {
        dishId,
        quantity,
        name,
        taxRate,
        price: isTaxIncludedPrice ? null : price,
        taxIncludedPrice: isTaxIncludedPrice ? price : null,
      };
    }
    const dish = dishById[dishId];
    return {
      dishId,
      quantity,
      name: _.get(dish, 'name', name),
      unit: _.get(dish, 'unit', ''),
      taxRate,
      price: _.get(dish, 'unit', isTaxIncludedPrice ? null : price),
      taxIncludedPrice: _.get(dish, 'unit', isTaxIncludedPrice ? price : null),
    };
  });
  const order = await Order.create({ tableId, restaurantId, orderSessionId, orderNo, dishOrders });

  return order.toJSON();
};

module.exports = {
  createNewOrder,
  getOrCreateOrderSession,
};
