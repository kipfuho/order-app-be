const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { orderSchema } = require('./order.model');
const { discountSchema } = require('./orderSession.model');

const orderSessionReportSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    table: [{ type: mongoose.Types.ObjectId, ref: 'Table' }],
    orders: [orderSchema],
    discounts: [discountSchema],
    orderSessionNo: { type: Number },
    endedAt: { type: Date },
    auditedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSessionReportSchema.plugin(toJSON);

const OrderSessionReport = mongoose.model('OrderSessionReport', orderSessionReportSchema);

module.exports = {
  orderSessionReportSchema,
  OrderSessionReport,
};
