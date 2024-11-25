import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import * as request from "../utils/request";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await request.post("/auth/login", {
        userName: email,
        password: password,
      });

      const { token, user } = response;

      setToken(token, { username: user.username, email: user.email });
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      console.error("Đăng nhập thất bại:", error.response?.data || error.message);
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
