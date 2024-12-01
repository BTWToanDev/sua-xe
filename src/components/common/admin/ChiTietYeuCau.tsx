import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import request from "/DoAn2/sua-xe/src/utils/request";

interface Service {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Part {
  id: number;
  name: string;
  warrantyTo: string;
  quantity: number;
  price: number;
}

const ChiTietYeuCau = () => {
  const { id } = useParams<{ id: string }>();
  const [mobilePhone, setMobilePhone] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [serviceType, setServiceType] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [videos, setVideos] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [problems, setProblems] = useState<string[]>([]);

  const [services, setServices] = useState<Service[]>([]);
  const [parts, setParts] = useState<Part[]>([]);

  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [partsList, setPartsList] = useState<Part[]>([]);
  const [showPopup, setShowPopup] = useState<"services" | "parts" | null>(null);

  const navigate = useNavigate();

  const fetchRequestDetail = useCallback(async () => {
    try {
      const response = await request.get(`/ServiceRequests/${id}`);
      const data = response.data;
      console.log("Response Data:", data);
      setMobilePhone(data.mobilePhone);
      setFullName(data.fullName);
      setEmail(data.email);
      setAddress(data.address);
      setIssueDescription(data.issueDescription);
      setTotalPrice(data.totalPrice);
      setServiceType(data.serviceType);
      setStatus(data.status);
      setVideos(data.videos || []);
      setImages(data.images || []);
      setProblems(data.problems || []);
      setServices(data.services || []);
      setParts(data.parts || []);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết yêu cầu:", error);
    }
  }, [id]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [servicesResponse, partsResponse] = await Promise.all([
        request.get("/Services/dropdown"),
        request.get("/parts/dropdown"),
      ]);
      setServicesList(servicesResponse.data);
      console.log(partsResponse);
      
      setPartsList(partsResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dropdown:", error);
    }
  }, []);

  useEffect(() => {
    fetchRequestDetail();
    fetchDropdownData();
  }, [fetchRequestDetail, fetchDropdownData]);

  const handleAddItem = (type: "services" | "parts", item: Service | Part) => {
    if (type === "services") {
      if (!services.find((service) => service.id === item.id)) {
        setServices([...services, { ...item, quantity: 1 }]);
      }
    } else {
      if (!parts.find((part) => part.id === item.id)) {
        setParts([...parts, { ...item, quantity: 1, warrantyTo: '' }]);
      }
    }
    setShowPopup(null); 
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context"));

        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Image compression failed"));
            }
          },
          file.type,
          0.7
        );
      };
    });
  };

  const compressVideo = async (file: File): Promise<File> => {
    return file; // Giữ nguyên video
  };

  // Hàm thêm hình ảnh
  const handleAddImages = async (files: FileList | null) => {
    if (!files) return;
    const compressedFiles: File[] = [];
    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      compressedFiles.push(compressed);
    }
    try {
      const formData = new FormData();
      compressedFiles.forEach((file) => formData.append("images", file));
      const response = await request.post(`/ServiceRequests/images/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setImages((prev) => [...prev, ...response.data]);
      }
    } catch (error) {
      console.error("Lỗi khi thêm hình ảnh:", error);
    }
  };

  // Hàm xóa hình ảnh
  
  const handleDeleteImage = async (image: string) => {
    // Loại bỏ hình ảnh khỏi danh sách hiển thị trước khi gọi API
    setImages((prev) => prev.filter((img) => img !== image));
    
    try {
      const response = await request.delete(`/ServiceRequests/images/${id}`, {
        data: [image],
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        console.log("Hình ảnh đã được xóa thành công");
      }
    } catch (error:any) {
      console.error("Lỗi khi xóa hình ảnh:", error.response?.data || error);
  
      // Khôi phục lại hình ảnh nếu việc xóa thất bại
      setImages((prev) => [...prev, image]);
      alert("Không thể xóa hình ảnh. Vui lòng thử lại!");
    }
  };

  // Hàm thêm video
  const handleAddVideos = async (files: FileList | null) => {
    if (!files) return;
    const compressedFiles: File[] = [];
    for (const file of Array.from(files)) {
      const compressed = await compressVideo(file);
      compressedFiles.push(compressed);
    }
    try {
      const formData = new FormData();
      compressedFiles.forEach((file) => formData.append("videos", file));
      const response = await request.post(`/ServiceRequests/videos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setVideos((prev) => [...prev, ...response.data]);
      }
    } catch (error) {
      console.error("Lỗi khi thêm video:", error);
    }
  };

  // Hàm xóa video
  const handleDeleteVideo = async (video: string) => {
    // Loại bỏ video khỏi danh sách hiển thị trước khi gọi API
    setVideos((prev) => prev.filter((vid) => vid !== video));
  
    try {
      const response = await request.delete(`/ServiceRequests/videos/${id}`, {
        data: [video],
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        console.log("Video đã được xóa thành công");
      }
    } catch (error:any) {
      console.error("Lỗi khi xóa video:", error.response?.data || error);
  
      // Khôi phục lại video nếu việc xóa thất bại
      setVideos((prev) => [...prev, video]);
      alert("Không thể xóa video. Vui lòng thử lại!");
    }
  };

  const handleRemoveItem = (type: "services" | "parts", id: number) => {
    if (type === "services") {
      setServices(services.filter((service) => service.id !== id));
    } else {
      setParts(parts.filter((part) => part.id !== id));
    }
  };

  const handleSaveServices = async () => {
    try {
      for (const service of services) {
        const data = {
          serviceId: service.id,
          quantity: service.quantity, // Số lượng dịch vụ
        };
  
        const response = await request.put(`/ServiceRequests/services/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        });
  
        console.log(`Dịch vụ ${service.id} đã được cập nhật:`, response.data);
      }
      alert("Dịch vụ đã được lưu thành công!");
    } catch (error:any) {
      console.error("Lỗi khi lưu dịch vụ:", error.response?.data || error);
      alert("Có lỗi xảy ra khi lưu dịch vụ. Vui lòng thử lại!");
    }
  };

  const handleSaveParts = async () => {
    try {
      for (const part of parts) {
        const data = {
          partId: part.id,
          quantity: part.quantity, // Số lượng phụ tùng
        };
  
        const response = await request.put(`/ServiceRequests/parts/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        });
  
        console.log(`Phụ tùng ${part.id} đã được cập nhật:`, response.data);
      }
      alert("Phụ tùng đã được lưu thành công!");
    } catch (error:any) {
      console.error("Lỗi khi lưu phụ tùng:", error.response?.data || error);
      alert("Có lỗi xảy ra khi lưu phụ tùng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-2xl max-w-6xl mx-auto mt-8">
      <h2 className="text-4xl font-bold text-white mb-6 border-b border-gray-600 pb-4">Chi Tiết Yêu Cầu</h2>
  
      {/* Thông tin yêu cầu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Mobile Phone", value: mobilePhone },
          { label: "Full Name", value: fullName },
          { label: "Email", value: email },
          { label: "Address", value: address },
          { label: "Issue Description", value: issueDescription },
          { label: "Total Price", value: totalPrice },
          { label: "Service Type", value: serviceType },
          { label: "Status", value: status },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-800 text-gray-300 rounded-lg px-4 py-2 shadow-md">
            <label className="font-semibold">{item.label}:</label>
            <p className="text-white">{item.value}</p>
          </div>
        ))}
      </div>
  
      {/* Hình ảnh */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white mb-4">Thêm Hình Ảnh</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleAddImages(e.target.files)}
          className="mb-4 text-white bg-gray-700 rounded-md px-4 py-2"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image} className="relative group">
              <img
                src={image}
                alt="Hình ảnh"
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => handleDeleteImage(image)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
  
      {/* Video */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white mb-4">Thêm Video</h3>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => handleAddVideos(e.target.files)}
          className="mb-4 text-white bg-gray-700 rounded-md px-4 py-2"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div key={video} className="relative group">
              <video controls src={video} className="w-full h-32 rounded-lg shadow-md" />
              <button
                onClick={() => handleDeleteVideo(video)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
  
      {/* Services */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white mb-4">Services</h3>
        <button
          onClick={() => setShowPopup("services")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150"
        >
          Thêm Dịch Vụ
        </button>
        <ul className="space-y-4 mt-4">
          {services.map((service) => (
            <li key={service.id} className="bg-gray-800 text-gray-300 p-4 rounded-lg shadow-md flex justify-between">
              <span>{service.name} - Số lượng: {service.quantity} - Giá: {service.price}</span>
              <button
                onClick={() => handleRemoveItem("services", service.id)}
                className="text-red-500 hover:text-red-600"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Parts */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white mb-4">Parts</h3>
        <button
          onClick={() => setShowPopup("parts")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150"
        >
          Thêm Phụ Tùng
        </button>
        <ul className="space-y-4 mt-4">
          {parts.map((part) => (
            <li key={part.id} className="bg-gray-800 text-gray-300 p-4 rounded-lg shadow-md flex justify-between">
              <span>{part.name} - Số lượng: {part.quantity} - Giá: {part.price} - Bảo hành: {part.warrantyTo}</span>
              <button
                onClick={() => handleRemoveItem("parts", part.id)}
                className="text-red-500 hover:text-red-600"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Nút lưu */}
      <button
        onClick={async () => {
          await handleSaveServices();
          await handleSaveParts();
        }}
        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-150 mt-4"
      >
        Lưu lại
      </button>
  
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold text-white mb-4">
              {showPopup === "services" ? "Chọn Dịch Vụ" : "Chọn Phụ Tùng"}
            </h3>
            <div className="space-y-2">
              {(showPopup === "services" ? servicesList : partsList).map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer text-gray-300 hover:bg-gray-700 p-2 rounded-lg transition"
                  onClick={() => handleAddItem(showPopup, item)}
                >
                  {item.name} - Giá: {item.price}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPopup(null)}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiTietYeuCau;
