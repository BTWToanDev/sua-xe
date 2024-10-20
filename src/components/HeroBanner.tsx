import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
  const images = [
    '/public/assets/images/HeroBanner1.jpg',
    '/public/assets/images/HeroBanner2.jpg',
    '/public/assets/images/HeroBanner3.jpg',
    '/public/assets/images/HeroBanner4.jpg'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tự động chuyển đổi slide sau 5 giây
  useEffect(() => {
    if (isPaused) return; // Không thay đổi slide khi bị tạm dừng

    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(slideInterval); // Clear interval khi component unmount
  }, [isPaused, images.length]);

  // Hàm để chuyển slide
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
  };

  // Tạm dừng khi người dùng hover vào HeroSection
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section
      className="relative h-screen bg-cover bg-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slide hiển thị */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ))}

      {/* Overlay mờ đen */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Nội dung text */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center">
        <h1 className="text-5xl font-bold">CHÀO MỪNG ĐẾN VỚI DỊCH VỤ SỬA XE CỦA CHÚNG TÔI</h1>
        <p className="mt-4 text-lg">Sửa ngay với giá ưu đãi</p>
        <button className="mt-6 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300">Đặt lịch sửa</button>
      </div>

      {/* Nút điều hướng trái */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full z-20 focus:outline-none"
        onClick={goToPrevSlide}
      >
        &#8592;
      </button>

      {/* Nút điều hướng phải */}
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full z-20 focus:outline-none"
        onClick={goToNextSlide}
      >
        &#8594;
      </button>

      {/* Chỉ báo slide */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
