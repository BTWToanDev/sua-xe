import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import request from "../utils/request";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from "../utils/format";

const ChiTietTraCuuTaiKhoan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { detailId } = state || {};  // Chỉ cần nhận `detailId`
  console.log("detailId from state:", detailId);
  const [detailData, setDetailData] = useState<any>(null);

  useEffect(() => {
    console.log("Checking detailId in useEffect:", detailId);  // Kiểm tra xem `detailId` có sẵn khi gọi API không
    if (detailId) {
      request
        .get(`/servicerequests/${detailId}`)
        .then((response) => {
          console.log("Dữ liệu trả về từ API:", response);  // Kiểm tra dữ liệu nhận được từ API
          setDetailData(response.data);  // Lưu dữ liệu vào state
        })
        .catch((err) => {
          console.error("Lỗi khi lấy chi tiết:", err);  // Kiểm tra lỗi nếu có
        });
    } else {
      console.log("Không có `detailId`, không thể lấy dữ liệu");
    }
  }, [detailId]);
  
  console.log(detailData);
  

  if (!detailData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-lg animate-pulse">Đang tải thông tin chi tiết...</p>
      </div>
    );
  }

  const handleGoBack = () => navigate(-1); // Quay lại trang trước
  const handlePayment = () => {
    console.log(detailData);
    if (detailId && detailData.totalPrice) {
      const payload = {
        serviceRequestId: detailId,
        amount: detailData.totalPrice,
      };
      function getTokenFromURL(url: string): string | null {
        try {
          const urlParams = new URL(url).searchParams;
          return urlParams.get("token");
        } catch (error) {
          console.error("Invalid URL:", error);
          return null;
        }
      }
      request
      .post('/payments/PayPal/create', payload)
      .then((response) => {
        console.log(response.data.url);
        if (response) {
          const popupWindow = window.open(response.data.url, '_blank', 'width=800,height=600');

          // Kiểm tra nếu cửa sổ không bị chặn (trình duyệt có thể chặn popup)
          if (!popupWindow) {
            alert("Cửa sổ popup bị chặn, vui lòng kiểm tra trình duyệt của bạn.");
          }

          const checkPopupClosed = setInterval(() => {
            if (popupWindow && popupWindow.closed) {
              clearInterval(checkPopupClosed); 
              const token = getTokenFromURL(response.data.url);

              request.get("/payments/paypal/check-payment/"+ token)
                .then((response) => {
                  if (response.status === 200) {
                    navigate('/ThanhToanThanhCong');
                  } else {
                    alert("Thanh toán thất bại");
                  }
                })
                .catch((error) => {
                  console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
                  alert("Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán.");
                });
            }
          }, 1000);
        } else {
          alert("Không nhận được URL hợp lệ từ API.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thanh toán:", error);
        alert("Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.");
      });
  } 
};

  const handleCancel = () => alert("Yêu cầu đã được hủy!");

  const handlePrintInvoice = () => {
    console.log(detailData);
    const docDefinition = {
      pageSize: "A4",
      content: [
        { text: "Hóa Đơn", style: "header" },
        `Mã Đơn Hàng: ${detailId}`,
        `Ngày: ${formatDate(detailData.orderDate)}`,
        `Tên Khách Hàng: ${detailData.fullName}`,
        `Số Điện Thoại: ${detailData.mobilePhone}`,
        `Email: ${detailData.email}`,
        `Vấn đề: ${detailData.problemseur }`,
        `Tổng Tiền: ${detailData.totalPrice.toLocaleString()} VND`,
        {
          table: {
            body: [
              [
                { text: "Tên Dịch Vụ", style: "tableHeader" },
                { text: "Số Lượng", style: "tableHeader" },
                { text: "Đơn Giá", style: "tableHeader" },
                { text: "Tổng Tiền", style: "tableHeader" },
              ],
              ...detailData.services.map((service: any) => [
                service.name,
                service.quantity,
                service.price.toLocaleString(),
                (service.quantity * service.price).toLocaleString(),
              ]),
            ],
          },
        },
        {
          table: {
            body: [
              [
                { text: "Tên linh kiện", style: "tableHeader" },
                { text: "Số Lượng", style: "tableHeader" },
                { text: "Đơn Giá", style: "tableHeader" },
                { text: "Tổng Tiền", style: "tableHeader" },
                { text: "Bảo hành đến", style: "tableHeader" },
              ],
              ...detailData.parts.map((part: any) => [
                part.name,
                part.quantity,
                part.price.toLocaleString(),
                (part.quantity * part.price).toLocaleString(),
                part.warrantyTo,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 20] },
        subHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        tableHeader: { bold: true, fontSize: 13, color: "black" },
        content: { fontSize: 12, margin: [0, 0, 0, 5] },
      },
    };
    pdfMake.createPdf(docDefinition).download("hoa-don-dich-vu.pdf");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg mt-8 text-white">
      {/* Nút Quay Lại */}
      <button
        onClick={handleGoBack}
        className="mb-4 px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition"
      >
        ← Quay Lại
      </button>

      {/* Thông tin tiêu đề */}
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-3">Chi Tiết Tra Cứu</h2>

      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-700 p-4 rounded-md shadow">
        {[ 
          { label: "Số Điện Thoại", value: detailData.mobilePhone },
          { label: "Họ và Tên", value: detailData.fullName },
          { label: "Email", value: detailData.email },
          { label: "Địa Chỉ", value: detailData.address },
          { label: "Loại Dịch Vụ", value: detailData.serviceType },
          { label: "Tổng Chi Phí", value: `${detailData.totalPrice} VND`, isHighlight: true },
        ].map((item, index) => (
          <div key={index}>
            <p className="text-xs text-gray-400">{item.label}</p>
            <p
              className={`font-medium ${item.isHighlight ? "text-sm text-green-400" : "text-sm text-gray-100"}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Mô tả vấn đề */}
      <div className="mb-6 bg-gray-700 p-4 rounded-md shadow">
        <p className="text-xs text-gray-400">Mô Tả Vấn Đề</p>
        <p className="font-medium text-sm text-gray-100">{detailData.issueDescription}</p>
      </div>

      {/* Trạng thái */}
      <div className="mb-6 bg-gray-700 p-4 rounded-md shadow">
        <p className="text-xs text-gray-400">Trạng Thái</p>
        <p
          className={`font-bold text-sm ${detailData.status === "Hoàn Thành" ? "text-green-400" : "text-yellow-400"}`}
        >
          {detailData.status}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePayment}
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 transition"
        >
          Thanh Toán
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition"
        >
          Hủy Yêu Cầu
        </button>
        <button
          onClick={handlePrintInvoice}
          className="px-6 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-500 transition"
        >
          In Hóa Đơn
        </button>
      </div>
    </div>
  );
};

export default ChiTietTraCuuTaiKhoan;
