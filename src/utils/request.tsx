import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken as getTokenFromLocalStorage } from "/DoAn2/sua-xe/src/constants";
import {getTokenWithExpiry} from '../constants/localStorage'
// Hàm lấy token từ localStorage
const getToken = (): string | null => {
    console.log(getTokenWithExpiry());
    return  getTokenWithExpiry();
    
};

// Tạo một instance axios với các thiết lập mặc định
const request = axios.create({
    baseURL: 'http://26.139.159.129:5000/api/',
    headers: {
        
        'Authorization':  getTokenWithExpiry() ? `Bearer ${ getTokenWithExpiry()}` : ''
    },
    withCredentials: true, 
    
});

// Interceptor để xử lý phản hồi và lỗi
request.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.message || 'Có lỗi xảy ra.';

            // Log error để xử lý khi bị 401 hoặc 403
            if (status === 401 || status === 403) {
                window.location.href = '/login';
            }

            // Thêm thông báo lỗi từ API
            return Promise.reject({
                status: status,
                message: errorMessage,
                data: error.response.data,
            });
        }

        // Xử lý khi không có response
        return Promise.reject({
            status: 500,
            message: 'Không thể kết nối đến server.',
        });
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
