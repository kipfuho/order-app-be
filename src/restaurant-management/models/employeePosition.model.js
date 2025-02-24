const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const employeePositionSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    status: { type: String },
    permissions: [String],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeePositionSchema.plugin(toJSON);

const EmployeePosition = mongoose.model('EmployeePosition', employeePositionSchema);

module.exports = EmployeePosition;
