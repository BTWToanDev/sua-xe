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
  const [showPopup, setShowPopup] = useState(false);
  const [mobilePhone, setMobilePhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [videos, setVideos] = useState<File | null>(null);
  const [images, setImages] = useState<File | null>(null);
  const [problems, setProblems] = useState('');
  const [services, setServices] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    request.get(`/ServiceRequests/${editingId || ""}`, {
      params: { pageIndex, pageSize, keyword },
    })
      .then((response) => {
        const data = response.data.datas.map((item: any) => ({
          ...item,
          videos: item.videos || '',
          images: item.images || '',
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
                className="bg-red-500 text-white px-2 py-1 rounded-lg"
              >
                Xóa
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
  }, [pageIndex, pageSize, keyword, editingId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setMobilePhone('');
    setFullName('');
    setAddress('');
    setIssueDescription('');
    setVideos(null);
    setImages(null);
    setProblems('');
    setServices('');
    setEditingId(null);
    setShowPopup(true);
  };

  const handleEdit = (request: Request) => {
    setMobilePhone(request.mobilePhone);
    setFullName(request.fullName);
    setAddress(request.address);
    setIssueDescription(request.issueDescription);
    setProblems(request.problems);
    setServices(request.services);
    setEditingId(request.id);
    setShowPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/ServiceRequests/${id}`);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa yêu cầu:", error);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('mobilePhone', mobilePhone);
      formData.append('fullName', fullName);
      formData.append('address', address);
      formData.append('issueDescription', issueDescription);
      formData.append('problems', problems);
      formData.append('services', services);
      if (videos) formData.append('videos', videos);
      if (images) formData.append('images', images);

      if (editingId) {
        await request.put(`/ServiceRequests/${editingId}`, formData);
      } else {
        await request.post("/ServiceRequests", formData);
      }

      fetchData();
      setShowPopup(false);
    } catch (error) {
      console.error("Lỗi khi lưu yêu cầu:", error);
    }
  };

  const handlePageChange = (newPageIndex: number) => setPageIndex(newPageIndex);
  const handlePageSizeChange = (newSize: number) => setPageSize(newSize);
  const handleKeywordChange = (newKeyword: string) => setKeyword(newKeyword);

  const columns = [
    { Header: "ID",
     accessor: "id" },

    { Header: "Mobile Phone", accessor: "mobilePhone" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Address", accessor: "address" },
    { Header: "Issue Description", accessor: "issueDescription" },
    {
      Header: "Videos",
      accessor: "videos",
      Cell: ({ value }: any) => (
        value ? (
          <button onClick={() => window.open(value, "_blank")} className="text-blue-500 hover:underline">
            Play Video
          </button>
        ) : "No Video"
      ),
    },
    {
      Header: "Images",
      accessor: "images",
      Cell: ({ value }: any) => (
        value ? (
          <img src={value} alt="Request Image" className="w-16 h-16 object-cover" />
        ) : "No Image"
      ),
    },
    { Header: "Problems", accessor: "problems" },
    { Header: "Services", accessor: "services" },
    {
      Header: "Thao tác",
      accessor: "action",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Yêu Cầu</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Yêu Cầu</button>
      
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

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? "Sửa Yêu Cầu" : "Thêm Yêu Cầu"}</h3>
            <input type="text" placeholder="Mobile Phone" className="border p-2 mb-4 w-full" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} />
            <input type="text" placeholder="Full Name" className="border p-2 mb-4 w-full" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input type="text" placeholder="Address" className="border p-2 mb-4 w-full" value={address} onChange={(e) => setAddress(e.target.value)} />
            <textarea placeholder="Issue Description" className="border p-2 mb-4 w-full" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} />
            <input type="file" accept="video/*" className="border p-2 mb-4 w-full" onChange={(e) => setVideos(e.target.files?.[0] || null)} />
            <input type="file" accept="image/*" className="border p-2 mb-4 w-full" onChange={(e) => setImages(e.target.files?.[0] || null)} />
            <input type="text" placeholder="Problems" className="border p-2 mb-4 w-full" value={problems} onChange={(e) => setProblems(e.target.value)} />
            <input type="text" placeholder="Services" className="border p-2 mb-4 w-full" value={services} onChange={(e) => setServices(e.target.value)} />
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">{editingId ? "Lưu" : "Thêm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyYeuCau;
