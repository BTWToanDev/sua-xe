import React from 'react';

const QuanLyPhuTung = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Phụ Tùng</h2>
      {/* Chức năng thêm phụ tùng */}
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Phụ Tùng</button>
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
          <tr>
            <td className="border px-4 py-2">PT001</td>
            <td className="border px-4 py-2">Lốp xe</td>
            <td className="border px-4 py-2">20</td>
            <td className="border px-4 py-2">
              <button className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2">Sửa</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded-lg">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default QuanLyPhuTung;
