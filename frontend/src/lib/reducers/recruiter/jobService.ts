/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd';
import axios from 'axios';

export interface JobData {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  isUrgent?: boolean;
  benefits: string[];
  location: { name: string; code: string }[];
  salaryRange: { min: number; max: number };
  company?: any;
  jobCategory: string;
  recruiter: string;
  technologies: { name: string; code: string }[];
  employmentType: { name: string; code: string }[];
  experienceLevel: { name: string; code: string }[];
  applicationDeadline: Date;
}

export const postJob = async (jobData: JobData, company: any, userId: string): Promise<any> => {
  try {
    console.log("Company Data:", company);
    console.log("User ID:", userId);

    const requiredDiamonds = 2; // Số diamonds yêu cầu để đăng tin

    // Trường hợp company == null, thực hiện logic cho tài khoản cá nhân
    if (!company) {
      const response1 = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/check-diamonds/${userId}`
      );

      if (response1.data.data.diamonds+response1.data.data.freeDiamonds < requiredDiamonds) {
        throw new Error('Not enough diamonds');
      }

      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/pay-diamond`,
        {
          userId,
          requiredDiamonds,
          description: 'Payment for premium feature',
        }
      );

      if (!paymentResponse.data.data) {
        throw new Error('Payment failed');
      }
    } 
    // Trường hợp company khác null, kiểm tra và trừ tiền từ tài khoản công ty
    else {

      const companyResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/companies/${company}`
      );

      const companyUserId = companyResponse.data.data.user_id._id;
      console.log("Company User ID:", companyUserId);
      if (!companyUserId) {
        throw new Error('Company userId not found');
      }


      const response2 = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/check-diamonds/${companyUserId}`
      );
      console.log(response2.data.data); // Log lỗi khi kiểm tra tại khoa
      if (response2.data.data.diamonds+response2.data.data.freeDiamonds < requiredDiamonds) {

        notification.error({
          message: 'Đăng tin không thành công',
          description: `Số diamonds của công ty bạn không đủ để đăng tin!`,
          placement: 'topRight',
        });
        
      }

      const companyPaymentResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/pay-diamond`,
        {
          userId: companyUserId,
          requiredDiamonds,
          description: 'Payment for premium feature',
        }
      );

      if (!companyPaymentResponse.data.data) {
        throw new Error('Company payment failed');
      }
    }

    // Tiến hành đăng tin sau khi thanh toán thành công
    const jobResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, jobData);
    console.log("Job posted successfully:", jobResponse.data);
    notification.success({
      message: 'Trạng thái đăng tin',
      description: `Tin tuyển dụng của bạn đã được đăng thành công!`,
      placement: 'topRight',
    });
    return jobResponse.data;
  } catch (error) {
    console.error("Error posting job:", error);
  }
};

