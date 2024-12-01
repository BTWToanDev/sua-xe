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

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    if (!token) {
      // Nếu không có token, điều hướng đến trang đăng nhập
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await request.get("/home/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Kiểm tra nếu dữ liệu trả về hợp lệ
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

  // Xử lý sự kiện thay đổi thông tin trong form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý việc lưu thông tin khi người dùng chỉnh sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      const response = await request.put(
        "/home/update-user-info",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu thông tin.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Thông Tin Tài Khoản</h1>
      {error && <p className="error">{error}</p>}
      {userInfo ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label htmlFor="mobilePhone">Số điện thoại</label>
            <input
              type="text"
              id="mobilePhone"
              name="mobilePhone"
              value={formData.mobilePhone}
              disabled
            />
          </div>
          <button type="submit" disabled={!isEditing}>
            Lưu thông tin
          </button>
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        </form>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
};

export default ThongTinTaiKhoan;
