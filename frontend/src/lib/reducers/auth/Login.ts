import axios from 'axios';

export const login = async (email: string, password: string) => {
  const loginData = {
    email,
    password,
  };
  console.log('Login data:', `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`);

  try {

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Trả về dữ liệu từ response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error('Login failed'); // Bạn có thể tùy chỉnh thông báo lỗi nếu cần
  }
};
