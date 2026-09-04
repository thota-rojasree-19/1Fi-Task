import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/productService';

const ProductPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Independent storage and color selections — Flipkart-style
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedEmiIndex, setSelectedEmiIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const result = await getProductBySlug(slug);
        if (result.success) {
          const p = result.data;
          setProduct(p);
          // Default to the first variant's storage and color
          setSelectedStorage(p.variants[0]?.storage || null);
          setSelectedColor(p.variants[0]?.color || null);
          setSelectedEmiIndex(null);
          setImgError(false);
        } else if (result.status === 404) {
          setNotFound(true);
        } else {
          throw new Error('API returned failure');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  // Derive unique ordered storage and color options from the API response
  const storageOptions = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.storage))];
  }, [product]);

  const colorOptions = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.color))];
  }, [product]);

  // Find the database variant matching the current storage + color selection
  const currentVariant = useMemo(() => {
    if (!product || !selectedStorage || !selectedColor) return null;
    return product.variants.find(
      v => v.storage === selectedStorage && v.color === selectedColor
    ) || null;
  }, [product, selectedStorage, selectedColor]);

  // Check whether a particular storage/color option forms a valid combo in the database
  const isStorageAvailable = (storage) => {
    if (!product || !selectedColor) return false;
    return product.variants.some(v => v.storage === storage && v.color === selectedColor);
  };

  const isColorAvailable = (color) => {
    if (!product || !selectedStorage) return false;
    return product.variants.some(v => v.color === color && v.storage === selectedStorage);
  };

  const handleStorageChange = (storage) => {
    if (storage === selectedStorage) return;
    setSelectedStorage(storage);
    // If the current color is unavailable for the new storage, reset to first available
    const stillValid = product.variants.some(v => v.storage === storage && v.color === selectedColor);
    if (!stillValid) {
      const firstValid = product.variants.find(v => v.storage === storage);
      setSelectedColor(firstValid?.color || null);
    }
    setSelectedEmiIndex(null);
    setImgError(false);
  };

  const handleColorChange = (color) => {
    if (color === selectedColor) return;
    setSelectedColor(color);
    setSelectedEmiIndex(null);
    setImgError(false);
  };

  const handleProceed = () => {
    if (selectedEmiIndex !== null) setShowModal(true);
  };

  // ── Loading / error / 404 states ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-xl text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Product not found.</h2>
        <p className="text-lg text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Return to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
          <p className="text-lg text-red-700 font-medium">{error}</p>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline font-medium">
            &larr; Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !currentVariant) return null;

  const selectedEmiPlan = selectedEmiIndex !== null ? currentVariant.emiPlans[selectedEmiIndex] : null;

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to products
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* ── Left: Product Image ── */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center border border-gray-100 shadow-sm h-96 lg:h-[580px] lg:sticky lg:top-6">
            {!imgError ? (
              <img
                src={currentVariant.imageUrl}
                alt={`${product.name} ${currentVariant.color}`}
                className="max-h-full max-w-full object-contain transition-opacity duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <svg className="w-24 h-24 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg">Image not available</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Details ── */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{product.name}</h1>
          <p className="text-base text-gray-500 mb-2">{currentVariant.storage} · {currentVariant.color} · {currentVariant.finish}</p>
          <p className="text-base text-gray-600 mb-6">{product.description}</p>

          {/* Pricing */}
          <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-end gap-4 mb-1">
              <span className="text-4xl font-black text-gray-900">
                ₹{currentVariant.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-gray-400 line-through mb-1">
                MRP ₹{currentVariant.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-sm font-semibold text-green-600">
              Save ₹{(currentVariant.mrp - currentVariant.price).toLocaleString('en-IN')}
            </p>
          </div>

          {/* ── Storage Selector ── */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Storage
            </h3>
            <div className="flex flex-wrap gap-2">
              {storageOptions.map((storage) => {
                const available = isStorageAvailable(storage);
                const isSelected = selectedStorage === storage;
                return (
                  <button
                    key={storage}
                    onClick={() => available && handleStorageChange(storage)}
                    disabled={!available}
                    className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all duration-150
                      ${isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : available
                          ? 'border-gray-300 bg-white text-gray-800 hover:border-blue-400 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                      }`}
                  >
                    {storage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Color Selector ── */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Color — <span className="font-bold text-gray-700 normal-case tracking-normal">{selectedColor}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => {
                const available = isColorAvailable(color);
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => available && handleColorChange(color)}
                    disabled={!available}
                    className={`px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all duration-150
                      ${isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-sm'
                        : available
                          ? 'border-gray-300 bg-white text-gray-800 hover:border-blue-400 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                      }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── EMI Plans ── */}
          <div className="mb-8 flex-grow">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select EMI Plan</h3>
            <div className="space-y-3">
              {currentVariant.emiPlans.map((plan, index) => {
                const isSelected = selectedEmiIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedEmiIndex(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-150
                      ${isSelected
                        ? 'border-green-500 bg-green-50/60 ring-1 ring-green-500 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className={`text-xl font-bold mb-0.5 ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>
                        ₹{plan.monthlyPayment.toLocaleString('en-IN')}{' '}
                        <span className="text-sm font-normal text-gray-500">/ month</span>
                      </span>
                      <span className={`text-sm ${isSelected ? 'text-green-700' : 'text-gray-500'}`}>
                        {plan.tenureMonths} months &bull; {plan.interestRate}% interest
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {plan.cashback > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          ₹{plan.cashback.toLocaleString('en-IN')} Cashback
                        </span>
                      )}
                      {isSelected && (
                        <svg className="w-6 h-6 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Proceed Button ── */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={handleProceed}
              disabled={selectedEmiIndex === null}
              className={`w-full py-4 px-8 text-lg font-bold rounded-xl transition-all
                ${selectedEmiIndex !== null
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Proceed with this plan
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showModal && selectedEmiPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Plan selected successfully.</h2>
            <div className="bg-gray-50 rounded-xl p-5 mt-6 mb-8 text-center border border-gray-100">
              <p className="font-bold text-lg text-gray-900 mb-1">{product.name}</p>
              <p className="text-gray-600 mb-4">{currentVariant.storage} &bull; {currentVariant.color}</p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xl font-black text-blue-600">
                  ₹{selectedEmiPlan.monthlyPayment.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedEmiPlan.tenureMonths} months &bull; {selectedEmiPlan.interestRate}% interest
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
