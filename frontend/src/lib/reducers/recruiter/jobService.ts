/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export interface JobData {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  location: { name: string; code: string }[];
  salaryRange: { min: number; max: number };
  company: string;
  jobCategory: string;
  recruiter: string;
  technologies: { name: string; code: string }[];
  employmentType: { name: string; code: string }[];
  experienceLevel: { name: string; code: string }[];
  applicationDeadline: Date;
}

export const postJob = async (jobData: JobData): Promise<any> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, jobData);
    console.log("Job posted successfully:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error posting job:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error data:", error.response?.data);
    }
    throw error; 
  }
};
