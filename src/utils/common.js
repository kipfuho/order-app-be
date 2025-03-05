const moment = require('moment-timezone');
const { getRestaurantTimeZone } = require('../middlewares/clsHooked');

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const getStartTimeOfToday = ({ timezone = 'UTC', reportTime = 0 }) =>
  moment().tz(timezone).subtract(reportTime, 'hours').startOf('day').add(reportTime, 'hours').toDate();

const formatDateTime = ({ dateTime, format, timeZone }) => {
  moment.locale('en');
  if (!timeZone) {
    // eslint-disable-next-line no-param-reassign
    timeZone = getRestaurantTimeZone();
  }

  // eslint-disable-next-line no-param-reassign
  return moment(dateTime).tz(timeZone).format(format);
};

const formatDateDDMMYYYY = (dateTime, timeZone) => formatDateTime({ dateTime, timeZone, format: 'DD/MM/YYYY' });

module.exports = {
  sleep,
  getStartTimeOfToday,
  formatDateDDMMYYYY,
};
