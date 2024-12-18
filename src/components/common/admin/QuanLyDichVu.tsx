import React, { useEffect, useState, useCallback } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx
import Table from "/DoAn2/sua-xe/src/components/common/Table"; // Import component Table

// Định nghĩa interface cho dịch vụ
interface DichVu {
  id: number;
  tenDichVu: string;
  gia: number;
  isActive: boolean; // Thêm thuộc tính isActive cho dịch vụ
}

const QuanLyDichVu = () => {
  const [dichVus, setDichVus] = useState<DichVu[]>([]); // Định nghĩa kiểu dữ liệu của dichVus là mảng DichVu
  const [showPopup, setShowPopup] = useState(false);
  const [maDichVu, setMaDichVu] = useState(0);
  const [tenDichVu, setTenDichVu] = useState('');
  const [gia, setGia] = useState<number | string>(''); // Giá có thể là số hoặc chuỗi, tùy theo trạng thái
  const [isActive, setIsActive] = useState(false); // Thêm trạng thái isActive
  const [editingId, setEditingId] = useState<number | null>(null); // ID có thể là số hoặc null
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  // Fetch dữ liệu từ API
  const fetchDichVus = useCallback(() => {
    request
      .get("Services/pagination", {
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
        setDichVus(data);
        setTotalItems(response.data.total);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      });
  }, [pageIndex, pageSize, keyword]);

  useEffect(() => {
    fetchDichVus();
  }, [fetchDichVus]);

  const handleAdd = () => {
    setMaDichVu(0); // Reset khi thêm mới
    setTenDichVu('');
    setGia('');
    setIsActive(false);
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (service:any) => { // Định nghĩa kiểu cho service
    setMaDichVu(service.id); // Set giá trị khi sửa
    setTenDichVu(service.name);
    setGia(service.price);
    setEditingId(service.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: any) => {
    try {
      await request.delete(`/Services/${id}`);
      fetchDichVus(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
    }
  };

  const handleSave = async () => {
    try {
      const serviceData = {
        name: tenDichVu,
        price: Number(gia),
      
      };
      if (editingId) {
        // Update existing service
        await request.put(`Services/${editingId}`, serviceData);
      } else {
        // Create a new service
        await request.post('/Services', serviceData);
      }
      fetchDichVus(); // Cập nhật danh sách dịch vụ
      setShowPopup(false); // Đóng pop-up sau khi lưu
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
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

  // Định nghĩa columns cho bảng dịch vụ
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
      Header: "Price",
      accessor: "price",
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
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Dịch Vụ</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Dịch Vụ</button>
      
      <Table
        columns={columns}
        data={dichVus}
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ'}</h3>
           
            <input
              type="text"
              placeholder="Tên Dịch Vụ"
              className="border p-2 mb-4 w-full"
              value={tenDichVu}
              onChange={(e) => setTenDichVu(e.target.value)}
            />
            <input
              type="number"
              placeholder="Giá"
              className="border p-2 mb-4 w-full"
              value={gia}
              onChange={(e) => setGia(e.target.value)}
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

export default QuanLyDichVu;
