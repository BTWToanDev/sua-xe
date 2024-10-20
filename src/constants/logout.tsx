import { getToken, removeToken } from '../constants';
import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom'; // Để xác định kiểu của navigate

const logout = (navigate: NavigateFunction): void => {
  const token: string | null = getToken(); // Token có thể là string hoặc null

  if (token) {
    removeToken(); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang chủ

    toast.success('Logout successful'); // Hiển thị thông báo thành công
  }
};

export default logout;
