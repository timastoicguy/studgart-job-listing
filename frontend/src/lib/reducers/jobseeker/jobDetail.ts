// frontend/src/lib/reducers/jobseeker/joDetail.ts
import axios from 'axios';

export interface Company {
  _id: string;
  user_id: string;
  company_size: string;
  company_name: string;  // Use 'company_name' instead of 'name' to match the API
  contact_email: string;
  contact_phone: string;
  company_address: string;
  tax_number: string;
  logo?: string; // Add the logo property, making it optional
  industry?: string; // Add the industry property, making it optional
  nationality?: string; // Add the nationality property, making it optional
  __v: number;
}

export interface JobData {
  title: string;
  salaryRange: { min: number; max: number };
  currency: string; // Make sure to add this field if it's expected
  deadline: string;  // Add this field if it's expected
  description: string;
  requirements: string[];
  benefits: string[];
  location: { name: string; code: string }[]; // Updated to reflect the API response
  company: Company;  // Update to include the entire Company interface
}

// Hàm lấy dữ liệu công việc từ API
export const fetchDetailJobData = async (jobId: string): Promise<JobData | null> => {
  try {
    const response = await axios.get<{ data: JobData }>(`http://localhost:3000/api/jobs/${jobId}`);
    console.log(response.data);
    return response.data.data; // Assuming data is nested within response
  } catch (error) {
    console.error("Error fetching job data:", error);
    return null;
  }
};

// Hàm gửi thông tin ứng tuyển
export const applyForJob = async (jobId: string, applicantData: {
  name: string;
  email: string;
  resume: File; // Giả sử bạn gửi hồ sơ ứng viên dưới dạng file
  coverLetter?: string; // Thư xin việc là tùy chọn
}): Promise<void> => {
  const formData = new FormData();
  formData.append('name', applicantData.name);
  formData.append('email', applicantData.email);
  formData.append('resume', applicantData.resume);
  if (applicantData.coverLetter) {
    formData.append('coverLetter', applicantData.coverLetter);
  }

  try {
    await axios.post(`http://localhost:3000/api/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Application submitted successfully.");
  } catch (error) {
    console.error("Error submitting application:", error);
  }
};
