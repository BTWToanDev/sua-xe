import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Services from './components/Services';
import Brand from './components/Brand';
import Part from './components/Part';
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
import Kho from './components/common/admin/Kho';
import AdminDashboard from './components/common/admin/AdminDashboard';
import SuaTTKH from './components/common/admin/SuaTTKH'; 
import ChiTietYeuCau from './components/common/admin/ChiTietYeuCau';
import TaoDon from './components/TaoDon';
import Deirec from './components/common/TaoYeuCau/deirec';
import Remote from './components/common/TaoYeuCau/remote';
import Rescue from './components/common/TaoYeuCau/rescue';
import ChiTietTraCuu from "./components/ChiTietTraCuu";
import TraCuu from './components/TraCuu';
import ThongTinTaiKhoan from './components/ThongTinTaiKhoan';
import ThanhToanThanhCong from './components/ThanhToanThanhCong';
import QuanLyTaiKhoanKhachHang from './components/common/admin/QuanLyTaiKhoanKhachHang';
import { ToastContainer } from 'react-toastify';
const App: React.FC = () => {
  return (
    <AuthProvider>
      
      <Router>
        <Routes>
          
          <Route path="/" element={<><Navbar /><HeroBanner /><Services /> <Brand /> <Part /> <Footer /></>} />
          <Route path="/tra-cuu" element={<TraCuu />} />
          <Route path="/tao-don" element={<TaoDon />} /> 
          <Route path="/chi-tiet-tra-cuu" element={<ChiTietTraCuu />} />
          <Route path="/ThanhToanThanhCong" element={<ThanhToanThanhCong />} />
          <Route path="/ThongTinTaiKhoan/:mobilePhone" element={<ThongTinTaiKhoan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/ChiTietPhuTung" element={<PartDetails />} />
          <Route path="/ChiTietDichVu" element={<ServiceDetails />} />
          <Route path="/ChiTietThuongHieu" element={<BrandDetails />} /> */}
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sua-chua" element={<QuanLyYeuCau />} />
            <Route path="sua-chua/sua/:id" element={<SuaTTKH />} /> 
            <Route path="sua-chua/chi-tiet-yeu-cau/:id" element={<ChiTietYeuCau />} /> 
            <Route path="tai-khoan" element={<QuanLyTaiKhoan />} />
            <Route path="tai-khoan-khach-hang" element={<QuanLyTaiKhoanKhachHang />} />
            <Route path="dich-vu" element={<QuanLyDichVu />} />
            <Route path="van-de" element={<QuanLyVanDe />} />
            <Route path="phu-tung" element={<QuanLyPhuTung />} />
            <Route path="phuong-tien" element={<QuanLyPhuongTien />} />
            <Route path="hang" element={<QuanLyHang />} />
           
            <Route path="Thong-ke" element={<ThongKe />} />
            <Route path="kho/:partId" element={<Kho />} />
            <Route path="deirec" element={<Deirec />} />
            <Route path="remote" element={<Remote />} />
            <Route path="rescue" element={<Rescue />} />
          </Route>
        
          
         
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 