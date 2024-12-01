import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../utils/request"; // Giả sử bạn có một helper request để gọi API
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
  const [phoneNumber, setPhoneNumber] = useState<string>("");  // Đảm bảo khai báo phoneNumber
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = getTokenWithExpiry(); // Giả sử bạn lấy token từ localStorage

  useEffect(() => {
    if (!token) {
      setError("Vui lòng đăng nhập để xem thông tin tài khoản.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        console.log("Fetching user service requests...");
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
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Thông Tin Khách Hàng</h2>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="font-semibold text-lg">{item.fullName}</div>
              <p><strong>ID:</strong> {item.id}</p>
              <p><strong>Địa chỉ:</strong> {item.address}</p>
              <p><strong>Mô tả vấn đề:</strong> {item.issueDescription}</p>
              <p><strong>Tổng chi phí:</strong> {item.totalPrice} VND</p>
              <p><strong>Trạng thái:</strong> {item.status}</p>
              <p><strong>Loại:</strong> {item.type}</p>
              <button
                onClick={() => handleViewDetails(item)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
              >
                Chi Tiết
              </button>
            </div>
          ))
        ) : (
          <p>Không có dữ liệu yêu cầu dịch vụ.</p>
        )}
      </div>
    </div>
  );
};

export default TraCuuTaiKhoanLogin;
