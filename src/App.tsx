import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Thanh Navbar bạn đã tạo
import HeroBanner from './components/HeroBanner'; // Trang Hero
import Login from './components/Login'; // Trang Login
import SignUp from './components/SignUp'; // Trang Sign Up
import Services from './components/Services'; // Trang Services mới
import Footer from './components/Footer'; // Thêm Footer mới
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
//import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <AuthProvider> {/* Bọc ứng dụng trong AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroBanner />
                <Services />
              </>
            }
          />
          <Route path="/login" element={<Login />} /> {/* Trang Đăng Nhập */}
          <Route path="/signup" element={<SignUp />} /> {/* Trang Đăng Ký */}
        </Routes>
        <Footer /> 
      </Router>
    </AuthProvider>
  );
};

export default App;
