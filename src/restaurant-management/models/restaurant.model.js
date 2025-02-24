const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const restaurantSchema = mongoose.Schema(
  {
    status: { type: String },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    owner: { type: mongoose.Types.ObjectId, ref: 'User' },
    taxRate: { type: Number },
    dishPriceRoundingType: { type: String },
    discountRoundingType: { type: String },
    taxRoundingType: { type: String },
    country: {
      name: { type: String },
      currency: { type: String },
    },
    utcOffset: { type: Number },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
