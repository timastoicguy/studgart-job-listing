// frontend/src/lib/reducers/jobseeker/joDetail.ts
import axios from 'axios';

export interface Company {
  _id: string;
  user_id: string;
  company_size: string;
  company_name: string; // Use 'company_name' instead of 'name' to match the API
  contact_email: string;
  contact_phone: string;
  company_address: string;
  tax_number: string;
  logo?: string; // Add the logo property, making it optional
  industry?: string; // Add the industry property, making it optional
  nationality?: string; // Add the nationality property, making it optional
  __v: number;
}

export interface User {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

export interface JobData {
  title: string;
  salaryRange: { min: number; max: number };
  currency: string; // Make sure to add this field if it's expected
  applicationDeadline: string; // Add this field if it's expected
  description: string;
  requirements: string[];
  benefits: string[];
  location: { name: string; code: string }[]; // Updated to reflect the API response
  company: Company; // Update to include the entire Company interface
}

// Function to fetch job details
export const fetchDetailJobData = async (jobId: string): Promise<JobData | null> => {
  try {
    const response = await axios.get<{ data: JobData }>(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}`);
    console.log("Job Data Response: ", response.data);
    return response.data.data; // Assuming data is nested within response
  } catch (error) {
    console.error("Error fetching job data:", error);
    return null;
  }
};

// Function to fetch user data based on user_id
export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get<{ data: User }>(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`);
    console.log("User Data Response: ", response.data);
    return response.data.data; // Assuming data is nested within response
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Function to submit a job application
export const applyForJob = async (jobId: string, applicantData: {
  name: string;
  email: string;
  resume: File; // Assuming the resume is sent as a file
  coverLetter?: string; // Cover letter is optional
}): Promise<void> => {
  const formData = new FormData();
  formData.append('name', applicantData.name);
  formData.append('email', applicantData.email);
  formData.append('resume', applicantData.resume);
  if (applicantData.coverLetter) {
    formData.append('coverLetter', applicantData.coverLetter);
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Application submitted successfully.");
  } catch (error) {
    console.error("Error submitting application:", error);
  }
};
