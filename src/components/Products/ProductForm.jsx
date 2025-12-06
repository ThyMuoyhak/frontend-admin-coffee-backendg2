import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
    rating: '',
    brew_time: '',
    is_available: true,
    stock: 100,
  });

  const categories = [
    'Hot Coffee',
    'Cold Brew',
    'Espresso',
    'Cappuccino',
    'Latte',
    'Tea',
    'Bakery',
    'Specialty'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        image: product.image || '',
        description: product.description || '',
        category: product.category || '',
        rating: product.rating || '',
        brew_time: product.brew_time || '',
        is_available: product.is_available || true,
        stock: product.stock || 100,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: formData.rating ? parseFloat(formData.rating) : 0,
      stock: parseInt(formData.stock),
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="e.g., Mondulkiri Arabica"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="4.50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>
        {formData.image && (
          <div className="mt-2 relative inline-block">
            <img
              src={formData.image}
              alt="Preview"
              className="h-20 w-20 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center"><span class="text-gray-500">No Image</span></div>';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Describe the coffee flavor, origin, and characteristics..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (0-5)
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="4.8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brew Time
          </label>
          <input
            type="text"
            name="brew_time"
            value={formData.brew_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="4-5 min"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Available for sale</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
        >
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;