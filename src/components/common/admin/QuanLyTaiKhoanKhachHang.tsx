import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useNavigate } from "react-router-dom";

interface Account {
  id: number;
  name: string;
  country: string;
}

const QuanLyTaiKhoanKhachHang = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    request
      .get("/accounts/customer/pagination", {
        params: {
          pageIndex,
          pageSize,
          keyword,
        },
      })
      .then((response) => {
        console.log(response);
        const data = response.data.datas.map((item: any) => ({
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
        setAccounts(data);
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
    setCountry('');
    setEditingId(null);
    setShowPopup(true);
  };

  const handleEdit = (account: Account) => {
    setName(account.name);
    setCountry(account.country);
    setEditingId(account.id);
    setShowPopup(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/accounts/admin/${id}`);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
     
        await request.put(`/accounts/admin/${editingId}`, {
          name,
          country,
        });
      } else {
    
        await request.post('/accounts/admin', {
          name,
          country,
        });
      }
      fetchData();
      setShowPopup(false);
    } catch (error) {
      console.error('Lỗi khi lưu tài khoản:', error);
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
    
      Header: "FullName",
      accessor: "fullName",
    },
    {
      Header: "MobilePhone",
      accessor: "mobilePhone",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "UserRoles",
      accessor: "userRoles",
    },
    {
      Header: "Thao tác",
      accessor: "action",
    
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Tài Khoản</h2>
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Thêm Tài Khoản</button>

      <Table
        columns={columns}
        data={accounts}
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Sửa Tài Khoản' : 'Thêm Tài Khoản'}</h3>
            <input
              type="text"
              placeholder="Name"
              className="border p-2 mb-4 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              className="border p-2 mb-4 w-full"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
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

export default QuanLyTaiKhoanKhachHang;
