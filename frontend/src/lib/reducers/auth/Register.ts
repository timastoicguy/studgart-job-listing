/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho đăng ký người dùng
interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  profilePicture?: string; // Thay đổi kiểu thành string
  bio: string;
}

// Hàm xử lý upload ảnh hồ sơ
export const uploadProfilePicture = async (profilePicture: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', profilePicture);

  try {
    const response = await axios.post('http://localhost:3000/api/upload/upload-single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Uploaded Profile Picture URL:", response.data.url);
    return response.data.url; // Trả về URL của file đã upload
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('File upload error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Profile picture upload failed');
  }
};

// Hàm xử lý đăng ký
export const register = async (registerData: RegisterData): Promise<any> => {
  let profilePictureUrl = '';

  // Upload ảnh hồ sơ nếu có
  if (registerData.profilePicture) {
    try {
      // Gọi hàm upload và nhận URL của ảnh hồ sơ đã upload
      profilePictureUrl = await uploadProfilePicture(registerData.profilePicture as unknown as File);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Log lỗi nếu upload không thành công
      } else {
        console.error('Unexpected error during profile picture upload:', error);
      }
      throw new Error('Error uploading profile picture');
    }
  }

  // Chuẩn bị payload cho đăng ký
  const registrationPayload = {
    email: registerData.email,
    password: registerData.password,
    username: registerData.username,
    fullName: registerData.fullName,
    phone: registerData.phone,
    address: registerData.address,
    role: registerData.role,
    bio: registerData.bio,
    profilePicture: profilePictureUrl || undefined, // Thêm URL ảnh hồ sơ đã upload hoặc undefined nếu không có
  };

  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', registrationPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Trả về dữ liệu phản hồi
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Registration error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error during registration:', error);
    }
    throw new Error('Registration failed');
  }
};
