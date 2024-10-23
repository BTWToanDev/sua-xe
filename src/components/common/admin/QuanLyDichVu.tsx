import React, { useEffect, useState } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx

// Định nghĩa interface cho dịch vụ
interface DichVu {
  id: number;
  maDichVu: string;
  tenDichVu: string;
  gia: number;
}

const QuanLyDichVu = () => {
  const [dichVus, setDichVus] = useState<DichVu[]>([]); // Định nghĩa kiểu dữ liệu của dichVus là mảng DichVu
  const [showPopup, setShowPopup] = useState(false);
  const [maDichVu, setMaDichVu] = useState('');
  const [tenDichVu, setTenDichVu] = useState('');
  const [gia, setGia] = useState<number | string>(''); // Giá có thể là số hoặc chuỗi, tùy theo trạng thái
  const [editingId, setEditingId] = useState<number | null>(null); // ID có thể là số hoặc null
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    fetchDichVus();
  }, []);

  const fetchDichVus = async () => {
    try {
      const response = await request.get('/dich-vu'); // Giả sử API endpoint là /dich-vu
      setDichVus(response.data); // Đảm bảo response trả về đúng kiểu dữ liệu
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    }
  };

  const handleAdd = () => {
    setMaDichVu(''); // Reset giá trị khi thêm mới
    setTenDichVu('');
    setGia('');
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (service: DichVu) => { // Định nghĩa kiểu cho service
    setMaDichVu(service.maDichVu); // Set giá trị khi sửa
    setTenDichVu(service.tenDichVu);
    setGia(service.gia);
    setEditingId(service.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: number) => { // Định nghĩa kiểu cho id
    try {
      await request.delete(`/dich-vu/${id}`); // Giả sử API endpoint để xóa
      fetchDichVus(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Sửa dịch vụ
        await request.put(`/dich-vu/${editingId}`, {
          maDichVu,
          tenDichVu,
          gia: Number(gia), // Đảm bảo gửi giá trị giá dưới dạng số
        });
      } else {
        // Thêm mới dịch vụ
        await request.post('/dich-vu', {
          maDichVu,
          tenDichVu,
          gia: Number(gia), // Đảm bảo gửi giá trị giá dưới dạng số
        });
      }
      fetchDichVus(); // Cập nhật danh sách dịch vụ
      setShowPopup(false); // Đóng pop-up sau khi lưu
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await request.get(`/dich-vu?search=${searchTerm}`); // Giả sử có API tìm kiếm
      setDichVus(response.data);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm dịch vụ:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Dịch Vụ</h2>
      
      {/* Thêm chức năng tìm kiếm dịch vụ */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ"
          className="border border-gray-300 p-2 rounded-lg flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">Tìm kiếm</button>
      </div>

      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Dịch Vụ</button>
      
      {/* Bảng danh sách dịch vụ */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mã Dịch Vụ</th>
            <th className="border px-4 py-2">Tên Dịch Vụ</th>
            <th className="border px-4 py-2">Giá</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dichVus.map((dv) => (
            <tr key={dv.id}>
              <td className="border px-4 py-2">{dv.maDichVu}</td>
              <td className="border px-4 py-2">{dv.tenDichVu}</td>
              <td className="border px-4 py-2">{dv.gia} VND</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(dv)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2">Sửa</button>
                <button onClick={() => handleDelete(dv.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ'}</h3>
            {/* Form để thêm/sửa dịch vụ */}
            <input
              type="text"
              placeholder="Mã Dịch Vụ"
              className="border p-2 mb-4 w-full"
              value={maDichVu}
              onChange={(e) => setMaDichVu(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên Dịch Vụ"
              className="border p-2 mb-4 w-full"
              value={tenDichVu}
              onChange={(e) => setTenDichVu(e.target.value)}
            />
            <input
              type="number"
              placeholder="Giá"
              className="border p-2 mb-4 w-full"
              value={gia}
              onChange={(e) => setGia(e.target.value)}
            />
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">{editingId ? 'Lưu' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyDichVu;
