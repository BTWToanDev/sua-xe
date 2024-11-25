import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-2">Thông Tin</h3>
            <p>
              V-Care là một nền tảng cung cấp dịch vụ tốt nhất cho cộng đồng. 
              Chúng tôi mang lại sự chăm sóc và giải pháp sáng tạo để cải thiện cuộc sống hàng ngày.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-2">Liên Hệ</h3>
            <ul>
              <li>Địa chỉ: 123 Đường Hoa Sơn, Quận Kinh Châu</li>
              <li>Email: support@vcare.vn</li>
              <li>Điện thoại: +84 123 456 789</li>
            </ul>
          </div>

          {/* Map Section */}
          <div>
            <h3 className="text-lg font-bold mb-2">Vị trí của chúng tôi</h3>
            <iframe
              title="V-Care Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093746!2d144.95373631568096!3d-37.816279442021734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5776e732b7e6f14!2zQ2JkIMSR4bqhbmcgxJDDtG4gVMOqIMSQ4buLYw!5e0!3m2!1svi!2s!4v1695482022947!5m2!1svi!2s"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 text-center border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} V-Care Tiêu Đế & Gia Cát Lượng.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
