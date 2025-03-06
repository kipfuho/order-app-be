const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

const tablePositionSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    dishCategories: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'DishCategory',
      },
    ],
    tables: [{ type: mongoose.Types.ObjectId, ref: 'Table' }],
    status: { type: String, enum: [Status.enabled, Status.disabled], default: Status.enabled },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tablePositionSchema.plugin(toJSON);

const TablePosition = mongoose.model('TablePosition', tablePositionSchema);

module.exports = TablePosition;
