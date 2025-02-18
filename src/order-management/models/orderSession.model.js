const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const orderSessionSchema = mongoose.Schema(
  {
    name: { type: String },
    position: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSessionSchema.plugin(toJSON);

const OrderSession = mongoose.model('OrderSession', orderSessionSchema);

module.exports = OrderSession;
