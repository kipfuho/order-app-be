const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const dishOrderSchema = mongoose.Schema(
  {
    dish: { type: mongoose.Types.ObjectId, ref: 'Dish' },
    orderSessionId: { type: mongoose.Types.ObjectId, ref: 'OrderSession' },
    name: { type: String },
    unit: { type: String },
    price: { type: Number },
    quantity: { type: String },
    beforeTaxTotalPrice: { type: Number },
    afterTaxTotalPrice: { type: Number },
    taxRate: { type: Number },
    taxAmount: { type: Number },
    beforeTaxTotalDiscountAmount: { type: Number },
    afterTaxTotalDiscountAmount: { type: Number },
    taxTotalDiscountAmount: { type: Number },
    paymentAmount: { type: Number }, // after discount, after tax
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

const orderSchema = mongoose.Schema(
  {
    dishOrders: [dishOrderSchema],
    returnedDishOrders: [dishOrderSchema],
    orderNo: { type: Number },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);

const Order = mongoose.model('Order', orderSchema);

module.exports = {
  dishOrderSchema,
  orderSchema,
  Order,
};
