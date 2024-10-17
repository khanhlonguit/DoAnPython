import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/verify-email/', { verification_code: token });
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setMessage('Xác thực email thất bại. Vui lòng thử lại.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-5">Xác thực Email</h2>
      <p>{message}</p>
      {message.includes('thành công') && (
        <p className="mt-4">Bạn sẽ được chuyển hướng đến trang đăng nhập sau 3 giây...</p>
      )}
    </div>
  );
}

export default VerifyEmail;
