import { Link } from "react-router-dom";
import { Button, UserProfile } from '../../ui';
import { Navbar } from '/DoAn2/sua-xe/src/components/common/Navbar';
import React from 'react';

// Define the types for the props
interface NavbarItem {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
}

interface AdminHeaderProps {
  toggleSidebar: () => void; // Function type for the toggleSidebar prop
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const navbarItem: NavbarItem[] = [
    {
      title: "Product",
      items: [
        { label: 'Categorys', href: '/admin/category' },
        { label: 'Products', href: '/admin/product' },
      ]
    },
    {
      title: "Order",
      items: [
        { label: 'Orders', href: '/admin/orders' }
      ]
    },
    {
      title: "Account",
      items: [
        { label: 'Managers', href: '/admin/managers' },
        { label: 'Customers', href: '/admin/customers' },
        { label: 'Types', href: '/admin/types' }
      ]
    },
    {
      title: "Statistic",
      items: [
        { label: 'Product', href: '/admin/statistic/product' },
        { label: 'Customer', href: '/admin/statistic/customer' },
      ]
    },
  ];

  const managementFeatures = [
    { title: "Quản lý danh mục", description: "Quản lý các danh mục sản phẩm", href: "/admin/category" },
    { title: "Quản lý sản phẩm", description: "Quản lý thông tin sản phẩm", href: "/admin/product" },
    { title: "Quản lý đơn hàng", description: "Xem và xử lý các đơn hàng", href: "/admin/orders" },
    { title: "Quản lý khách hàng", description: "Quản lý thông tin khách hàng", href: "/admin/customers" },
    { title: "Quản lý người dùng", description: "Quản lý các loại tài khoản người dùng", href: "/admin/managers" },
    { title: "Thống kê", description: "Thống kê sản phẩm và khách hàng", href: "/admin/statistic/product" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-green-700 p-4 sm:pb-1 items-center justify-between w-full">
        <div className="grid grid-cols-8 sm:grid-cols-4">
          <div className="col-span-1 col-start-1 hidden sm:block justify-start">
            {/* <img src="/path/to/your/logo.png" alt="Logo" className="h-8" /> */}
            <span className="text-white text-lg font-semibold ml-2 hidden md:block">
              Pharma Shop
            </span>
          </div>

          <div className="col-span-1 justify-center m-auto md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex col-span-1 col-start-4 items-center justify-end">
            <Button primary className="rounded-lg mr-2">
              <Link to="/admin">Dashboard</Link>
            </Button>
            <div className="md:flex hidden items-center">
              <UserProfile />
            </div>
          </div>

        </div>

        <Navbar datas={navbarItem} />
      </header>

      {/* Body - Quản lý chức năng */}
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Các chức năng quản lý</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementFeatures.map((feature, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link to={feature.href} className="text-blue-500 hover:underline">
                Quản lý
              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-6">
        <p>© 2024 Pharma Shop. All rights reserved.</p>
        <p>Contact: info@pharmashop.com | Hotline: 1800-1234</p>
      </footer>
    </>
  );
};

export default AdminHeader;
