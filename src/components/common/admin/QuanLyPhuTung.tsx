import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useNavigate } from "react-router-dom";

interface PhuTung {
  id: number;
  name: string;
  createdDate: string;
  updateDate: string;
  warrantyPeriod: number;
  price: number;
  isActive: boolean;
}

const QuanLyPhuTung = () => {
  const [phuTungs, setPhuTungs] = useState<PhuTung[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    request
      .get("/Parts/pagination", {
        params: {
          pageIndex,
          pageSize,
          keyword,
        },
      })
      .then((response) => {
        const data = response.data.datas.map((item: any) => ({
          ...item,
          action: (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleViewKho(item.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded-lg"
              >
                Xem Kho
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-lg"
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
        setPhuTungs(data);
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
    setName('');
    setWarrantyPeriod(null);
    setPrice(null);
    setIsActive(false);
    setEditingId(null);
    setShowPopup(true);
  };

  const handleEdit = (phuTung: PhuTung) => {
    setName(phuTung.name);
    setWarrantyPeriod(phuTung.warrantyPeriod);
    setPrice(phuTung.price);
    setIsActive(phuTung.isActive);
    setEditingId(phuTung.id);
    setShowPopup(true);
  };

  const handleViewKho = (id: number) => {
    navigate(`/PartInventories/available/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/Parts/${id}`);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa phụ tùng:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await request.put(`/Parts/${editingId}`, { name, price });
      } else {
        await request.post('/Parts', { name, price });
      }
      fetchData();
      setShowPopup(false);
    } catch (error) {
      console.error('Lỗi khi lưu phụ tùng:', error);
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
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Price", accessor: "price" },
    { Header: "Thao tác", accessor: "action" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Phụ Tùng</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
        Thêm Phụ Tùng
      </button>
      <Table
        columns={columns}
        data={phuTungs}
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Phụ Tùng' : 'Thêm Phụ Tùng'}</h3>
            <input
              type="text"
              placeholder="Tên Phụ Tùng"
              className="border p-2 mb-4 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Giá"
              className="border p-2 mb-4 w-full"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <label className="inline-flex items-center mb-4">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <span className="ml-2">Hoạt động</span>
            </label>
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                {editingId ? 'Lưu' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyPhuTung;
