import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useNavigate } from "react-router-dom";

interface PhuTung {
  id: number;
  name: string;
  tenHang:string;
  createdDate: string;
  updateDate: string;
  warrantyPeriod: number;
  price: number;
  isActive: boolean;
}

interface Brand {
  id: number;
  name: string;
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
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tenHang, setTenHang] = useState('');  // Thêm state cho tenHang

  const [showNhapHangPopup, setShowNhapHangPopup] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');
  const [supplier, setSupplier] = useState('');
  const [tax, setTax] = useState<number | null>(null);
  const [quantityReceived, setQuantityReceived] = useState<number | null>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [productionDate, setProductionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

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
                onClick={() => handleNhapHang(item.id)}
                className="bg-green-500 text-white px-2 py-1 rounded-lg"
              >
                Nhập Hàng
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

  const fetchBrands = useCallback(() => {
    request.get("/Brands/dropdown")
      .then((response) => setBrands(response.data))
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách hãng:', error);
      });
  }, []);

  useEffect(() => {
    fetchData();
    fetchBrands();
  }, [fetchData, fetchBrands]);

  const handleAdd = () => {
    setName('');
    setWarrantyPeriod(null);
    setPrice(null);
    setTenHang('');  // Reset tenHang
    setSelectedBrandId(null);
    setEditingId(null);
    setShowPopup(true);
  };

  const handleEdit = (phuTung: PhuTung) => {
    setName(phuTung.name);
    setWarrantyPeriod(phuTung.warrantyPeriod);
    setPrice(phuTung.price);
    setTenHang(phuTung.tenHang);  // Thiết lập tenHang khi chỉnh sửa
    setSelectedBrandId(phuTung.id);
    setIsActive(phuTung.isActive);
    setEditingId(phuTung.id);
    setShowPopup(true);
  };

  const handleViewKho = (partId: number) => {
    navigate(`/admin/kho/${partId}`);
  };

  const handleNhapHang = (partId: number) => {
    setSelectedPartId(partId);
    setBatchNumber('');
    setSupplier('');
    setTax(null);
    setQuantityReceived(null);
    setEntryPrice(null);
    setProductionDate('');
    setExpirationDate('');
    setShowNhapHangPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/Parts/${id}`);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa phụ tùng:', error);
    }
  };

  const handleSaveNhapHang = async () => {
    try {
      await request.post('/PartInventories', {
        partId: selectedPartId,
        batchNumber,
        supplier,
        tax,
        quantityReceived,
        entryPrice,
        productionDate,
        expirationDate,
      });
      fetchData();
      setShowNhapHangPopup(false);
    } catch (error) {
      console.error('Lỗi khi lưu nhập hàng:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedBrandId) {
        console.error("Vui lòng chọn một hãng hợp lệ");
        return;
      }
  
      const payload = {
        name,
        price,
        warrantyPeriod,
        brandId: selectedBrandId,  // Đảm bảo gửi đúng brandId
      };
  
      if (editingId) {
        await request.put(`/Parts/${editingId}`, payload);
      } else {
        await request.post('/Parts', payload);
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

      {showNhapHangPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold mb-4">Nhập Hàng</h3>
          <input type="text" placeholder="Số Lô" className="border p-2 mb-4 w-full" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} />
          <input type="text" placeholder="Nhà Cung Cấp" className="border p-2 mb-4 w-full" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          <input type="number" placeholder="Thuế" className="border p-2 mb-4 w-full" value={tax || ''} onChange={(e) => setTax(Number(e.target.value))} />
          <input type="number" placeholder="Số Lượng" className="border p-2 mb-4 w-full" value={quantityReceived || ''} onChange={(e) => setQuantityReceived(Number(e.target.value))} />
          <input type="number" placeholder="Giá Nhập" className="border p-2 mb-4 w-full" value={entryPrice || ''} onChange={(e) => setEntryPrice(Number(e.target.value))} />
          
          <div className="mb-4">
            <label htmlFor="productionDate" className="block text-sm font-semibold mb-2">Ngày Sản Xuất</label>
            <input type="date" id="productionDate" className="border p-2 w-full" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
          </div>
          
          <div className="mb-4">
            <label htmlFor="expirationDate" className="block text-sm font-semibold mb-2">Ngày Hết Hạn</label>
            <input type="date" id="expirationDate" className="border p-2 w-full" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
          </div>
      
          <div className="flex justify-end">
            <button onClick={() => setShowNhapHangPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
            <button onClick={handleSaveNhapHang} className="bg-green-500 text-white px-4 py-2 rounded-lg">Lưu</button>
          </div>
        </div>
      </div>
      
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Phụ Tùng' : 'Thêm Phụ Tùng'}</h3>
            <input type="text" placeholder="Tên Phụ Tùng" className="border p-2 mb-4 w-full" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Giá" className="border p-2 mb-4 w-full" value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />
            <input type="number" placeholder="Thời Hạn Bảo Hành (Tháng)" className="border p-2 mb-4 w-full" value={warrantyPeriod || ''} onChange={(e) => setWarrantyPeriod(Number(e.target.value))} />

            <select className="border p-2 mb-4 w-full" value={selectedBrandId || ''} onChange={(e) => setSelectedBrandId(Number(e.target.value))}>
              <option value="">Chọn Hãng</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
           
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">{editingId ? 'Lưu' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyPhuTung;
