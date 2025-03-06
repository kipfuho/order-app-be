const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

const restaurantSchema = mongoose.Schema(
  {
    status: { type: String, enum: [Status.enabled, Status.disabled], default: Status.enabled },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    owner: { type: mongoose.Types.ObjectId, ref: 'User' },
    taxRate: { type: Number },
    dishPriceRoundingType: { type: String },
    discountRoundingType: { type: String },
    taxRoundingType: { type: String },
    calculateTaxDirectly: {
      type: Boolean,
    },
    country: {
      name: { type: String },
      currency: { type: String },
    },
    utcOffset: { type: Number, default: 7 },
    /**
     * Timezone string of moment.js
     * https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a
     */
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh',
    },
    reportTime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
