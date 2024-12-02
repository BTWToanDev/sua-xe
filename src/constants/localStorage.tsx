export const setItemWithExpiry = (key: string, value: any, ttl: string): void => {
    const now = new Date();
  
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

// Hàm lưu token với thời gian hết hạn
export const setTokenWithExpiry = (value: string, ttl: string): void => {
    const now = new Date();
  
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem('token', value);
    localStorage.setItem('expire',ttl);
};

// Hàm lấy token và kiểm tra thời gian hết hạn
export const getTokenWithExpiry = (): string | null => {
    const token = localStorage.getItem('token');
    const expiryStr = localStorage.getItem('expire');

    if (!token || !expiryStr) {
        console.log('Không tìm thấy token hoặc expire.');
        return null; // Không có token hoặc expiry
    }

    // Chuyển expiry sang số nguyên
    const expiryTime = new Date(expiryStr);
   

   

    const now = new Date();

    // Kiểm tra nếu ngày hết hạn đã qua
    if (now > expiryTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('expire');
        return null; // Token hết hạn
    }

    return token; // Trả về token nếu còn hiệu lực
};

// Hàm xóa token
export const removeToken = (): void => {
    localStorage.removeItem('token');
}; 