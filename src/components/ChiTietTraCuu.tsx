import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import request from "../utils/request";

const ChiTietTraCuu = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { phoneNumber, detailId } = state || {};
  const [detailData, setDetailData] = useState<any>(null);

  useEffect(() => {
    if (phoneNumber && detailId) {
      request
        .get(`/servicerequests/${detailId}`, { params: { phoneNumber } })
        .then((response) => setDetailData(response.data))
        .catch((err) => console.error("Lỗi khi lấy chi tiết:", err));
    }
  }, [phoneNumber, detailId]);

  if (!detailData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-lg animate-pulse">Đang tải thông tin chi tiết...</p>
      </div>
    );
  }

  const handleGoBack = () => navigate(-1); // Quay lại trang trước
  const handlePayment = () => alert("Thực hiện thanh toán!");
  const handleCancel = () => alert("Yêu cầu đã được hủy!");
  const handlePrintInvoice = () => alert("In hóa đơn...");

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg mt-10 text-white">
    {/* Nút Quay Lại */}
    <button
      onClick={handleGoBack}
      className="mb-6 px-3 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition"
    >
      ← Quay Lại
    </button>
  
    {/* Thông tin tiêu đề */}
    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">Chi Tiết Tra Cứu</h2>
  
    {/* Thông tin cơ bản */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-800 p-4 rounded-md shadow">
      {[
        { label: "Số Điện Thoại", value: detailData.mobilePhone },
        { label: "Họ và Tên", value: detailData.fullName },
        { label: "Email", value: detailData.email },
        { label: "Địa Chỉ", value: detailData.address },
        { label: "Loại Dịch Vụ", value: detailData.serviceType },
        { label: "Tổng Chi Phí", value: `${detailData.totalPrice} VND`, isHighlight: true },
      ].map((item, index) => (
        <div key={index}>
          <p className="text-xs text-gray-400">{item.label}</p>
          <p
            className={`font-medium ${
              item.isHighlight ? "text-sm text-green-400" : "text-sm text-gray-100"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  
    {/* Mô tả vấn đề */}
    <div className="mb-6 bg-gray-800 p-4 rounded-md shadow">
      <p className="text-xs text-gray-400">Mô Tả Vấn Đề</p>
      <p className="font-medium text-sm text-gray-100">{detailData.issueDescription}</p>
    </div>
  
    {/* Trạng thái */}
    <div className="mb-6 bg-gray-800 p-4 rounded-md shadow">
      <p className="text-xs text-gray-400">Trạng Thái</p>
      <p
        className={`font-bold text-sm ${
          detailData.status === "Hoàn Thành" ? "text-green-400" : "text-yellow-400"
        }`}
      >
        {detailData.status}
      </p>
    </div>
  
    {/* Videos */}
    {detailData.videos.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Videos</h3>
        <div className="grid grid-cols-2 gap-4">
          {detailData.videos.map((video: string, index: number) => (
            <video
              key={index}
              controls
              className="rounded-md shadow-md w-full h-32"
            >
              <source src={video} type="video/mp4" />
              Trình duyệt không hỗ trợ phát video.
            </video>
          ))}
        </div>
      </div>
    )}
  
    {/* Images */}
    {detailData.images.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Hình Ảnh</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {detailData.images.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`Hình ảnh ${index + 1}`}
              className="rounded-md shadow-md w-full h-32 object-cover"
            />
          ))}
        </div>
      </div>
    )}
  
    {/* Problems */}
    {detailData.problems.length > 0 && (
      <div className="mb-6 bg-gray-800 p-4 rounded-md shadow">
        <h3 className="text-lg font-bold mb-4">Vấn Đề</h3>
        <ul className="list-disc list-inside text-sm">
          {detailData.problems.map((problem: string, index: number) => (
            <li key={index} className="text-gray-100">
              {problem}
            </li>
          ))}
        </ul>
      </div>
    )}
  
    {/* Dịch vụ sử dụng */}
    <div className="mb-6 bg-gray-800 p-4 rounded-md shadow">
      <h3 className="text-lg font-bold mb-4">Dịch Vụ Sử Dụng</h3>
      <ul className="list-disc list-inside text-sm">
        {detailData.services.map((service: any) => (
          <li key={service.id} className="text-gray-100">
            {service.name} - Số lượng: {service.quantity} - Giá: {service.price} VND
          </li>
        ))}
      </ul>
    </div>
  
    {/* Phụ tùng */}
    {detailData.parts.length > 0 && (
      <div className="mb-6 bg-gray-800 p-4 rounded-md shadow">
        <h3 className="text-lg font-bold mb-4">Phụ Tùng</h3>
        <ul className="list-disc list-inside text-sm">
          {detailData.parts.map((part: any) => (
            <li key={part.id} className="text-gray-100">
              {part.name} - Số lượng: {part.quantity} - Giá: {part.price} VND - Bảo hành đến:{" "}
              {part.warrantyTo}
            </li>
          ))}
        </ul>
      </div>
    )}
  
    {/* Các nút hành động */}
    <div className="flex justify-end gap-4">
      {detailData.status === "Hoàn Thành" && (
        <button
          onClick={handlePrintInvoice}
          className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
        >
          In Hóa Đơn
        </button>
      )}
      <button
        onClick={handlePayment}
        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Thanh Toán
      </button>
      <button
        onClick={handleCancel}
        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Hủy
      </button>
    </div>
  </div>
  );
};

export default ChiTietTraCuu;
