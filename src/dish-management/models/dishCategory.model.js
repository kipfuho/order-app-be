const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const dishCategorySchema = mongoose.Schema(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
dishCategorySchema.plugin(toJSON);

const DishCategory = mongoose.model('DishCategory', dishCategorySchema);

module.exports = DishCategory;
