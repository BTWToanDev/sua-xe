import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Doanh Thu',
      data: [12000, 19000, 30000, 50000, 20000, 30000, 45000, 37000, 42000, 60000, 55000, 70000],
      fill: false,
      borderColor: '#4F46E5',
      backgroundColor: '#6366F1',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Doanh Thu Theo Tháng',
    },
  },
  maintainAspectRatio: false,
};

const ThongKe = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">Thống Kê</h2>
      
      {/* Biểu đồ doanh thu */}
      {/* <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Doanh Thu Theo Tháng</h3>
        <div className="h-80">
          <Line data={data} options={options} />
        </div>
      </div> */}

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
          <h4 className="font-bold text-lg">Dịch Vụ Đã Hoàn Thành</h4>
          <p className="text-3xl mt-2">100</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
          <h4 className="font-bold text-lg">Phương Tiện Đã Sửa</h4>
          <p className="text-3xl mt-2">80</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
          <h4 className="font-bold text-lg">Tài Khoản Mới</h4>
          <p className="text-3xl mt-2">50</p>
        </div>
      </div>

      {/* Thống kê lợi nhuận */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Lợi Nhuận Theo Năm</h3>
          <div className="text-3xl font-bold text-green-500">1,200,000,000 VND</div>
          <p className="text-gray-500 mt-2">Lợi nhuận đã tăng 15% so với năm ngoái</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Doanh Thu Theo Ngày</h3>
          <div className="text-3xl font-bold text-blue-500">60,000,000 VND</div>
          <p className="text-gray-500 mt-2">Doanh thu trong ngày hôm nay</p>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
