/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd';
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

export const postJob = async (jobData: JobData, userId: string): Promise<any> => {
  try {

    console.log(userId)
    // Fetch the user's diamond status
    const respons1 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payments/check-diamonds/${userId}`);
    
    // Check if diamonds are greater than or equal to 2
    if (respons1.data.diamonds < 2) {
      throw new Error('Not enough diamonds');
    }

    // If diamonds are sufficient, call the payment API
    const requiredDiamonds = 2; // The amount of diamonds required for posting a job
    const paymentResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payments/pay-diamond`, {
      userId,
      requiredDiamonds,
      description: 'Payment for premium feature'
    });

    // Handle payment response
    if (paymentResponse.data.data) {
      console.log('Payment successful:', paymentResponse.data);
      notification.success({
        message: 'Trạng thái thanh toán',
        description: `Bạn đã thanh toán thành công`, // Mô tả thông báo
        placement: 'topRight', // Vị trí hiển thị
      });
      // Proceed to post the job after successful payment
      const jobResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, jobData);
      console.log("Job posted successfully:", jobResponse.data);
      return jobResponse.data;
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    console.error("Error posting job:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error data:", error.response?.data);
    }
    throw error; 
  }
};
