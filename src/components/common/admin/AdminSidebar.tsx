import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Admin</h2>
        </div>
        <nav className="space-y-3">
          <Link
            to="/admin/dashboard"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Bảng điều khiển
          </Link>
          <Link
            to="/admin/sua-chua"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý yêu cầu sửa chữa
          </Link>
          <Link
            to="/admin/tai-khoan"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý tài khoản Admin
          </Link>
          <Link
            to="/admin/tai-khoan-khach-hang"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý tài khoản Khách Hàng
          </Link>
          <Link
            to="/admin/dich-vu"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý dịch vụ
          </Link>
          <Link
            to="/admin/van-de"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý vấn đề
          </Link>
          <Link
            to="/admin/phu-tung"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý phụ tùng
          </Link>
          <Link
            to="/admin/phuong-tien"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý phương tiện
          </Link>
          <Link
            to="/admin/hang"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý Hãng
          </Link>
          <Link
            to="/admin/thong-ke"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Thống kê
          </Link>
           <Link
            to="/admin/Kho"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Kho
          </Link>
         {/* <Link
            to="/admin/customers"
            className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            Quản lý khách hàng
          </Link> */}
        </nav>
      </div>
      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-400">© V-Care Tiêu Đế & Gia Cát Lượng</p>
      </footer>
    </aside>
  );
};

export default AdminSidebar;
