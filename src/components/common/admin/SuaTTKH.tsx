import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";

const SuaTTKH = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [mobilePhone, setMobilePhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  useEffect(() => {
    // Load thông tin yêu cầu từ API
    const fetchData = async () => {
      try {
        const response = await request.get(`/ServiceRequests/${id}`);
        const data = response.data;
        setMobilePhone(data.mobilePhone || "");
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setIssueDescription(data.issueDescription || "");
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          alert("Không tìm thấy thông tin yêu cầu.");
          navigate("/QuanLyYeuCau");
        }
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      await request.patch(`/ServiceRequests/${id}`, {
        mobilePhone,
        fullName,
        email,
        address,
        issueDescription,
      });
      alert("Cập nhật thành công!");
      navigate("/admin/sua-chua"); // Quay lại trang Quản Lý Yêu Cầu
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu cầu:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleBack = () => {
    navigate("/admin/sua-chua"); // Quay lại trang Quản Lý Yêu Cầu
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sửa Thông Tin Khách Hàng</h2>
      <div className="mb-4">
        <label className="block font-bold mb-1">Số điện thoại</label>
        <input
          type="text"
          value={mobilePhone}
          onChange={(e) => setMobilePhone(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">Họ và tên</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">Địa chỉ</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">Mô tả vấn đề</label>
        <textarea
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        ></textarea>
      </div>
      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
      >
        Lưu
      </button>
      <button
        onClick={handleBack}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
      >
        Trở Về
      </button>
    </div>
  );
};

export default SuaTTKH;
