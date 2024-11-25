// Hàm lưu trữ một mục với thời gian hết hạn

interface TokenData {
    value:string;
    expiry: number;
}

export const setItemWithExpiry = (key: string, value: any, ttl: number): void => {
    const now = new Date();
  
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

// Hàm lưu token với thời gian hết hạn
export const setTokenWithExpiry = (value: string, ttl: number): void => {
    const now = new Date();
  
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem('token', JSON.stringify(item));
};

// Hàm lấy token và kiểm tra thời gian hết hạn
export const getTokenWithExpiry = (): string | null => {
    const itemStr = localStorage.getItem('token');
    
    if (!itemStr) {
        return null;
    }

    // Ép kiểu itemStr thành JSON với kiểu đã định nghĩa
    const item: TokenData = JSON.parse(itemStr) as TokenData;
    const now = new Date();
   
    if (now.getTime() > item.expiry) {
        localStorage.removeItem('token');
        return null;
    }

    return item.value;
};

// Hàm xóa token
export const removeToken = (): void => {
    localStorage.removeItem('token');
};
