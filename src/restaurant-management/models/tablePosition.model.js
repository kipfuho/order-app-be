const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const tablePositionSchema = mongoose.Schema(
  {
    name: { type: String },
    dishCategories: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tablePositionSchema.plugin(toJSON);

const TablePosition = mongoose.model('TablePosition', tablePositionSchema);

module.exports = TablePosition;
