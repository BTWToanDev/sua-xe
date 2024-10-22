import React from 'react';

const QuanLyPhuongTien = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Phương Tiện</h2>
      {/* Chức năng thêm phương tiện */}
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Phương Tiện</button>
      {/* Test giao diện */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Biển Số</th>
            <th className="border px-4 py-2">Chủ Sở Hữu</th>
            <th className="border px-4 py-2">Loại Xe</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">29A-12345</td>
            <td className="border px-4 py-2">Nguyễn Văn An</td>
            <td className="border px-4 py-2">Xe Ô tô</td>
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

export default QuanLyPhuongTien;
