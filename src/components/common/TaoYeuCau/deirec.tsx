import React, { useState, useEffect, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useNavigate } from "react-router-dom";

const Deirec = () => {
  const [mobilePhone, setMobilePhone] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [images, setImages] = useState<File[]>([]); // Hỗ trợ nhiều hình ảnh
  const [videos, setVideos] = useState<File[]>([]); // Hỗ trợ nhiều video
  const [problems, setProblems] = useState<{ id: number; name: string }[]>([]);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [problemsList, setProblemsList] = useState<{ id: number; name: string }[]>([]);
  const [servicesList, setServicesList] = useState<{ id: number; name: string }[]>([]);
  const [showPopup, setShowPopup] = useState<"problems" | "services" | null>(null);

  const navigate = useNavigate();

  const fetchDropdownData = useCallback(async () => {
    try {
      const [problemsResponse, servicesResponse] = await Promise.all([
        request.get("/Problems/dropdown"),
        request.get("/Services/dropdown"),
      ]);
      setProblemsList(problemsResponse.data);
      setServicesList(servicesResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dropdown:", error);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  // Nén hình ảnh dưới 5MB
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
          0.7 // Chất lượng nén (70%)
        );
      };
    });
  };

  // Nén video dưới 20MB (placeholder, thực tế cần thư viện như ffmpeg.js)
  const compressVideo = async (file: File): Promise<File> => {
    return file; // Giữ nguyên vì chưa có thư viện nén
  };

  const handleSave = async () => {
  try {
    const formData = new FormData();

    
    formData.append("mobilePhone", mobilePhone);
    formData.append("fullName", fullName);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("issueDescription", issueDescription);

    problems.forEach((problem) => formData.append("Problems", problem.id.toString()));
    services.forEach((service) => formData.append("Services", service.id.toString()));

 
    for (const image of images) {
      const compressedImage = await compressImage(image);
      formData.append('images', compressedImage);
    }

  
    for (const video of videos) {
      const compressedVideo = await compressVideo(video);
      formData.append('videos', compressedVideo);
    }

    const response = await request.post("/ServiceRequests/deirec", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Kết quả thành công:", response.data);
    navigate("/sua-chua");
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu:", error);
  }
};

  const handleAddItem = (type: "problems" | "services", item: { id: number; name: string }) => {
    if (type === "problems") {
      if (!problems.find((p) => p.id === item.id)) {
        setProblems([...problems, item]);
      }
    } else {
      if (!services.find((s) => s.id === item.id)) {
        setServices([...services, item]);
      }
    }
    setShowPopup(null); // Đóng popup sau khi chọn
  };

  const handleRemoveItem = (type: "problems" | "services", id: number) => {
    if (type === "problems") {
      setProblems(problems.filter((p) => p.id !== id));
    } else {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo Yêu Cầu</h2>
      {/* Form nhập thông tin */}
      <input
        type="text"
        placeholder="Mobile Phone"
        className="border p-2 mb-4 w-full"
        value={mobilePhone}
        onChange={(e) => setMobilePhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 mb-4 w-full"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        className="border p-2 mb-4 w-full"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-4 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Issue Description"
        className="border p-2 mb-4 w-full"
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
      />

      {/* Popup Problems */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Problems</label>
        <button
          onClick={() => setShowPopup("problems")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Chọn Problems
        </button>
        <div className="mt-2 flex flex-wrap">
          {problems.map((problem) => (
            <span
              key={problem.id}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg mr-2 mb-2 inline-block cursor-pointer"
              onClick={() => handleRemoveItem("problems", problem.id)}
            >
              {problem.name} ×
            </span>
          ))}
        </div>
      </div>

      {/* Popup Services */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Services</label>
        <button
          onClick={() => setShowPopup("services")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Chọn Services
        </button>
        <div className="mt-2 flex flex-wrap">
          {services.map((service) => (
            <span
              key={service.id}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg mr-2 mb-2 inline-block cursor-pointer"
              onClick={() => handleRemoveItem("services", service.id)}
            >
              {service.name} ×
            </span>
          ))}
        </div>
      </div>

      {/* Upload Hình ảnh */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Hình ảnh</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />
      </div>

      {/* Upload Video */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Video</label>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => setVideos(Array.from(e.target.files || []))}
        />
      </div>

      {/* Lưu */}
      <button onClick={handleSave} className="bg-red-500 text-white px-6 py-3 rounded-lg">
        Lưu Yêu Cầu
      </button>

      {/* Popup hiển thị */}
      {showPopup && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">
              {showPopup === "problems" ? "Chọn Problem" : "Chọn Service"}
            </h3>
            {(showPopup === "problems" ? problemsList : servicesList).map((item) => (
              <div
                key={item.id}
                className="cursor-pointer mb-2"
                onClick={() => handleAddItem(showPopup, item)}
              >
                {item.name}
              </div>
            ))}
            <button
              onClick={() => setShowPopup(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deirec;
