import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

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
      <h2 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/product/${product.id}`}>
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4">
              <Link to={`/product/${product.id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-500">
                {product.name}
              </Link>
              <p className="text-gray-600 mt-2">{product.price} VND</p>
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(product.average_rating) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product.average_rating.toFixed(1)}) - {product.reviews_count} đánh giá
                </span>
              </div>
            </div>
            <button 
              className="w-full bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              onClick={() => addToCart(product)}
            >
              <FaShoppingCart className="mr-2" />
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
