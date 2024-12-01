import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useAuth } from "./AuthContext";

const ThongTinTaiKhoan: React.FC = () => {
  const { mobilePhone } = useParams<{ mobilePhone: string }>(); // Lấy mobilePhone từ URL
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobilePhone: mobilePhone || "", // Dùng mobilePhone từ URL nếu có
  });
  const auth = useAuth();
  const token = auth?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await request.get("/home/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.mobilePhone === mobilePhone) {
          setUserInfo(response.data);
          setFormData({
            fullName: response.data.fullName,
            email: response.data.email,
            mobilePhone: response.data.mobilePhone,
          });
        } else {
          setError("Thông tin người dùng không khớp với số điện thoại.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin người dùng.");
        console.error(err);
      }
    };

    fetchUserInfo();
  }, [token, mobilePhone, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      const response = await request.put("/home/update-user-info", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu thông tin.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-black">Thông Tin Tài Khoản</h1>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {userInfo ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-black">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="mobilePhone" className="block text-sm font-medium text-black">
                Số điện thoại
              </label>
              <input
                type="text"
                id="mobilePhone"
                name="mobilePhone"
                value={formData.mobilePhone}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                disabled={!isEditing}
                className={`px-6 py-2 text-white rounded-md ${
                  isEditing ? "bg-black hover:bg-gray-800" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Lưu thông tin
              </button>
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="px-6 py-2 text-gray-700 bg-yellow-300 rounded-md hover:bg-yellow-400"
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-600">Đang tải thông tin người dùng...</p>
        )}

        {/* Thêm nút quay lại trang chủ */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThongTinTaiKhoan;
