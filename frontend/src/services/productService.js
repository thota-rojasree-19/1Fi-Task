// VITE_API_URL must be set in .env (or the deployment environment) for production use.
// The fallback to http://localhost:5000 is for local development only.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getProductBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/api/products/${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      return { success: false, status: 404, message: "Product not found" };
    }
    throw new Error('Failed to fetch product details');
  }
  return response.json();
};
