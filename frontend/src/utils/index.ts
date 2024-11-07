/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from 'crypto-js';

// Kiểm tra email hợp lệ
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Định dạng ngày tháng
export const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

// Lấy giá trị từ localStorage với thời gian hết hạn
export const getItemWithExpiry = <T>(key: string): T | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    // So sánh thời gian hết hạn
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
};

// Lưu giá trị vào localStorage với thời gian hết hạn
// src/utils/index.ts

export const setItemWithExpiry = (key: string, value: any, expiryInMinutes: number) => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000, // tính toán thời gian hết hạn
    };
    localStorage.setItem(key, JSON.stringify(item));
  };
  

// Sinh số ngẫu nhiên trong khoảng [min, max]
export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Chuyển đổi chuỗi thành số
export const parseNumber = (value: string): number => {
    const parsedValue = Number(value);
    return isNaN(parsedValue) ? 0 : parsedValue; // trả về 0 nếu không phải số
};

// Hàm lọc một mảng theo điều kiện
export const filterArray = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
    return array.filter(predicate);
};

// Hàm giải mã dữ liệu (ví dụ sử dụng AES)
export const decryptData = (cipherText: string, key: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
};
