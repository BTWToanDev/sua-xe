import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth để lấy token và logout

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { token, logout } = useAuth(); // Lấy token và hàm logout từ AuthContext

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-6">
          <div className="text-black px-4 py-3 rounded-md text-lg font-bold hover:shadow-xl transition duration-300">
            <img src="/public/assets/images/Logo.jpg" alt="Brand Logo" className="h-12 inline-block mr-2" />
            V-Care
          </div>
          <ul className="hidden lg:flex space-x-6 text-black font-semibold">
            <li><Link to="/" className="hover:text-yellow-400 transition duration-300">Trang Chủ</Link></li>
            <li className="relative group">
              <Link
                to="#"
                className="hover:text-yellow-400 transition duration-300"
              >
                Dịch Vụ
              </Link>
              <ul className="absolute opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-100 ease-in-out bg-white shadow-lg mt-2 rounded-lg py-2 min-w-[150px] z-80">
                <li>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 rounded transition duration-300"
                  >
                    Dịch Vụ 1
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 rounded transition duration-300"
                  >
                    Dịch Vụ 2
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 rounded transition duration-300"
                  >
                    Dịch Vụ 3
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 rounded transition duration-300"
                  >
                    Dịch Vụ 4
                  </Link>
                </li>
              </ul>
            </li>
            <li><Link to="#" className="hover:text-yellow-400 transition duration-300">Thông Tin</Link></li>
            <li><Link to="#" className="hover:text-yellow-400 transition duration-300">Liên Hệ</Link></li>
            <li className="font-semibold text-red-500 hover:text-red-600"><Link to="#">KHẨN CẤP</Link></li>
          </ul>
        </div>

        {/* Search Icon */}
        <div className="hidden lg:flex items-center space-x-4">
          <button onClick={toggleSearch} className="text-black hover:text-yellow-400 transition duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17a6 6 0 100-12 6 6 0 000 12zm0 0l6 6"></path>
            </svg>
          </button>

          {/* Search Input */}
          {isSearchVisible && (
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border-2 border-white bg-transparent text-white rounded-md px-4 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
            />
          )}
        </div>

        {/* Nút Login/Signup hoặc Đăng Xuất */}
        <div className="hidden lg:flex items-center space-x-4">
          {token ? (
            <>
              {/* Nút Đăng Xuất */}
              <button
                onClick={logout}
                className="text-black-400 hover:underline transition duration-300"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-black-400 hover:underline transition duration-300">Login</Link>
              <Link to="/signup" className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 shadow-md hover:shadow-xl transition duration-300">Sign Up</Link>
            </>
          )}
        </div>

        {/* Nút Đặt Lịch Ngay */}
        <div className="hidden lg:flex items-center space-x-6">
          <button className="bg-red-500 text-white px-4 py-4 rounded-md shadow-md hover:bg-red-600 hover:shadow-xl transition duration-300">
            Đặt Lịch Ngay
          </button>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-indigo-600">
          <ul className="flex flex-col items-center space-y-4 py-4 text-white">
            <li><Link to="/" className="hover:text-yellow-400 transition duration-300">Trang Chủ</Link></li>
            <li>
              <Link to="#" className="hover:text-yellow-400 transition duration-300">Dịch Vụ</Link>
              <ul className="space-y-2 mt-2">
                <li><Link to="#" className="hover:text-blue-500">Dịch Vụ 1</Link></li>
                <li><Link to="#" className="hover:text-blue-500">Dịch Vụ 2</Link></li>
                <li><Link to="#" className="hover:text-blue-500">Dịch Vụ 3</Link></li>
                <li><Link to="#" className="hover:text-blue-500">Dịch Vụ 4</Link></li>
              </ul>
            </li>
            <li><Link to="#" className="hover:text-yellow-400 transition duration-300">Thông Tin</Link></li>
            <li><Link to="#" className="hover:text-yellow-400 transition duration-300">Liên Hệ</Link></li>
            <li><Link to="#" className="hover:text-red-400 transition duration-300">KHẨN CẤP</Link></li>
            <li>
              {token ? (
                <button onClick={logout} className="text-yellow-400">Đăng Xuất</button>
              ) : (
                <>
                  <Link to="/login" className="text-yellow-400">Login</Link>
                  <Link to="/signup" className="bg-yellow-400 text-white px-4 py-2 rounded-md">Sign Up</Link>
                </>
              )}
            </li>
            <li>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="border-2 border-white bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">Đặt Lịch Ngay</button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
