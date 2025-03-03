const moment = require('moment-timezone');

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const getStartTimeOfToday = ({ timezone = 'UTC', reportTime = 0 }) =>
  moment().tz(timezone).subtract(reportTime, 'hours').startOf('day').add(reportTime, 'hours').toDate();

module.exports = {
  sleep,
  getStartTimeOfToday,
};
