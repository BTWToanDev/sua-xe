import React, { useEffect, useState } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx

// Định nghĩa kiểu dữ liệu cho tài khoản
interface TaiKhoan {
  id: number;
  tenTaiKhoan: string;
  email: string;
  vaiTro: string;
}

const QuanLyTaiKhoan = () => {
  const [taiKhoans, setTaiKhoans] = useState<TaiKhoan[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [tenTaiKhoan, setTenTaiKhoan] = useState('');
  const [email, setEmail] = useState('');
  const [vaiTro, setVaiTro] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    fetchTaiKhoans();
  }, []);

  const fetchTaiKhoans = async () => {
    try {
      const response = await request.get('/tai-khoan'); // Giả sử API endpoint là /tai-khoan
      setTaiKhoans(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài khoản:', error);
    }
  };

  const handleAdd = () => {
    setTenTaiKhoan(''); // Reset giá trị khi thêm mới
    setEmail('');
    setVaiTro('');
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (account: TaiKhoan) => {
    setTenTaiKhoan(account.tenTaiKhoan); // Set giá trị khi sửa
    setEmail(account.email);
    setVaiTro(account.vaiTro);
    setEditingId(account.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/tai-khoan/${id}`); // Giả sử API endpoint để xóa
      fetchTaiKhoans(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
    }
  };

  const handleSave = async () => {
    try {
      const accountData = {
        tenTaiKhoan,
        email,
        vaiTro,
      };

      if (editingId) {
        // Sửa tài khoản
        await request.put(`/tai-khoan/${editingId}`, accountData);
      } else {
        // Thêm mới tài khoản
        await request.post('/tai-khoan', accountData);
      }

      fetchTaiKhoans(); // Cập nhật danh sách tài khoản
      setShowPopup(false); // Đóng pop-up sau khi lưu
    } catch (error) {
      console.error('Lỗi khi lưu tài khoản:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Tài Khoản</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Tài Khoản</button>
      
      {/* Bảng danh sách tài khoản */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Tên Tài Khoản</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Vai Trò</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {taiKhoans.map((tk) => (
            <tr key={tk.id}>
              <td className="border px-4 py-2">{tk.tenTaiKhoan}</td>
              <td className="border px-4 py-2">{tk.email}</td>
              <td className="border px-4 py-2">{tk.vaiTro}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(tk)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2">Sửa</button>
                <button onClick={() => handleDelete(tk.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Tài Khoản' : 'Thêm Tài Khoản'}</h3>
            {/* Form để thêm/sửa tài khoản */}
            <input
              type="text"
              placeholder="Tên Tài Khoản"
              className="border p-2 mb-4 w-full"
              value={tenTaiKhoan}
              onChange={(e) => setTenTaiKhoan(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 mb-4 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Vai Trò"
              className="border p-2 mb-4 w-full"
              value={vaiTro}
              onChange={(e) => setVaiTro(e.target.value)}
            />
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
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
export default QuanLyTaiKhoan;
