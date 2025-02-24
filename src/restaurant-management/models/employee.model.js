const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const employeeSchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    name: { type: String },
    position: { type: mongoose.Types.ObjectId, ref: 'EmployeePosition' },
    status: { type: String },
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
