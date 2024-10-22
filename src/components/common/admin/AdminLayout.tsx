import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Nội dung chính */}
      <div className="flex-grow p-6">
        <AdminHeader />
        <Outlet /> {/* Render các trang con của admin */}
      </div>
    </div>
  );
};

export default AdminLayout;
