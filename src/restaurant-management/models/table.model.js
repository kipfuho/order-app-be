const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const tablePositionSchema = mongoose.Schema(
  {
    name: { type: String },
    tablePosition: { type: mongoose.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tablePositionSchema.plugin(toJSON);

const Table = mongoose.model('Table', tablePositionSchema);

module.exports = Table;
