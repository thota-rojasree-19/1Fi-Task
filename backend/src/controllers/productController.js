const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await productService.getProductBySlug(slug);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(`Error fetching product ${req.params.slug}:`, error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getProducts,
  getProduct
};
