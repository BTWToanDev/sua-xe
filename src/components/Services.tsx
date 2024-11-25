import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import request from "/DoAn2/sua-xe/src/utils/request";

interface Service {
  icon: string;
  name: string;
  price: number;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  // Danh sách icon cố định
  const defaultIcons = ['🚗', '🎨', '❄️', '💧', '🛠️', '🔧', '🚀', '🔩'];

  // Hàm lấy dữ liệu từ server
  const fetchData = useCallback(() => {
    request
      .get("home/service-list") // Thay bằng endpoint API của bạn
      .then((response) => {
        const fetchedServices = response.data.map((item: any, index: number) => ({
          icon: defaultIcons[index % defaultIcons.length], // Gán icon theo thứ tự
          name: item.name,
          price: item.price,
        }));
        setServices(fetchedServices);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
      });
  }, []);

  // Gọi API khi component được mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Xử lý khi nhấp vào một dịch vụ
  const handleServiceClick = (serviceName: string) => {
    navigate(`/dat-lich?service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          Dịch Vụ Của Chúng Tôi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.name)}
              className="p-6 bg-white shadow-md rounded-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className="text-6xl mb-4 text-blue-500">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                {service.name}
              </h3>
              <p className="text-lg text-gray-600">
                Giá: <span className="font-bold text-gray-800">{service.price.toLocaleString()} VNĐ</span>
              </p>
              <p className="mt-4 text-gray-400 font-medium ">
                Nhấp để đặt lịch
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
