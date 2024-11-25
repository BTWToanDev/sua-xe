import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import request from "/DoAn2/sua-xe/src/utils/request";

interface Brand {
  id: number;
  icon: string;
  name: string;
}

const Brand: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const navigate = useNavigate();

  const defaultIcons = [
    "🏎️", "🚗", "🚙", "🛻", "🚚", "🚐", "🚕", "🚜", "🚓", "🚑",
    "🚒", "🚲", "🛵", "🏍️", "🛺", "🚛", "🚜", "🚌", "🚇", "🚤",
  ];

  const fetchData = useCallback(() => {
    request
      .get("/home/brand-list")
      .then((response) => {
        const fetchedBrands = response.data.map((item: any, index: number) => ({
          id: item.id, // Gán id từ API
          icon: defaultIcons[index % defaultIcons.length],
          name: item.name,
        }));
        setBrands(fetchedBrands);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBrandClick = (brandId: number) => {
    navigate(`/ChiTietThuongHieu?id=${brandId}`); // Điều hướng với id
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          Các Thương Hiệu Hàng Đầu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="p-6 bg-white shadow-md rounded-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className="text-6xl mb-4 text-green-500">{brand.icon}</div>
              <h3 className="text-xl font-semibold text-gray-700">{brand.name}</h3>
              <p className="mt-4 text-gray-400 font-medium">
              
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brand;
