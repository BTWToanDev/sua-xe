import React from "react";
import { useNavigate } from "react-router-dom";

const ThanhToanThanhCong: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Thanh Toán Thành Công!
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
        </p>
        <div className="flex justify-center items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
            <span className="text-green-600 text-4xl">✔️</span>
          </div>
        </div>
        <button
          onClick={handleBackToHome}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition"
        >
          Quay về Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default ThanhToanThanhCong;
