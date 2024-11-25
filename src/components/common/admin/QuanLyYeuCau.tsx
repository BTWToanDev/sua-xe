import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useNavigate } from "react-router-dom";

interface Request {
  id: number;
  mobilePhone: string;
  fullName: string;
  address: string;
  issueDescription: string;
  videos: string;
  images: string;
  problems: string;
  services: string;
}

const QuanLyYeuCau = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [showAddRequestPopup, setShowAddRequestPopup] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    request
      .get(`ServiceRequests/pagination`, {
        params: { pageIndex, pageSize, keyword },
      })
      .then((response) => {
        const data = response.data.datas.map((item: any) => ({
          ...item,
          videos: item.videos || "",
          images: item.images || "",
          action: (
            <div className="flex">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-lg mr-2"
              >
                Xóa
              </button>
              <button
                onClick={() => handleDetail(item.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded-lg"
              >
                Chi Tiết
              </button>
            </div>
          ),
        }));
        setRequests(data);
        setTotalItems(response.data.total);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/");
        }
        console.error("Lỗi khi lấy danh sách yêu cầu:", error);
      });
  }, [pageIndex, pageSize, keyword, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (request: Request) => {
    navigate(`/admin/sua-chua/sua/${request.id}`);
  };

  const handleDetail = (id: number) => {
    navigate(`/admin/sua-chua/chi-tiet-yeu-cau/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/ServiceRequests/${id}`);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa yêu cầu:", error);
    }
  };

  const handlePageChange = (newPageIndex: number) => setPageIndex(newPageIndex);
  const handlePageSizeChange = (newSize: number) => setPageSize(newSize);
  const handleKeywordChange = (newKeyword: string) => setKeyword(newKeyword);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Mobile Phone", accessor: "mobilePhone" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "Issue Description", accessor: "issueDescription" },
    { Header: "Total Price", accessor: "totalPrice" },
    { Header: "Type", accessor: "serviceType" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Thao tác",
      accessor: "action",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Yêu Cầu</h2>
      <button
        onClick={() => setShowAddRequestPopup(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Thêm Yêu Cầu
      </button>

      <Table
        columns={columns}
        data={requests}
        total={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        keyword={keyword}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onKeywordChange={handleKeywordChange}
      />

      {showAddRequestPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Chọn Loại Yêu Cầu</h3>
            <button
              onClick={() => navigate("/admin/deirec")}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
            >
              Tạo Yêu Cầu Trực Tiếp
            </button>
            <button
              onClick={() => navigate("/admin/remote")}
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg mb-4"
            >
              Tạo Yêu Cầu Từ Xa
            </button>
            <button
              onClick={() => navigate("/admin/rescue")}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
            >
              Tạo Yêu Cầu Cứu Hộ
            </button>
            <button
              onClick={() => setShowAddRequestPopup(false)}
              className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyYeuCau;
