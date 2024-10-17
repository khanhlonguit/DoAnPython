import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart, updateCartItemQuantity }) => {
  console.log('CartItems trong component Cart:', cartItems);
  
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Giỏ hàng của bạn</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">{item.product.price} VND x {item.quantity}</p>
                <p className="font-bold">Tổng: {(item.product.price * item.quantity).toFixed(2)} VND</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={(e) => updateCartItemQuantity(item.product.id, parseInt(e.target.value))}
                  className="w-16 border rounded p-1 mr-2"
                />
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-2xl font-bold">Tổng cộng: {totalPrice} VND</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
