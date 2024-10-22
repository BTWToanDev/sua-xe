import React from 'react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-8 flex items-center justify-between">
      <div className="text-lg font-bold">Admin Dashboard</div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-800">Thông tin</button>
        <button className="text-gray-600 hover:text-gray-800">Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
