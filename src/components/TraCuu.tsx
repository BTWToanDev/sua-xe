import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../utils/request";
import Table from "../components/common/Table";
import { getTokenWithExpiry } from "../constants/localStorage"; // Import hàm kiểm tra token

interface TraCuuInfo {
  id: number;
  fullName: string;
  address: string;
  issueDescription: string;
  totalPrice: number;
  status: string;
  type: string;
}

const TraCuu = () => {
  const [data, setData] = useState<TraCuuInfo[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [username, setUsername] = useState<string>(""); 
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Kiểm tra nếu người dùng đã đăng nhập
  const token = getTokenWithExpiry();  // Lấy token từ localStorage

  // Fetch dữ liệu
  const fetchData = useCallback(() => {
    if (!phoneNumber && !username) {
      setError("Vui lòng nhập số điện thoại hoặc tên đăng nhập!");
      return;
    }

    // Kiểm tra định dạng số điện thoại nếu có nhập
    if (phoneNumber) {
      const phoneRegex = /^[0-9]{10,12}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Số điện thoại không hợp lệ. Vui lòng nhập lại!");
        return;
      }
    }

    setError(""); // Clear error

    // Lựa chọn API endpoint dựa trên dữ liệu người dùng nhập
    const endpoint = username
      ? "home/service-requests-by-username"
      : "home/service-requests-by-mobile-phone";

    // Kiểm tra nếu username được nhập và người dùng chưa đăng nhập
    if (username && !token) {
      setError("Bạn phải đăng nhập để tra cứu bằng tên đăng nhập.");
      return;
    }

    request
      .get(endpoint, {
        params: {
          ...(username ? { username } : { mobilePhone: phoneNumber }),
          pageIndex,
          pageSize,
          keyword,
        },
      })
      .then((response) => {
        const receivedData: TraCuuInfo[] = response.data;
        const data = receivedData.map((item) => ({
          ...item,
          action: (
            <div className="flex">
              <button
                onClick={() => handleViewDetails(item)}
                className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
              >
                Chi Tiết
              </button>
            </div>
          ),
        }));
        setData(data);
        setTotalItems(receivedData.length);
      })
      .catch((error) => {
        console.error("Lỗi khi tra cứu:", error);
        setError("Có lỗi xảy ra khi tra cứu. Vui lòng thử lại sau.");
      });
  }, [phoneNumber, username, pageIndex, pageSize, keyword, token]);

  useEffect(() => {
    if (phoneNumber || username) fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPageIndex(0);
    fetchData();
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const handleViewDetails = (row: TraCuuInfo) => {
    navigate(`/chi-tiet-tra-cuu`, { state: { detailId: row.id, phoneNumber } });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Họ và Tên",
      accessor: "fullName",
    },
    {
      Header: "Địa Chỉ",
      accessor: "address",
    },
    {
      Header: "Mô Tả Vấn Đề",
      accessor: "issueDescription",
    },
    {
      Header: "Tổng Chi Phí",
      accessor: "totalPrice",
      Cell: ({ value }: any) => `${value} VND`,
    },
    {
      Header: "Trạng Thái",
      accessor: "status",
    },
    {
      Header: "Loại",
      accessor: "type",
    },
    {
      Header: "Thao tác",
      accessor: "action",
      Cell: ({ row }: any) => (
        <div className="flex">
          <button
            onClick={() => handleViewDetails(row.original)}
            className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
          >
            Chi Tiết
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Tra Cứu Thông Tin</h2>
        <button
          onClick={handleGoHome}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ← Quay Lại Trang Chủ
        </button>
      </div>

      {/* Nhập số điện thoại để tra cứu */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Nhập số điện thoại để tra cứu:
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Nhập số điện thoại"
            className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Tra Cứu
          </button>
        </div>
      </div>

      {/* Nhập tên đăng nhập để tra cứu (chỉ khi đã đăng nhập) */}
      {token && (
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Nhập tên đăng nhập để tra cứu:
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Tra Cứu
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Bảng thông tin tra cứu */}
      <Table
        columns={columns}
        data={data}
        total={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        keyword={keyword}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onKeywordChange={handleKeywordChange}
      />
    </div>
  );
};

export default TraCuu;
