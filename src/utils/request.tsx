import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken as getTokenFromLocalStorage } from "/DoAn2/sua-xe/src/constants";

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
    return getTokenFromLocalStorage();
};

// Tạo một instance axios với các thiết lập mặc định
const request = axios.create({
    baseURL: 'https://localhost:7104/api/',
    headers: {
        'Authorization': getToken() ? `Bearer ${getToken()}` : ''
    },
    withCredentials: true, 
});

// Interceptor để xử lý phản hồi và lỗi
request.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                console.log(status);
                // window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

// Hàm DELETE request
export const remove = async (path: string, options: AxiosRequestConfig = {}): Promise<any> => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.delete(path, { ...options, headers });
    return response.data;
};

// Hàm GET request
export const get = async (path: string, options: AxiosRequestConfig = {}): Promise<any> => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.get(path, { ...options, headers });
    return response.data;
};

// Hàm POST request
export const post = async (path: string, data: any = {}, options: AxiosRequestConfig = {}): Promise<any> => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.post(path, data, { ...options, headers });
    return response.data;
};

// Hàm PUT request
export const put = async (path: string, data: any = {}, options: AxiosRequestConfig = {}): Promise<any> => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.put(path, data, { ...options, headers });
    return response.data;
};

export default request;
