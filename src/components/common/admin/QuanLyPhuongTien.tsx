import React, { useState, useEffect } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx

// Định nghĩa kiểu dữ liệu cho phương tiện
interface PhuongTien {
  id: string;
  loaiPhuongTien: string;
  tenHang: string;
  tenPhuongTien: string;
}

const QuanLyPhuongTien = () => {
  const [phuongTiens, setPhuongTiens] = useState<PhuongTien[]>([]); // Kiểu dữ liệu là mảng các PhuongTien
  const [showPopup, setShowPopup] = useState(false);
  const [loaiPhuongTien, setLoaiPhuongTien] = useState('');
  const [tenHang, setTenHang] = useState('');
  const [tenPhuongTien, setTenPhuongTien] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null); // Kiểu string hoặc null

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    fetchPhuongTiens();
  }, []);

  const fetchPhuongTiens = async () => {
    try {
      const response = await request.get('/phuong-tien'); // API endpoint cho phương tiện
      setPhuongTiens(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phương tiện:', error);
    }
  };

  const handleAdd = () => {
    setLoaiPhuongTien(''); // Reset giá trị khi thêm mới
    setTenHang('');
    setTenPhuongTien('');
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (phuongTien: PhuongTien) => {
    setLoaiPhuongTien(phuongTien.loaiPhuongTien); // Set giá trị khi sửa
    setTenHang(phuongTien.tenHang);
    setTenPhuongTien(phuongTien.tenPhuongTien);
    setEditingId(phuongTien.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/phuong-tien/${id}`); // API endpoint để xóa
      fetchPhuongTiens(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa phương tiện:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Sửa phương tiện
        await request.put(`/phuong-tien/${editingId}`, {
          loaiPhuongTien,
          tenHang,
          tenPhuongTien,
        });
      } else {
        // Thêm mới phương tiện
        await request.post('/phuong-tien', {
          loaiPhuongTien,
          tenHang,
          tenPhuongTien,
        });
      }
      fetchPhuongTiens(); // Cập nhật danh sách phương tiện
      setShowPopup(false); // Đóng pop-up sau khi lưu
    } catch (error) {
      console.error('Lỗi khi lưu phương tiện:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Phương Tiện</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
        Thêm Phương Tiện
      </button>

      {/* Bảng danh sách phương tiện */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Loại Phương Tiện</th>
            <th className="border px-4 py-2">Tên Hãng</th>
            <th className="border px-4 py-2">Tên Phương Tiện</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {phuongTiens.map((pt) => (
            <tr key={pt.id}>
              <td className="border px-4 py-2">{pt.loaiPhuongTien}</td>
              <td className="border px-4 py-2">{pt.tenHang}</td>
              <td className="border px-4 py-2">{pt.tenPhuongTien}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(pt)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2">
                  Sửa
                </button>
                <button onClick={() => handleDelete(pt.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Phương Tiện' : 'Thêm Phương Tiện'}</h3>
            {/* Form thêm/sửa phương tiện */}
            <input
              type="text"
              placeholder="Loại Phương Tiện"
              className="border p-2 mb-4 w-full"
              value={loaiPhuongTien}
              onChange={(e) => setLoaiPhuongTien(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên Hãng"
              className="border p-2 mb-4 w-full"
              value={tenHang}
              onChange={(e) => setTenHang(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên Phương Tiện"
              className="border p-2 mb-4 w-full"
              value={tenPhuongTien}
              onChange={(e) => setTenPhuongTien(e.target.value)}
            />
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">
                Hủy
              </button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                {editingId ? 'Lưu' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyPhuongTien;
