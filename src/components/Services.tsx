import React from 'react';

const Services: React.FC = () => {
  const services = [
    { icon: '🚗', title: ' Chỉnh chế độ nhiên liệu', description: 'Để đảm bảo quá trình đốt cháy hoạt động suôn sẻ cần một lượng nhiên liệu và không khí vừa đủ trong buồng đốt.' },
    { icon: '🎨', title: 'Sơn Xe', description: 'Tại đây, chúng tôi có thể cung cấp dịch vụ sơn xe với màu sắc mà bạn yêu thích.' },
    { icon: '❄️', title: 'Lọc gió', description: 'Lọc gió bẩn sẽ khiến xe chạy yếu, không đốt cháy hết nhiên liệu và kết quả là hao tốn nhiều xăng dầu hơn.' },
    { icon: '💧', title: 'Dầu nhớt', description: 'Theo thời gian, dầu nhớt trong xe trở nên kém chất lượng, dẫn tới khả năng ma sát giảm sút.' },
    { icon: '🛠️', title: 'Dầu phanh và má phanh', description: 'Má phanh là bộ phận chuyển đổi động năng thành nhiệt năng, giúp xe giảm tốc độ trong những tình huống cấp bách khi lưu thông trên đường.' },
    { icon: '🔧', title: 'Bugi', description: 'Bugi nằm trong hệ thống đánh lửa, đảm nhận vai trò đốt cháy nhiên liệu và thúc đẩy công suất hoạt động mạnh mẽ cho xe.' },
    { icon: '🚀', title: 'Căn chỉnh xupap', description: 'Có chức năng đóng và mở đường giúp tạo nên dòng chảy của hỗn hợp xăng gió vào và ra khỏi buồng đốt.' },
    { icon: '🔩', title: 'Căn chỉnh côn', description: 'Nhiệm vụ chính của côn xe máy là kết nối trục khuỷu của động cơ với hệ thống truyền lực của xe để truyền mô-men một cách êm dịu và điều chỉnh truyền động nhanh chóng khi cần thiết.' },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-6 bg-white shadow-lg rounded-lg">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
