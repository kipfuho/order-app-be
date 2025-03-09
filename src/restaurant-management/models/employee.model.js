const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

const employeeSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    name: { type: String },
    position: { type: mongoose.Types.ObjectId, ref: 'EmployeePosition' },
    department: { type: mongoose.Types.ObjectId, ref: 'Department' },
    status: { type: String, enum: [Status.enabled, Status.disabled], default: Status.enabled },
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
