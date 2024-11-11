import React, { useState, useEffect, useCallback } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request'; // Import request từ request.tsx
import Table from "/DoAn2/sua-xe/src/components/common/Table"; // Import component Table


interface Hang {
  id: number;
  tenHang: string;
  country: string;
  version: string; // Thêm thuộc tính version
  isActive: boolean; // Thêm thuộc tính isActive
}

const QuanLyHang = () => {
  const [Hangs, setHangs] = useState<Hang[]>([]); // Kiểu dữ liệu là mảng các Hang
  const [showPopup, setShowPopup] = useState(false);
  const [tenHang, setTenHang] = useState('');
  const [country, setCountry] = useState(''); // Thêm state cho version
  const [isActive, setIsActive] = useState(false); // Thêm state cho isActive
  const [editingId, setEditingId] = useState<string | null>(null); // Kiểu string hoặc null
  const [maHang, setMaHang] = useState(0);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  // Fetch dữ liệu từ API khi component mount
  const fetchHangs = useCallback(() => {
    request
      .get("/Brands/pagination", {
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
        setHangs(data);
        setTotalItems(response.data.total);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách hãng:', error);
      });
  }, [pageIndex, pageSize, keyword]);

  useEffect(() => {
    fetchHangs();
  }, [fetchHangs]);

  const handleAdd = () => {
    setMaHang(0);
    setTenHang('');
    setCountry('');
    setEditingId(null);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleEdit = (Hang: any) => {
    setMaHang(Hang.id);
    setTenHang(Hang.name);
    setCountry(Hang.country);
    setEditingId(Hang.id);
    setShowPopup(true); // Hiển thị pop-up
  };

  const handleDelete = async (id: any) => {
    try {
      await request.delete(`/Brands/${id}`); // API endpoint để xóa
      fetchHangs(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa hãng:', error);
    }
  };

  const handleSave = async () => {
    try {
      const serviceData = {
        name: tenHang,
        country: country ,
      
      };
      if (editingId) {
        // Update existing service
        await request.put(`Brands/${editingId}`, serviceData);
      } else {
        // Create a new service
        await request.post('/Brands', serviceData);
      }
     fetchHangs(); // Cập nhật danh sách phương tiện
      setShowPopup(false); // Đóng pop-up sau khi lưu
    } catch (error) {
      console.error('Lỗi khi lưu hãng:', error);
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

  // Định nghĩa columns cho bảng phương tiện
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
      Header: "Country",
      accessor: "country",
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
      <h2 className="text-2xl font-bold mb-4">Quản Lý Hãng</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Hãng</button>
      
      <Table
        columns={columns}
        data={Hangs}
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Hãng' : 'Thêm Hãng'}</h3>
            {/* Form thêm/sửa phương tiện */}
        
            <input
              type="text"
              placeholder="Tên Hãng"
              className="border p-2 mb-4 w-full"
              value={tenHang}
              onChange={(e) => setTenHang(e.target.value)}
            />
          
            <input
              type="text"
              placeholder="country"
              className="border p-2 mb-4 w-full"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
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

export default QuanLyHang ;
