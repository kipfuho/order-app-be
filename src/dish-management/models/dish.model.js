const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const dishSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    unit: { type: String },
    price: {
      type: Number,
    },
    taxIncludedPrice: {
      type: Number,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'DishCategory',
    },
    type: { type: String },
    taxRate: { type: Number },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
dishSchema.plugin(toJSON);

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
