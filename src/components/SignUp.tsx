import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Thêm icon cho Google và Facebook

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: ''
  });

  // Kiểm tra điều kiện cho Họ và Tên (không có số và ký tự đặc biệt)
  const validateName = (name: string) => /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴặẹẽẻềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+$/.test(name);

  // Kiểm tra điều kiện cho số điện thoại (chỉ số nguyên, 10-11 chữ số)
  const validatePhoneNumber = (number: string) => /^[0-9]{10,11}$/.test(number);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra điều kiện cho từng trường
    let newErrors = {
      fullName: validateName(fullName) ? '' : 'Họ tên không được chứa số hoặc ký tự đặc biệt.',
      phoneNumber: validatePhoneNumber(phoneNumber) ? '' : 'Số điện thoại phải có 10 hoặc 11 chữ số.',
      password: password.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự.',
      confirmPassword: password === confirmPassword ? '' : 'Mật khẩu nhập lại không khớp.',
      termsAccepted: termsAccepted ? '' : 'Bạn phải đồng ý với điều khoản sử dụng.'
    };

    // Nếu có lỗi, cập nhật state và dừng lại
    if (newErrors.fullName || newErrors.phoneNumber || newErrors.password || newErrors.confirmPassword || newErrors.termsAccepted) {
      setErrors(newErrors);
      return;
    }

    // Xử lý đăng ký tài khoản khi không có lỗi
    console.log({
      fullName,
      phoneNumber,
      address,
      email,
      password
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký</h2>
      <form onSubmit={handleSignUp} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
        
        {/* Họ Tên */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ Tên</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`mt-1 p-2 border w-full rounded ${errors.fullName ? 'border-red-500' : ''}`}
            required
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`mt-1 p-2 border w-full rounded ${errors.phoneNumber ? 'border-red-500' : ''}`}
            required
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        </div>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 border w-full rounded"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border w-full rounded"
            required
          />
        </div>

        {/* Mật khẩu */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 p-2 border w-full rounded ${errors.password ? 'border-red-500' : ''}`}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Nhập lại Mật khẩu */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Nhập lại Mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`mt-1 p-2 border w-full rounded ${errors.confirmPassword ? 'border-red-500' : ''}`}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {/* Điều khoản */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="termsAccepted" className="text-sm">Tôi đồng ý với <a href="#" className="text-blue-500">Điều khoản sử dụng</a></label>
          {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Đăng Ký
        </button>

        {/* Đăng nhập bằng Google hoặc Facebook */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="text-red-500 text-3xl">
            <FaGoogle />
          </button>
          <button className="text-blue-700 text-3xl">
            <FaFacebook />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
