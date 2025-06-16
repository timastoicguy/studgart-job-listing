/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import useAuthStore from "@/store/auth/useAuthStore";

type UserRole = "job_seeker" | "recruiter" | "company" | "admin";

const handleLogin = async (
  email: string,
  password: string,
  navigate: (path: string) => void,
  setPage: (page: string) => void
) => {
  try {
    // Wait for login to complete and user data to be fetched
    await useAuthStore.getState().login(email, password);

    const userData = useAuthStore.getState().userData;
    const userRole: UserRole | undefined = userData?.role;

    // Ensure user role is set before trying to use it
    if (!userRole) {
      throw new Error(
        "User role is undefined. Unable to determine redirection path."
      );
    }

    const roleRedirectPath: Record<UserRole, string> = {
      job_seeker: "/jobseeker/jobs",
      recruiter: "/recruiter/postjob",
      company: "/company/companyidentity",
      admin: "/admin/dashboard",
    };

    const redirectPath = roleRedirectPath[userRole];
    setPage(redirectPath);
    navigate(redirectPath);
  } catch (error: any) {
    console.error("Login error:", error.message || error);
    toast.error("Đăng nhập thất bại, vui lòng kiểm tra lại thống tin.");
  }
};

export default handleLogin;
