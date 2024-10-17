import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

function ProductDetail({ addToCart, isLoggedIn }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}/reviews/`);
        setReviews(response.data);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/api/products/${id}/add_review/`,
        newReview,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };

  if (!product) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row -mx-4">
        <div className="md:flex-1 px-4">
          <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4">
            <img className="w-full h-full object-cover" src={product.image_url} alt={product.name} />
          </div>
        </div>
        <div className="md:flex-1 px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
          <div className="flex mb-4">
            <div className="mr-4">
              <span className="font-bold text-gray-700">Giá:</span>
              <span className="text-gray-600">{product.price} VND</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <label className="mr-2">Số lượng:</label>
              <input
                type="number"
                className="w-16 border rounded-md p-2"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="mb-6 border-b pb-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-lg mr-2">{review.user}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Chưa có đánh giá nào cho sản phẩm này.</p>
          )}
        </div>
        <form onSubmit={handleReviewSubmit} className="bg-gray-100 px-6 py-4">
          <h4 className="text-xl font-semibold mb-4">Thêm đánh giá của bạn</h4>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Đánh giá:</label>
            <div className="flex">
              {[5, 4, 3, 2, 1].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: num })}
                  className={`mr-1 focus:outline-none ${num <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <FaStar size={24} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nhận xét:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows="4"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!isLoggedIn}
          >
            Gửi đánh giá
          </button>
          {!isLoggedIn && (
            <p className="text-red-500 text-sm mt-2">Vui lòng đăng nhập để gửi đánh giá.</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProductDetail;
