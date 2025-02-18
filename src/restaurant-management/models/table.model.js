const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const tableSchema = mongoose.Schema(
  {
    name: { type: String },
    position: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tableSchema.plugin(toJSON);

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
