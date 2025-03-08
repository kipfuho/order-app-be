const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

const unitSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String, trim: true },
    shortName: { type: String, trim: true },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [Status.activated, Status.deactivated, Status.disabled],
      default: Status.activated,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
unitSchema.plugin(toJSON);

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
