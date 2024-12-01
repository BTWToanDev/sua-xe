import Table from "/DoAn2/sua-xe/src/components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useNavigate } from "react-router-dom";

interface Account {
  id: number;
  username: string;
  fullName: string;
  mobilePhone: string;
  address: string;
  email: string;
  userRoles: string[];
}

const QuanLyTaiKhoan = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null); // Tài khoản đang chỉnh sửa
  const [roles, setRoles] = useState<string[]>([]); // Danh sách quyền
  const [userRoles, setUserRoles] = useState<string[]>([]); // Quyền của tài khoản đang chỉnh sửa
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
 
  // Lấy dữ liệu tài khoản
  const fetchData = useCallback(() => {
    request
      .get("/accounts/admin/pagination", {
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

  // Lấy danh sách quyền
  const fetchRoles = useCallback(() => {
    request
      .get("/accounts/roles")
      .then((response) => {
        console.log(response);
        setRoles(response.data); // Danh sách quyền có sẵn
      })
      .catch((error) => console.error("Lỗi khi lấy quyền:", error));
  }, []);

  useEffect(() => {

    fetchData();
    fetchRoles();
  }, [fetchData, fetchRoles]);

  useEffect(() => {
    if (editingAccount) {
      setFullName(editingAccount.fullName);
      setMobilePhone(editingAccount.mobilePhone);
      setAddress(editingAccount.address);
      setEmail(editingAccount.email);
      setUserRoles(editingAccount.userRoles);  // Cập nhật quyền khi chỉnh sửa
    }
  }, [editingAccount]);

  const handleAdd = () => {
    setEditingAccount(null); 
    setShowPopup(true);
    setUserRoles([]);
  };

  
  const handleEdit = (account: Account) => {
    setEditingAccount(account);  
    setUserRoles(account.userRoles);  // Cập nhật quyền cho tài khoản đang chỉnh sửa
    setFullName(account.fullName);  // Cập nhật tên đầy đủ
    setMobilePhone(account.mobilePhone);  // Cập nhật số điện thoại
    setAddress(account.address);  // Cập nhật địa chỉ
    setEmail(account.email);  // Cập nhật email
    setPassword('');  // Không hiển thị mật khẩu cũ, chỉ để người dùng nhập mật khẩu mới nếu cần
    setConfirmPassword('');  // Tương tự với mật khẩu xác nhận
    setShowPopup(true);  // Hiển thị popup chỉnh sửa
  };
  

 
  const handleSave = () => {
    if (userRoles.length === 0) {
      alert("Vui lòng chọn ít nhất một quyền!");
      return;
    }
  
   
    const updatedAccount = {
      roles: userRoles[0], 
    };
  
    console.log("Dữ liệu quyền đang gửi: ", updatedAccount);
  
    if (editingAccount) {
      request
        .patch(`/accounts/roles/${editingAccount.username}`, userRoles)
        .then((response) => {
          alert("Cập nhật quyền thành công!");
          setShowPopup(false);
          fetchData();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật quyền:", error);
      
          if (error.response) {
           
            const { errors } = error.response.data;
            if (errors && errors.roles) {
              alert(`Lỗi với quyền: ${errors.roles.join(', ')}`);
            } else {
              alert(`Lỗi: ${error.response.data.message}`);
            }
          } else {
            alert("Lỗi kết nối với API!");
          }
        });
    } else {
    
      const newAccount = {
        fullName,
        mobilePhone,
        address,
        email,
        password,
        roles: userRoles[0], 
      };
  
      console.log("Dữ liệu tạo tài khoản:", newAccount);
  
      request
        .post("/accounts", newAccount)
        .then((response) => {
          alert("Tạo tài khoản thành công!");
          setShowPopup(false);
          fetchData();
        })
        .catch((error) => {
          console.error("Lỗi khi tạo tài khoản:", error);
          if (error.response) {
            const { errors } = error.response.data;
            if (errors && errors.roles) {
              alert(`Lỗi với quyền: ${errors.roles.join(', ')}`);
            } else {
              alert(`Lỗi: ${error.response.data.message}`);
            }
          } else {
            alert("Lỗi kết nối với API!");
          }
        });
    }
  };
  
  
  



  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/accounts/admin/${id}`);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
    }
  };

 
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
    setUserRoles(selectedRoles);
    
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
      Header: "Username",
      accessor: "username",
    },
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
            <h3 className="text-xl font-bold mb-4">{editingAccount ? "Chỉnh sửa Tài Khoản" : "Thêm Tài Khoản"}</h3>
            <input
        type="text"
        placeholder="Full Name"
        className="border p-2 mb-4 w-full"
        value={fullName}  // Sử dụng value thay vì defaultValue
        onChange={(e) => setFullName(e.target.value)}  // Cập nhật state khi nhập liệu
        disabled={!!editingAccount} 
      />
      <input
        type="text"
        placeholder="Mobile Phone"
        className="border p-2 mb-4 w-full"
        value={mobilePhone}  
        onChange={(e) => setMobilePhone(e.target.value)}  
        disabled={!!editingAccount}
      />
      <input
        type="text"
        placeholder="Address"
        className="border p-2 mb-4 w-full"
        value={address}  // Sử dụng value thay vì defaultValue
        onChange={(e) => setAddress(e.target.value)}  // Cập nhật state khi nhập liệu
        disabled={!!editingAccount} 
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-4 w-full"
        value={email}  // Sử dụng value thay vì defaultValue
        onChange={(e) => setEmail(e.target.value)}  // Cập nhật state khi nhập liệu
        disabled={!!editingAccount} 
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-4 w-full"
        value={password}  // Sử dụng value thay vì defaultValue
        onChange={(e) => setPassword(e.target.value)}  // Cập nhật state khi nhập liệu
        disabled={!!editingAccount} 
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 mb-4 w-full"
        value={confirmPassword}  // Sử dụng value thay vì defaultValue
        onChange={(e) => setConfirmPassword(e.target.value)}  // Cập nhật state khi nhập liệu
        disabled={!!editingAccount} 
      />
            <div className="mb-4">
              <label className="block mb-2">Quyền</label>
              <select
                multiple
                value={userRoles}
                onChange={handleRoleChange}
                className="border p-2 w-full"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Hủy</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyTaiKhoan;
