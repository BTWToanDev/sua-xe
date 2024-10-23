import React, { useEffect, useState } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx

// Định nghĩa kiểu cho phụ tùng
interface PhuTung {
  id: number;
  maPhuTung: string;
  tenPhuTung: string;
  soLuong: number;
}

const QuanLyPhuTung = () => {
  const [phuTungs, setPhuTungs] = useState<PhuTung[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [maPhuTung, setMaPhuTung] = useState('');
  const [tenPhuTung, setTenPhuTung] = useState('');
  const [soLuong, setSoLuong] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch danh sách phụ tùng từ API khi component mount
  useEffect(() => {
    fetchPhuTungs();
  }, []);

  const fetchPhuTungs = async () => {
    try {
      const response = await request.get('/phu-tung'); // Giả sử endpoint là /phu-tung
      setPhuTungs(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phụ tùng:', error);
    }
  };

  const handleAdd = () => {
    setMaPhuTung(''); // Reset giá trị khi thêm mới
    setTenPhuTung('');
    setSoLuong(null);
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (phuTung: PhuTung) => {
    setMaPhuTung(phuTung.maPhuTung); // Set giá trị khi sửa
    setTenPhuTung(phuTung.tenPhuTung);
    setSoLuong(phuTung.soLuong);
    setEditingId(phuTung.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/phu-tung/${id}`); // Giả sử endpoint để xóa
      fetchPhuTungs(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa phụ tùng:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Sửa phụ tùng
        await request.put(`/phu-tung/${editingId}`, {
          maPhuTung,
          tenPhuTung,
          soLuong
        });
      } else {
        // Thêm mới phụ tùng
        await request.post('/phu-tung', {
          maPhuTung,
          tenPhuTung,
          soLuong
        });
      }
      fetchPhuTungs(); // Cập nhật danh sách phụ tùng
      setShowPopup(false); // Đóng pop-up sau khi lưu
    } catch (error) {
      console.error('Lỗi khi lưu phụ tùng:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Phụ Tùng</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Phụ Tùng</button>
      
      {/* Bảng danh sách phụ tùng */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mã Phụ Tùng</th>
            <th className="border px-4 py-2">Tên Phụ Tùng</th>
            <th className="border px-4 py-2">Số Lượng</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {phuTungs.map((pt) => (
            <tr key={pt.id}>
              <td className="border px-4 py-2">{pt.maPhuTung}</td>
              <td className="border px-4 py-2">{pt.tenPhuTung}</td>
              <td className="border px-4 py-2">{pt.soLuong}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(pt)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2">Sửa</button>
                <button onClick={() => handleDelete(pt.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Phụ Tùng' : 'Thêm Phụ Tùng'}</h3>
            {/* Form để thêm/sửa phụ tùng */}
            <input
              type="text"
              placeholder="Mã Phụ Tùng"
              className="border p-2 mb-4 w-full"
              value={maPhuTung}
              onChange={(e) => setMaPhuTung(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên Phụ Tùng"
              className="border p-2 mb-4 w-full"
              value={tenPhuTung}
              onChange={(e) => setTenPhuTung(e.target.value)}
            />
            <input
              type="number"
              placeholder="Số Lượng"
              className="border p-2 mb-4 w-full"
              value={soLuong || ''}
              onChange={(e) => setSoLuong(Number(e.target.value))}
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

export default QuanLyPhuTung;
