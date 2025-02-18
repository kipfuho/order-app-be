const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const orderSchema = mongoose.Schema(
  {
    name: { type: String },
    position: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
