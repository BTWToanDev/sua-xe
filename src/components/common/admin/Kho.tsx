import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { Link, useNavigate } from "react-router-dom";

// Định nghĩa kiểu cho Kho
interface Kho {
  id: number;
  supplier: string;
  entryDate: string;
  quantityReceived: number;
  quantityInStock: number;
  batchNumber: string;
  productionDate: string;
  tax: number;
  expirationDate: string;
  entryPrice: number;
}

const Kho = () => {
  const [khos, setKhos] = useState<Kho[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [supplier, setSupplier] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [quantityReceived, setQuantityReceived] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [batchNumber, setBatchNumber] = useState('');
  const [productionDate, setProductionDate] = useState('');
  const [tax, setTax] = useState(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [entryPrice, setEntryPrice] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    request
      .get("/PartInventories/available/${id}",
     )
      .then((response) => {
        console.log(response)
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
        setKhos(data);
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
    setSupplier(''); 
    setEntryDate('');
    setQuantityReceived(0);
    setQuantityInStock(0);
    setBatchNumber('');
    setProductionDate('');
    setTax(0);
    setExpirationDate('');
    setEntryPrice(0);
    setEditingId(null);
    setShowPopup(true); 
  };

  const handleEdit = (kho: any) => {
    setSupplier(kho.supplier); 
    setEntryDate(kho.entryDate);
    setQuantityReceived(kho.quantityReceived);
    setQuantityInStock(kho.quantityInStock);
    setBatchNumber(kho.batchNumber);
    setProductionDate(kho.productionDate);
    setTax(kho.tax);
    setExpirationDate(kho.expirationDate);
    setEntryPrice(kho.entryPrice);
    setEditingId(kho.id);
    setShowPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/kho/${id}`);
      fetchData(); 
    } catch (error) {
      console.error('Lỗi khi xóa kho:', error);
    }
  };

  const handleSave = async () => {
    try {
      const khoData = {
        supplier,
        entryDate,
        quantityReceived,
        quantityInStock,
        batchNumber,
        productionDate,
        tax,
        expirationDate,
        entryPrice,
      };

      if (editingId) {
        await request.put(`/kho/${editingId}`, khoData); 
      } else {
        await request.post('/kho', khoData); 
      }
      fetchData(); 
      setShowPopup(false); 
    } catch (error) {
      console.error('Lỗi khi lưu kho:', error);
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
    { Header: "Supplier", accessor: "supplier" },
    { Header: "Entry Date", accessor: "entryDate" },
    { Header: "Quantity Received", accessor: "quantityReceived" },
    { Header: "Quantity In Stock", accessor: "quantityInStock" },
    { Header: "Batch Number", accessor: "batchNumber" },
    { Header: "Production Date", accessor: "productionDate" },
    { Header: "Tax", accessor: "tax" },
    { Header: "Expiration Date", accessor: "expirationDate" },
    { Header: "Entry Price", accessor: "entryPrice" },
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
      <h2 className="text-2xl font-bold mb-4">Quản Lý Kho</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
        Thêm Kho
      </button>

      <Table
        columns={columns}
        data={khos}
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Kho' : 'Thêm Kho'}</h3>
            <input
              type="text"
              placeholder="Supplier"
              className="border p-2 mb-4 w-full"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
            <input
              type="date"
              placeholder="Entry Date"
              className="border p-2 mb-4 w-full"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity Received"
              className="border p-2 mb-4 w-full"
              value={quantityReceived}
              onChange={(e) => setQuantityReceived(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Quantity In Stock"
              className="border p-2 mb-4 w-full"
              value={quantityInStock}
              onChange={(e) => setQuantityInStock(Number(e.target.value))}
            />
            <input
              type="text"
              placeholder="Batch Number"
              className="border p-2 mb-4 w-full"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
            <input
              type="date"
              placeholder="Production Date"
              className="border p-2 mb-4 w-full"
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="Tax"
              className="border p-2 mb-4 w-full"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
            />
            <input
              type="date"
              placeholder="Expiration Date"
              className="border p-2 mb-4 w-full"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="Entry Price"
              className="border p-2 mb-4 w-full"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
            />
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">
                Hủy
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kho;
