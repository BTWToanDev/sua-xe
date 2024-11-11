import React, { useEffect, useState } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx

interface TaiKhoan {
  id: number;
  username: string;
  email: string;
  mobile: string;
  phone: string;
  fullname: string;
  role: string;
}

const QuanLyTaiKhoan = () => {
  const [taiKhoans, setTaiKhoans] = useState<TaiKhoan[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    mobile: '',
    phone: '',
    fullname: '',
    role: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
    setFormState({
      username: '',
      email: '',
      mobile: '',
      phone: '',
      fullname: '',
      role: ''
    });
    setEditingId(null);
    setShowPopup(true);
  };

  const handleEdit = (account: TaiKhoan) => {
    setFormState({
      username: account.username,
      email: account.email,
      mobile: account.mobile,
      phone: account.phone,
      fullname: account.fullname,
      role: account.role
    });
    setEditingId(account.id);
    setShowPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/tai-khoan/${id}`);
      fetchTaiKhoans(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
    }
  };

  const handleSave = async () => {
    try {
      const accountData = { ...formState };

      if (editingId) {
        await request.put(`/tai-khoan/${editingId}`, accountData); // Cập nhật tài khoản
      } else {
        await request.post('/tai-khoan', accountData); // Thêm tài khoản mới
      }

      fetchTaiKhoans(); // Cập nhật danh sách tài khoản
      setShowPopup(false); // Đóng popup
    } catch (error) {
      console.error('Lỗi khi lưu tài khoản:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTaiKhoans = taiKhoans.filter(
    (tk) =>
      tk.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTaiKhoans = filteredTaiKhoans.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Tài Khoản</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
        Thêm Tài Khoản
      </button>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="bg-green-500 text-white px-4 py-2 ml-2">Search</button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Fullname</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTaiKhoans.map((tk) => (
            <tr key={tk.id}>
              <td className="border px-4 py-2">{tk.username}</td>
              <td className="border px-4 py-2">{tk.email}</td>
              <td className="border px-4 py-2">{tk.mobile}</td>
              <td className="border px-4 py-2">{tk.phone}</td>
              <td className="border px-4 py-2">{tk.fullname}</td>
              <td className="border px-4 py-2">{tk.role}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(tk)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2">
                  Sửa
                </button>
                <button onClick={() => handleDelete(tk.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l"
          >
            &lt;
          </button>
          <span className="px-4 py-2">Page {currentPage} of {Math.ceil(filteredTaiKhoans.length / itemsPerPage)}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredTaiKhoans.length / itemsPerPage)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r"
          >
            &gt;
          </button>
        </div>
        <div>
          <label className="mr-2">Show</label>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border p-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Tài Khoản' : 'Thêm Tài Khoản'}</h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border p-2 mb-4 w-full"
              value={formState.username}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 mb-4 w-full"
              value={formState.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              className="border p-2 mb-4 w-full"
              value={formState.mobile}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="border p-2 mb-4 w-full"
              value={formState.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="fullname"
              placeholder="Fullname"
              className="border p-2 mb-4 w-full"
              value={formState.fullname}
              onChange={handleChange}
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              className="border p-2 mb-4 w-full"
              value={formState.role}
              onChange={handleChange}
            />

            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">
              Lưu
            </button>
            <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyTaiKhoan;
