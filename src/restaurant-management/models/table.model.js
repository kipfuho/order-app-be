const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const tablePositionSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    tablePosition: { type: mongoose.Types.ObjectId },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tablePositionSchema.plugin(toJSON);

const Table = mongoose.model('Table', tablePositionSchema);

module.exports = Table;
