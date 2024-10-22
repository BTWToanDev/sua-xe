import React from 'react';

const QuanLyDichVu = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Dịch Vụ</h2>
      {/* Thêm chức năng tìm kiếm dịch vụ */}
      <div className="flex mb-4">
        <input type="text" placeholder="Tìm kiếm dịch vụ" className="border border-gray-300 p-2 rounded-lg flex-grow" />
        <button className="ml-2 bg-blue-500 text-white p-2 rounded-lg">Tìm kiếm</button>
      </div>
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
         {/* thử giao diện */}
          <tr>
            <td className="border px-4 py-2">DV001</td>
            <td className="border px-4 py-2">Thay dầu nhớt</td>
            <td className="border px-4 py-2">300,000 VND</td>
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

export default QuanLyDichVu;
