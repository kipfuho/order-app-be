const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const discountProductSchema = mongoose.Schema(
  {
    dish: { type: mongoose.Types.ObjectId, ref: 'Dish' },
    dishName: { type: String },
    dishQuantity: { type: String },
    discountType: { type: String }, // discount invoice, discount product
    discountValue: { type: Number },
    discountValueType: { type: String }, // percentage, absolute amount
    beforeTaxTotalDiscountAmount: { type: Number },
    afterTaxTotalDiscountAmount: { type: Number },
    taxTotalDiscountAmount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const discountSchema = mongoose.Schema(
  {
    name: { type: String },
    discountType: { type: String }, // discount invoice, discount product
    discountValue: { type: Number },
    discountValueType: { type: String }, // percentage, absolute amount
    beforeTaxTotalDiscountAmount: { type: Number },
    afterTaxTotalDiscountAmount: { type: Number },
    taxTotalDiscountAmount: { type: Number },
    discountProducts: [discountProductSchema],
  },
  {
    timestamps: true,
  }
);

const orderSessionSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    table: [{ type: mongoose.Types.ObjectId, ref: 'Table' }],
    orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
    discounts: [discountSchema],
    orderSessionNo: { type: Number },
    endedAt: { type: Date },
    auditedAt: { type: Date },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSessionSchema.plugin(toJSON);

const OrderSession = mongoose.model('OrderSession', orderSessionSchema);

module.exports = {
  discountSchema,
  orderSessionSchema,
  OrderSession,
};
