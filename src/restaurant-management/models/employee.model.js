const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { status } = require('../../utils/constant');

const employeeSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    name: { type: String },
    position: { type: mongoose.Types.ObjectId, ref: 'EmployeePosition' },
    status: { type: String, enum: [status.enabled, status.disabled], default: status.enabled },
    permissions: [String],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeeSchema.plugin(toJSON);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
