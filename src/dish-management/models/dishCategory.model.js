const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');

const dishCategorySchema = mongoose.Schema(
  {
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
dishCategorySchema.plugin(toJSON);

const DishCategory = mongoose.model('DishCategory', dishCategorySchema);

module.exports = DishCategory;
