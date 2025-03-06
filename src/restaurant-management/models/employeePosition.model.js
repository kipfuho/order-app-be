const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

const employeePositionSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    status: { type: String, enum: [Status.enabled, Status.disabled], default: Status.enabled },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeePositionSchema.plugin(toJSON);

const EmployeePosition = mongoose.model('EmployeePosition', employeePositionSchema);

module.exports = EmployeePosition;
