const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const { Status } = require('../../utils/constant');

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
      enum: [Status.enabled, Status.disabled],
      default: Status.enabled,
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
