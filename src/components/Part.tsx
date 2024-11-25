import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import request from "/DoAn2/sua-xe/src/utils/request";

interface Part {
  name: string;
  warrantyPeriod: string;
  price: number;
  brandName: string;
}

const Part: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const navigate = useNavigate();

  // Danh sách icon cố định
  const defaultIcons = [
    '🔧', // Cờ lê
    '⚙️', // Bánh răng
    '🔩', // Ốc vít
    '🛠️', // Bộ công cụ
    '🚗', // Xe hơi
    '🏎️', // Xe thể thao
    '🛞', // Lốp xe
    '🔋', // Pin/Ắc quy
    '🛡️', // Bảo vệ
    '🚦', // Đèn giao thông
  ];

  // Hàm lấy dữ liệu từ server
  const fetchData = useCallback(() => {
    request
      .get("/home/part-list") // Endpoint API lấy danh sách phụ tùng
      .then((response) => {
        const fetchedParts = response.data.map((item: any) => ({
          name: item.name,
          warrantyPeriod: item.warrantyPeriod,
          price: item.price,
          brandName: item.brandName,
        }));
        setParts(fetchedParts);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu phụ tùng:", error);
      });
  }, []);

  // Gọi API khi component được mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Xử lý điều hướng khi nhấp vào phụ tùng
  const handlePartClick = (partName: string) => {
    navigate(`/ChiTietPhuTung?part=${encodeURIComponent(partName)}`);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 via-gray-50 to-white">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          Danh Sách Phụ Tùng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {parts.map((part, index) => (
            <div
              key={index}
              onClick={() => handlePartClick(part.name)}
              className="p-6 bg-white shadow-md rounded-lg transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer group"
            >
              {/* Icon cố định */}
              <div className="text-6xl text-blue-500 mb-4">
                {defaultIcons[index % defaultIcons.length]}
              </div>

              {/* Thông tin phụ tùng */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{part.name}</h3>
                <p className="text-gray-600">
                  <strong>Thương hiệu:</strong> {part.brandName}
                </p>
                <p className="text-gray-600">
                  <strong>Bảo hành:</strong> {part.warrantyPeriod}
                </p>
                <p className="text-lg text-gray-800 font-bold">
                  Giá: {part.price.toLocaleString()} VNĐ
                </p>
                <p className="mt-4 text-blue-600 font-medium underline">
                  Nhấp để xem chi tiết
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Part;
