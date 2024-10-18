import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            {product.is_new && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                New
              </span>
            )}
            <Link to={`/product/${product.id}`}>
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4">
              <Link to={`/product/${product.id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-500">
                {product.name}
              </Link>
              <p className="text-sm text-gray-600 mt-1">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-blue-600 font-bold text-xl">${product.price}</span>
                  {product.original_price && (
                    <span className="text-gray-500 line-through ml-2">${product.original_price.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(product.average_rating) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({product.reviews_count})</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Shipping Cost: ${product.shipping_cost}</p>
              <p className="text-sm text-green-600 mt-1">Stock: {product.stock}</p>
              <div className="mt-4 flex justify-between">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart className="mr-2" />
                </button>
                <button className="text-blue-500 hover:text-blue-600">
                  <FaHeart size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
