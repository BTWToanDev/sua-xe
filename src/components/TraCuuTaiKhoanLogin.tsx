import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../utils/request";
import { getTokenWithExpiry } from "../constants/localStorage";

interface TraCuuInfo {
  id: number;
  fullName: string;
  address: string;
  issueDescription: string;
  totalPrice: number;
  status: string;
  type: string;
}

const TraCuuTaiKhoanLogin: React.FC = () => {
  const [data, setData] = useState<TraCuuInfo[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = getTokenWithExpiry();

  useEffect(() => {
    if (!token) {
      setError("Vui lòng đăng nhập để xem thông tin tài khoản.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await request.get("/home/service-requests-by-username", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const receivedData: TraCuuInfo[] = response.data;

        if (!Array.isArray(receivedData)) {
          setError("Dữ liệu không hợp lệ.");
          return;
        }

        setData(receivedData);
      } catch (err) {
        console.error("Error fetching user service requests:", err);
        setError("Không thể lấy thông tin yêu cầu dịch vụ.");
      }
    };

    fetchUserInfo();
  }, [token, navigate]);

  const handleViewDetails = (row: TraCuuInfo) => {
    navigate(`/chi-tiet-tra-cuu-tai-khoan`, { state: { detailId: row.id } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-4 bg-gray-50 rounded-lg shadow-md max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Thông Tin Yêu Cầu</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
              >
                <div className="font-semibold text-lg text-gray-700 mb-2">
                  {item.fullName}
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>ID:</strong> {item.id}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Địa chỉ:</strong> {item.address}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Mô tả vấn đề:</strong> {item.issueDescription}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Tổng chi phí:</strong> {item.totalPrice} VND
                </p>
                <p className={`text-sm font-semibold mt-2 ${
                  item.status === "Đang xử lý"
                    ? "text-blue-500"
                    : item.status === "Hoàn thành"
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                  <strong>Trạng thái:</strong> {item.status}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Loại:</strong> {item.type}
                </p>
                <button
                  onClick={() => handleViewDetails(item)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
                >
                  Xem Chi Tiết
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow">
            Không có dữ liệu yêu cầu dịch vụ.
          </div>
        )}
      </div>
    </div>
  );
};

export default TraCuuTaiKhoanLogin;
