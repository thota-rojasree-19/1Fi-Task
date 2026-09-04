const mongoose = require('mongoose');

const EmiPlanSchema = new mongoose.Schema({
  monthlyPayment: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number, required: true, min: 0 },
  cashback: { type: Number, default: 0, min: 0 }
}, { _id: false });

const VariantSchema = new mongoose.Schema({
  storage: { type: String, required: true },
  color: { type: String, required: true },
  finish: { type: String, required: true },
  mrp: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  emiPlans: {
    type: [EmiPlanSchema],
    validate: {
      validator: function(v) { return v && v.length >= 1; },
      message: 'A variant must have at least one EMI plan'
    },
    required: true
  }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  variants: {
    type: [VariantSchema],
    validate: {
      validator: function(v) { return v && v.length >= 2; },
      message: 'A product must have at least two variants'
    },
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
