const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

const tablePositionSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    position: { type: mongoose.Types.ObjectId, ref: 'TablePosition' },
    status: { type: String, enum: [Status.enabled, Status.disabled], default: Status.enabled },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tablePositionSchema.plugin(toJSON);

const Table = mongoose.model('Table', tablePositionSchema);

module.exports = Table;
