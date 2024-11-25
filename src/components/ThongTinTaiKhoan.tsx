import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../utils/request";

interface UserInfo {
  id: number;
  fullName: string;
  mobilePhone: string;
  address: string;
  email: string;
}

const ThongTinTaiKhoan: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [newUser, setNewUser] = useState({
    fullName: "",
    mobilePhone: "",
    address: "",
    email: "",
    password: "",
    userRoles: [""]
  });
  const [updatedUser, setUpdatedUser] = useState({
    fullName: "",
    mobilePhone: "",
    address: "",
    email: ""
  });
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("Không tìm thấy username");
      navigate("/");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await request.get(`/accounts/${username}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tài khoản:", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleCreateUser = async () => {
    try {
      await request.post("/accounts", newUser);
      alert("Tạo tài khoản mới thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;
      await request.put(`/accounts/infos/${username}`, updatedUser);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const handleUpdateRole = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;
      await request.patch(`/accounts/roles/${username}`, newRole);
      alert("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;
      await request.patch(`/accounts/password/${username}`, { username, password: newPassword });
      alert("Cập nhật mật khẩu thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Thông Tin Tài Khoản</h2>
        <button
          onClick={handleBackToHome}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Quay về Trang Chủ
        </button>
      </div>

      {userInfo ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 font-semibold">Họ và Tên:</label>
            <div className="w-2/3 text-gray-900">{userInfo.fullName}</div>
          </div>
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 font-semibold">Số Điện Thoại:</label>
            <div className="w-2/3 text-gray-900">{userInfo.mobilePhone}</div>
          </div>
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 font-semibold">Địa Chỉ:</label>
            <div className="w-2/3 text-gray-900">{userInfo.address}</div>
          </div>
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 font-semibold">Email:</label>
            <div className="w-2/3 text-gray-900">{userInfo.email}</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Đang tải thông tin tài khoản...</div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Chức năng quản lý</h3>

        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-300 mr-4"
        >
          Tạo tài khoản mới
        </button>

        <button
          onClick={handleUpdateUser}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-300 mr-4"
        >
          Cập nhật thông tin cá nhân
        </button>

        <button
          onClick={handleUpdateRole}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 mr-4"
        >
          Cập nhật quyền tài khoản
        </button>

        <button
          onClick={handleUpdatePassword}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition duration-300"
        >
          Cập nhật mật khẩu
        </button>
      </div>

      {/* Popup và form tương ứng sẽ được hiển thị khi click vào các nút */}
    </div>
  );
};

export default ThongTinTaiKhoan;