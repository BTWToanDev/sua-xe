import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Services from './components/Services';
import Footer from './components/Footer';
import { AuthProvider } from './components/AuthContext';
import AdminLayout from './components/common/admin/AdminLayout';
import QuanLyYeuCau from './components/common/admin/QuanLyYeuCau';
import QuanLyTaiKhoan from './components/common/admin/QuanLyTaiKhoan';
import QuanLyDichVu from './components/common/admin/QuanLyDichVu';
import QuanLyPhuTung from './components/common/admin/QuanLyPhuTung';
import QuanLyPhuongTien from './components/common/admin/QuanLyPhuongTien';
import QuanLyHang from './components/common/admin/QuanLyHang';
import ThongKe from './components/common/admin/ThongKe';
import QuanLyVanDe from './components/common/admin/QuanLyVanDe';
import  Kho from './components/common/admin/Kho';
import  AdminDashboard from './components/common/admin/AdminDashboard';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><Navbar /><HeroBanner /><Services /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sua-chua" element={<QuanLyYeuCau />} />
            <Route path="tai-khoan" element={<QuanLyTaiKhoan />} />
            <Route path="dich-vu" element={<QuanLyDichVu />} />
            <Route path="van-de" element={<QuanLyVanDe />} />
            <Route path="phu-tung" element={<QuanLyPhuTung />} />
            <Route path="phuong-tien" element={<QuanLyPhuongTien />} />
            <Route path="hang" element={<QuanLyHang />} />
            <Route path="Thong-ke" element={<ThongKe />} />
            <Route path="Kho" element={<Kho />} />
            {/* Thêm các route khác tương tự */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
