/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";
import { login } from "../auth/Login";

interface LoginState {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (
    navigate: (path: string) => void,
    setPage: (page: string) => void
  ) => Promise<void>;
}

const useLoginStore = create<LoginState>((set) => ({
  email: "",
  password: "",
  loading: false,
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),

  handleLogin: async (navigate, setPage) => {
    set({ loading: true });
    try {
      const { email, password } = useLoginStore.getState();
      const data = await login(email, password);

      if ("error" in data && data.error) {
        toast.error(data.message || "Login failed. Please check your credentials.");
      } else {
        const userRole = data?.data?.user?.role || "jobseeker";
        const userId = data?.data?.user?._id || "null";

        const userData: Record<string, any> = {
          name: data?.data?.user?.username || "Default User",
          role: userRole,
          id: userId,
        };

        // Lưu accessToken và refreshToken
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

// Gọi API để lấy ID tương ứng với vai trò của người dùng
if (userRole === "job_seeker") {
  const jobSeekerResponse = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/job_seekers`,
    {
      params: { page: 1, limit: 10, user_id: userId },
      headers: {
        Authorization: `Bearer ${data.data.accessToken}`,
      },
    }
  );

  const jobSeekers = jobSeekerResponse.data.data.jobSeekers;
  if (jobSeekers && jobSeekers.length > 0) {
    userData.job_seeker_id = jobSeekers[0]._id;
  }
} else if (userRole === "recruiter") {
  // Gọi API tương tự để lấy recruiter_id
  const recruiterResponse = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/recruiters`,
    {
      params: { page: 1, limit: 10, user_id: userId },
      headers: {
        Authorization: `Bearer ${data.data.accessToken}`,
      },
    }
  );

  const recruiters = recruiterResponse.data.data.recruiters;
  console.log(recruiters);
  if (recruiters && recruiters.length > 0) {
    userData.recruiter_id = recruiters[0]._id;
  }
} else if (userRole === "company") {
  // Gọi API tương tự để lấy company_id
  const companyResponse = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
    {
      params: { page: 1, limit: 10, user_id: userId },
      headers: {
        Authorization: `Bearer ${data.data.accessToken}`,
      },
    }
  );

  const companies = companyResponse.data.data.companies;
  if (companies && companies.length > 0) {
    userData.company_id = companies[0]._id;
  }
}


        // Lưu userData đã cập nhật vào localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Login successful!");

        setTimeout(() => {
          let redirectPage;
          
          if (userRole === "job_seeker") {
            redirectPage = "jobseeker/jobs";
          } else if (userRole === "recruiter") {
            redirectPage = "recruiter/postjob";
          } else {
            redirectPage = "dashboard";
          }
        
          setPage(redirectPage);
          navigate(`/${redirectPage}`);
        }, 3000);
        
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useLoginStore;
