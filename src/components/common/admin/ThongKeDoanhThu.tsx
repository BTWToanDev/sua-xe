import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import request from '../../../utils/request';

// Kiểu dữ liệu trả về từ API
interface RevenueData {
  revenue: number;
  cost: number;
  taxCost: number;
}

const ThongKeDoanhThu: React.FC = () => {
  // Trạng thái cho việc chọn ngày
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]); // Ngày kết thúc mặc định là hôm nay

  // Trạng thái cho dữ liệu và lỗi
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy dữ liệu từ API dựa trên khoảng thời gian
  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);
    
    try {
      
      const response = await request.get(
        `/statistic/revenue?startDate=${startDate}&endDate=${endDate}`);
      
      setData(response.data); // Giả sử cấu trúc dữ liệu trả về phù hợp
    } catch (err) {
      setError('Có lỗi khi lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchData khi startDate hoặc endDate thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  // Hàm xử lý khi chọn ngày bắt đầu
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    // Đảm bảo ngày bắt đầu không được sau ngày kết thúc
    if (new Date(date) > new Date(endDate)) {
      setEndDate(date);
    }
    setStartDate(date);
  };

  // Hàm xử lý khi chọn ngày kết thúc
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    // Đảm bảo ngày kết thúc không được trước ngày bắt đầu
    if (new Date(date) < new Date(startDate)) {
      setStartDate(date);
    }
    setEndDate(date);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Thống Kê Doanh Thu</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Ngày Bắt Đầu:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate} // Ngày bắt đầu không thể sau ngày kết thúc
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Ngày Kết Thúc:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate} // Ngày kết thúc không thể trước ngày bắt đầu
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={fetchData}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Xem Thống Kê
        </button>
      </div>

      {/* Hiển thị trạng thái loading */}
      {loading && <p className="text-center text-lg text-gray-600">Đang tải...</p>}

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <p className="text-center text-lg text-red-600">{error}</p>}

      {/* Hiển thị dữ liệu nếu có */}
      {data && (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-6 py-3 text-left">Doanh Thu</th>
                <th className="px-6 py-3 text-left">Chi Phí</th>
                <th className="px-6 py-3 text-left">Thuế</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-300">
                <td className="px-6 py-4">{data.revenue}</td>
                <td className="px-6 py-4">{data.cost}</td>
                <td className="px-6 py-4">{data.taxCost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ThongKeDoanhThu;
