import React, { useState, useEffect, useCallback } from 'react';
import request from '/DoAn2/sua-xe/src/utils/request';
import Table from "/DoAn2/sua-xe/src/components/common/Table";

interface PhuongTien {
  id: number;
  loaiPhuongTien: string;
  tenHang: string;
  tenPhuongTien: string;
  version: string;
  isActive: boolean;
  images: string;
}

interface Brand {
  id: number;
  name: string;
}

const QuanLyPhuongTien = () => {
  const [phuongTiens, setPhuongTiens] = useState<PhuongTien[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loaiPhuongTien, setLoaiPhuongTien] = useState('');
  const [tenHang, setTenHang] = useState('');  // Thêm state cho tenHang
  const [tenPhuongTien, setTenPhuongTien] = useState('');
  const [version, setVersion] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [images, setImages] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchPhuongTiens = useCallback(() => {
    request.get("/Vehicles/pagination", {
      params: {
        pageIndex,
        pageSize,
        keyword,
      },
    })
    .then((response) => {
      const data = response.data.datas.map((item: any) => ({
        ...item,
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
      setPhuongTiens(data);
      setTotalItems(response.data.total);
    })
    .catch((error) => {
      console.error('Lỗi khi lấy danh sách phương tiện:', error);
    });
  }, [pageIndex, pageSize, keyword]);

  const fetchBrands = useCallback(() => {
    request.get("/Brands/dropdown")
      .then((response) => setBrands(response.data))
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách hãng:', error);
      });
  }, []);

  useEffect(() => {
    fetchPhuongTiens();
    fetchBrands();
  }, [fetchPhuongTiens, fetchBrands]);

  const handleAdd = () => {
    setLoaiPhuongTien('');
    setTenHang('');  // Reset tenHang
    setTenPhuongTien('');
    setVersion('');
    setIsActive(false);
    setImages(null);
    setSelectedBrandId(null);
    setEditingId(null);
    setShowPopup(true);
  };

  const handleEdit = (phuongTien: PhuongTien) => {
    setLoaiPhuongTien(phuongTien.loaiPhuongTien);
    setTenHang(phuongTien.tenHang);  // Thiết lập tenHang khi chỉnh sửa
    setTenPhuongTien(phuongTien.tenPhuongTien);
    setVersion(phuongTien.version);
    setIsActive(phuongTien.isActive);
    setSelectedBrandId(phuongTien.id);
    setImages(null);
    setEditingId(phuongTien.id.toString());
    setShowPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/Vehicles/${id}`);
      fetchPhuongTiens();
    } catch (error) {
      console.error('Lỗi khi xóa phương tiện:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages(file);
    }
  };

  const handleSave = async () => {
    try {
      if (!tenPhuongTien || !version || !selectedBrandId) {
        console.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const formData = new FormData();
      formData.append('name', tenPhuongTien);
      formData.append('version', version);
      formData.append('brandId', String(selectedBrandId));
      if (images) {
        formData.append('images', images);
      }
      formData.append('isActive', JSON.stringify(isActive));

      if (editingId) {
        await request.put(`/Vehicles/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await request.post('/Vehicles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchPhuongTiens();
      setShowPopup(false);
    } catch (error) {
      console.error('Lỗi khi lưu phương tiện:', error);
    }
  };

  const handlePageChange = (newPageIndex: number) => setPageIndex(newPageIndex);
  const handlePageSizeChange = (newSize: number) => setPageSize(newSize);
  const handleKeywordChange = (newKeyword: string) => setKeyword(newKeyword);

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Hình Ảnh",
      accessor: "images",
      Cell: ({ value }: any) => (
        value ? <img src={value} alt="Hình Ảnh" className="w-16 h-16 object-cover" /> : "No Image"
      ),
    },
    {
      Header: "Tên Phương Tiện",
      accessor: "name",
    },
    {
      Header: "Version",
      accessor: "version",
    },
    {
      Header: "Tên Hãng",
      accessor: "brand",
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
      <h2 className="text-2xl font-bold mb-4">Quản Lý Phương Tiện</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Phương Tiện</button>
      
      <Table
        columns={columns}
        data={phuongTiens}
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Phương Tiện' : 'Thêm Phương Tiện'}</h3>

            <input type="text" placeholder="Tên Phương Tiện" className="border p-2 mb-4 w-full" value={tenPhuongTien} onChange={(e) => setTenPhuongTien(e.target.value)} />
            <input type="text" placeholder="Version" className="border p-2 mb-4 w-full" value={version} onChange={(e) => setVersion(e.target.value)} />
            
            <select className="border p-2 mb-4 w-full" value={selectedBrandId || ''} onChange={(e) => setSelectedBrandId(Number(e.target.value))}>
              <option value="">Chọn Hãng</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>

            <input type="file" className="border p-2 mb-4 w-full" onChange={handleImageChange} />
            <label>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Kích Hoạt
            </label>

            <div className="flex justify-end mt-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyPhuongTien;
