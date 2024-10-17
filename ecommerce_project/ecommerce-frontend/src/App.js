import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import ProductDetail from './components/ProductDetail';
import Register from './components/Register';
import Login from './components/Login';
import axios from 'axios';
import VerifyEmail from './components/VerifyEmail';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
      fetchCart();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user-info/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  useEffect(() => {
    console.log('cartItems đã được cập nhật:', cartItems);
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/carts/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.length > 0) {
        console.log('Dữ liệu giỏ hàng nhận được:', response.data);
        setCartItems(response.data[0].items);
      } else {
        // Tạo giỏ hàng mới nếu chưa có
        await axios.post('http://localhost:8000/api/carts/', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn) {
      try {
        const response = await axios.post('http://localhost:8000/api/carts/add_to_cart/', {
          product_id: product.id,
          quantity: quantity
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Dữ liệu sau khi thêm vào giỏ hàng:', response.data);
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
      }
    } else {
      // Xử lý giỏ hàng cho người dùng chưa đăng nhập
    }
  };

  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      try {
        const response = await axios.post('http://localhost:8000/api/carts/remove_from_cart/', {
          product_id: productId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
      }
    } else {
      // Xử lý giỏ hàng cho người dùng chưa đăng nhập
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    if (isLoggedIn) {
      try {
        const response = await axios.post('http://localhost:8000/api/carts/update_quantity/', {
          product_id: productId,
          quantity: newQuantity
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
      }
    } else {
      // Xử lý giỏ hàng cho ngư��i dùng chưa đăng nhập
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    fetchCart();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="App">
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
          <div className="container mx-auto py-4 px-6">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold hover:text-yellow-300 transition duration-300">
                Cửa hàng trực tuyến
              </Link>
              <nav className="flex items-center space-x-6">
                {isLoggedIn ? (
                  <>
                    <span className="flex items-center hover:text-yellow-300 transition duration-300">
                      <FaUser className="mr-2" />
                      {username}
                    </span>
                    <button onClick={handleLogout} className="flex items-center hover:text-yellow-300 transition duration-300">
                      <FaSignOutAlt className="mr-2" />
                      <span>Đăng xuất</span>
                    </button>
                    <Link to="/cart" className="relative group">
                      <FaShoppingCart className="text-2xl group-hover:text-yellow-300 transition duration-300" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs group-hover:bg-yellow-500 transition duration-300">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="hover:text-yellow-300 transition duration-300">Đăng ký</Link>
                    <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-yellow-300 hover:text-blue-700 transition duration-300">Đăng nhập</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<ProductList addToCart={addToCart} />} />
            <Route path="/cart" element={isLoggedIn ? <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} /> : <Navigate to="/login" />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} isLoggedIn={isLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
