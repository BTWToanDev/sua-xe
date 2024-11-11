import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { Link, useNavigate } from "react-router-dom";

// Định nghĩa kiểu cho vấn đề
interface Issue {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

const QuanLyVanDe = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    request
      .get("Problems/pagination", {
        params: {
          pageIndex,
          pageSize,
          keyword,
        },
      })
      .then((response) => {
        const data = response.data.datas.map((item:any) => ({
          ...item,
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
        setIssues(data);
        setTotalItems(response.data.total);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/");
        }
        console.log(error);
      });
  }, [pageIndex, pageSize, keyword, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setName(''); // Reset khi thêm mới
    setDescription('');
    setIsActive(false);
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (issue: Issue) => {
    setName(issue.name); // Set giá trị khi sửa
    setDescription(issue.description);
    setIsActive(issue.isActive);
    setEditingId(issue.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/issue/${id}`);
      fetchData(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa vấn đề:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Sửa vấn đề
        await request.put(`/issue/${editingId}`, {
          name,
          description,
          isActive,
        });
      } else {
        // Thêm vấn đề mới
        await request.post('/issue', {
          name,
          description,
          isActive,
        });
      }
      fetchData(); // Cập nhật danh sách
      setShowPopup(false); // Đóng pop-up
    } catch (error) {
      console.error('Lỗi khi lưu vấn đề:', error);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
  };

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "IsActive",
      accessor: "isActive",
      Cell: ({ value }: any) => (
        <span>{value ? "Active" : "Inactive"}</span>
      ),
    },
    {
      Header: "Thao tác",
      accessor: "action",
      Cell: ({ row }: any) => (
        <div className="flex">
          <button
            onClick={() => handleEdit(row.original)}
            className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="bg-red-500 text-white px-2 py-1 rounded-lg"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Vấn Đề</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Vấn Đề</button>
      
      <Table
        columns={columns}
        data={issues}
        total={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        keyword={keyword}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onKeywordChange={handleKeywordChange}
      />

      {showPopup && (
        <div className="fixed inset-0 bg-slate-200 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Vấn Đề' : 'Thêm Vấn Đề'}</h3>
            {/* Form thêm/sửa vấn đề */}
            <input
              type="text"
              placeholder="Name"
              className="border p-2 mb-4 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="border p-2 mb-4 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <span className="ml-2">Is Active</span>
            </label>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">{editingId ? 'Lưu' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyVanDe;
