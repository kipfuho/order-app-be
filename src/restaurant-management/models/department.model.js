const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { status } = require('../../utils/constant');

const employeeDepartmentSchema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    name: {
      type: String,
      trim: true,
    },
    permissions: {
      type: [String],
    },
    status: {
      type: String,
      enum: [status.enabled, status.disabled],
      default: status.enabled,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeeDepartmentSchema.plugin(toJSON);

const EmployeeDepartment = mongoose.model('Department', employeeDepartmentSchema);

module.exports = EmployeeDepartment;
