const Product = require('../models/Product');

const getAllProducts = async () => {
  return await Product.find({}).lean();
};

const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug }).lean();
};

module.exports = {
  getAllProducts,
  getProductBySlug
};
