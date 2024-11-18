import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "/DoAn2/sua-xe/src/components/common/Table";
import request from "/DoAn2/sua-xe/src/utils/request";

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
  const { partId } = useParams<{ partId: string }>();
  const [khos, setKhos] = useState<Kho[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [supplier, setSupplier] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantityReceived, setQuantityReceived] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [productionDate, setProductionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [tax, setTax] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    if (!partId) return;
    request
      .get(`/PartInventories/available/${partId}`)
      .then((response) => {
        const data = response.data.map((item: any) => ({
          id: item.partId,
          supplier: item.supplier,
          entryDate: item.entryDate,
          quantityReceived: item.quantityReceived,
          quantityInStock: item.quantityInStock,
          batchNumber: item.batchNumber,
          productionDate: new Date(item.productionDate).toLocaleDateString("vi-VN"),
          tax: item.tax,
          expirationDate: new Date(item.expirationDate).toLocaleDateString("vi-VN"),
          entryPrice: item.entryPrice,
          action: (
            <div className="flex">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(item.partId)}
                className="bg-red-500 text-white px-2 py-1 rounded-lg"
              >
                Xóa
              </button>
            </div>
          ),
        }));
        setKhos(data);
        setTotalItems(response.data.length);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/");
        }
        console.error("Lỗi khi tải dữ liệu:", error);
      });
  }, [partId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (kho: Kho) => {
    setSupplier(kho.supplier);
    setBatchNumber(kho.batchNumber);
    setQuantityReceived(kho.quantityReceived);
    setEntryPrice(kho.entryPrice);
    setProductionDate(kho.productionDate);
    setExpirationDate(kho.expirationDate);
    setTax(kho.tax);
    setEditingId(kho.id);
    setShowPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/kho/${id}`);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa kho:", error);
    }
  };

  const handleSave = async () => {
    try {
      const khoData = {
        supplier,
        batchNumber,
        quantityReceived,
        entryPrice,
        productionDate,
        expirationDate,
        tax,
      };

      if (editingId) {
        await request.put(`/kho/${editingId}`, khoData);
      } else {
        await request.post('/kho', khoData);
      }
      fetchData();
      setShowPopup(false);
    } catch (error) {
      console.error("Lỗi khi lưu kho:", error);
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
    { Header: "Batch Number", accessor: "batchNumber" },
    { Header: "Supplier", accessor: "supplier" },
    { Header: "Tax", accessor: "tax" },
    { Header: "Quantity Received", accessor: "quantityReceived" },
    { Header: "Entry Price", accessor: "entryPrice" },
    { Header: "Production Date", accessor: "productionDate" },
    { Header: "Expiration Date", accessor: "expirationDate" },
    { Header: "Thao tác", accessor: "action" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Kho</h2>
      <button onClick={() => setShowPopup(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingId ? "Sửa Kho" : "Thêm Kho"}</h3>
            <div className="mb-2">
              <label>Batch Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label>Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label>Tax</label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label>Quantity Received</label>
              <input
                type="number"
                value={quantityReceived}
                onChange={(e) => setQuantityReceived(Number(e.target.value))}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label>Entry Price</label>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
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
