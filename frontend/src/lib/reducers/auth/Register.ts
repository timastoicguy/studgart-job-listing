/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd';
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
  profilePicture?: string; // Optional profile picture field
  bio: string;
  companyName?: string;    // Optional for company role
  companySize?: string;    // Optional for company role
  contactEmail?: string;   // Optional for company role
  contactPhone?: string;   // Optional for company role
}

// Hàm xử lý upload ảnh hồ sơ
export const uploadProfilePicture = async (profilePicture: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', profilePicture);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/upload-single`, formData, {
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

// Hàm xóa user
const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`User with ID ${userId} deleted successfully.`);
  } catch (deleteError) {
    console.error(`Failed to delete user with ID ${userId}:`, deleteError);
  }
};
// Hàm xử lý đăng ký
export const register = async (registerData: RegisterData): Promise<any> => {
  let profilePictureUrl = '';

  // Upload ảnh hồ sơ nếu có
  if (registerData.profilePicture) {
    try {
      profilePictureUrl = await uploadProfilePicture(registerData.profilePicture as unknown as File);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unexpected error during profile picture upload:', error);
      }
      throw new Error('Error uploading profile picture');
    }
  }

  const registrationPayload = {
    email: registerData.email,
    password: registerData.password,
    username: registerData.username,
    fullName: registerData.fullName,
    phone: registerData.phone,
    address: registerData.address,
    role: registerData.role,
    bio: registerData.bio,
    profilePicture: profilePictureUrl || undefined,
  };

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, registrationPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Registration response:", response.data);

    const userId = response.data.data.user._id;

    // Xử lý theo từng vai trò
    if (registerData.role === 'recruiter') {
      try {
        const recruiterPayload = {
          user_id: userId,
          status: 'pending',
        };

        const recruiterResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/recruiters`,
          recruiterPayload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("Recruiter registration response:", recruiterResponse.data);
      } catch (recruiterError) {
        console.error('Recruiter registration failed:', recruiterError);
        await deleteUser(userId); // Xóa user nếu vai trò cụ thể bị lỗi
        throw new Error('Recruiter registration failed');
      }
    } else if (registerData.role === 'job_seeker') {
      try {
        const jobSeekerPayload = {
          user_id: userId,
          resume: 'Resume content here',
          experience: '3 years in software development',
          education: "Bachelor's in Computer Science",
          skills: ['JavaScript'], // Tùy chỉnh danh sách kỹ năng
          linkedin_profile: 'https://linkedin.com/in/example',
          portfolio_url: 'https://example.com',
          desired_salary: '50000',
          availability: 'Immediate',
          languages: ['English'],
          certifications: ['Certified Java Developer'],
        };

        const jobSeekerResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/job_seekers`,
          jobSeekerPayload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("Job Seeker registration response:", jobSeekerResponse.data);
      } catch (jobSeekerError) {
        console.error('Job Seeker registration failed:', jobSeekerError);
        await deleteUser(userId); // Xóa user nếu vai trò cụ thể bị lỗi
        throw new Error('Job Seeker registration failed');
      }
    }
    else if (registerData.role === 'company') {
      try {
        const companyPayload = {
          user_id: userId,
          company_name: registerData.companyName, // Include company-specific fields
          company_size: registerData.companySize,
          contact_email: registerData.contactEmail,
          contact_phone: registerData.contactPhone,
          address: registerData.address,
          status: 'pending', // Example field to track approval process
        };
    
        const companyResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
          companyPayload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        console.log("Company registration response:", companyResponse.data);
      } catch (companyError) {
        console.error('Company registration failed:', companyError);
        await deleteUser(userId); // Xóa user nếu vai trò cụ thể bị lỗi
        throw new Error('Company registration failed');
      }
    }
    

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Registration error:', error.response?.data || error.message);
      notification.error({
        message: `${error.message}`,
        description: `${error.response?.data.error}`,
        placement: 'bottomRight',
      });
    } else {
      console.error('Unexpected error during registration:', error);
    }
    throw new Error('Registration failed');
  }
};
