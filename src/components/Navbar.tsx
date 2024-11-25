import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { token, logout, user } = useAuth(); // Lấy user từ AuthContext
  const navigate = useNavigate();

  // Menu cố định
  const menuItems = [
    { id: 1, name: "Trang Chủ", link: "/" },
    { id: 2, name: "Dịch Vụ", link: "/dich-vu" },
    { id: 3, name: "Thông Tin", link: "/thong-tin" },
    { id: 4, name: "Liên Hệ", link: "/lien-he" },
    { id: 5, name: "Tra Cứu", link: "/tra-cuu" }, // Thêm mục Tra Cứu
  ];

  const handleScheduleClick = () => {
    navigate("/tao-don");
  };

  const handleAvatarClick = () => {
    if (user?.username) {
      localStorage.setItem("username", user.username);
      navigate(`/ThongTinTaiKhoan`);
    } else {
      console.error("Không tìm thấy thông tin người dùng");
      navigate("/");
    }
  };

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
            <img
              src="/public/assets/images/Logo.jpg"
              alt="Brand Logo"
              className="h-12 inline-block mr-2"
            />
            V-Care
          </div>
          {/* Static Menu */}
          <ul className="hidden lg:flex space-x-6 text-black font-semibold">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className="hover:text-yellow-400 transition duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Search Icon */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={toggleSearch}
            className="text-black hover:text-yellow-400 transition duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 17a6 6 0 100-12 6 6 0 000 12zm0 0l6 6"
              ></path>
            </svg>
          </button>
          {isSearchVisible && (
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border-2 border-gray-300 bg-transparent text-black rounded-md px-4 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
            />
          )}
        </div>

        {/* Nút Login/Logout + Avatar */}
        <div className="hidden lg:flex items-center space-x-4">
          {token ? (
            <>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 hover:underline transition duration-300"
              >
                Đăng Xuất
              </button>
              <button
                onClick={handleAvatarClick}
                className="rounded-full border-2 border-gray-300 hover:border-yellow-400 transition duration-300"
              >
                <img
                  src="/public/assets/images/avatar.jpg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-500 hover:text-yellow-400 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 shadow-md hover:shadow-xl transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Nút Tra Cứu */}
        <div className="hidden lg:flex items-center space-x-6">
          <button
            onClick={() => navigate("/tra-cuu")}
            className="bg-blue-500 text-white px-4 py-4 rounded-md shadow-md hover:bg-blue-600 hover:shadow-xl transition duration-300"
          >
            Tra Cứu
          </button>
          <button
            onClick={handleScheduleClick}
            className="bg-red-500 text-white px-4 py-4 rounded-md shadow-md hover:bg-red-600 hover:shadow-xl transition duration-300"
          >
            Đặt Lịch Ngay
          </button>
        </div>

        {/* Hamburger Menu */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gray-100 shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className="text-gray-700 hover:text-yellow-400 transition duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate("/tra-cuu")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Tra Cứu
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
