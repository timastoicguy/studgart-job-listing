/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "@/store/auth/useAuthStore";

type UserRole = "job_seeker" | "recruiter" | "company" | "admin";

interface UserData {
  name: string;
  role: UserRole;
  id: string;
  job_seeker_id?: string;
  recruiter_id?: string;
  company_id?: string;
}

const handleLogin = async (
  email: string,
  password: string,
  navigate: (path: string) => void,
  setPage: (page: string) => void
) => {
  const authStore = useAuthStore.getState();
  authStore.setLoading(true);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });


    if (!response.data) {
      toast.error("Login failed. Please check your credentials.");
      return;
    }


    const userRole: UserRole = response?.data.data?.user?.role || "job_seeker";
    const userId = response?.data.data?.user?._id || "null";

    const accessToken = response.data.data.accessToken;
    const refreshToken = response.data.data.refreshToken;

    authStore.setTokens(accessToken, refreshToken);


    const userData: UserData = {
      name: response?.data.data?.user?.username || "Default User",
      role: userRole,
      id: userId,
    };
    console.log("User Data: ", userData);

    if (userRole === "job_seeker") {
      const jobSeekerResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/job_seekers`,
        { params: { user_id: userId }, headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Recuiter Response",jobSeekerResponse);

      userData.job_seeker_id = jobSeekerResponse.data?.data?.jobSeekers[0]?._id;
    } else if (userRole === "recruiter") {
      const recruiterResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recruiters`,
        { params: { user_id: userId }, headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Recuiter Response",recruiterResponse);
      userData.recruiter_id = recruiterResponse.data?.data[0]?._id;
    } else if (userRole === "company") {
      const companyResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      userData.company_id = companyResponse.data?.data?.docs.find(
        (company: any) => company.user_id === userId
      )?._id;
    }

    authStore.setUserData(userData);

    const roleRedirectPath: Record<UserRole, string> = {
      job_seeker: "/jobseeker/jobs",
      recruiter: "/recruiter/postjob",
      company: "/company/companyidentity",
      admin: "/admin/accountall",
    };

    const redirectPath = roleRedirectPath[userRole] || "/login";
    setPage(redirectPath);
    navigate(redirectPath);
  } catch (error) {
    toast.error("Login failed. Please try again.");
  } finally {
    authStore.setLoading(false);
  }
};

export default handleLogin;
