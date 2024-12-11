/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

// Cấu hình API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/auth/", // Thay bằng URL API của bạn
});
const apiUser = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/", // Thay bằng URL API của bạn
});

// Interceptor để xử lý lỗi 401 (hết hạn phiên)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Tạo store zustand
interface UserRoleIDs {
  job_seeker_id?: string;
  recruiter_id?: string;
  company_id?: string;
}

interface AuthStore {
  email: string;
  password: string;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userData: any | null;
  roleIDs: UserRoleIDs | null;
  isAuthenticated: boolean;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserData: (userData: any) => void;
  setRoleIDs: (roleIDs: UserRoleIDs) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth1: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  email: "",
  password: "",
  loading: false,
  accessToken: null,
  refreshToken: null,
  userData: null,
  roleIDs: null,
  isAuthenticated: false,

  // Actions
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoading: (loading) => set({ loading }),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  setUserData: (userData) => set({ userData }),
  setRoleIDs: (roleIDs) => set({ roleIDs }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await apiClient.post("/login", { email, password });
      const { accessToken, refreshToken } = response.data.data;
      get().setTokens(accessToken, refreshToken);

      toast.success("Đăng nhập thành công! Chào mừng bạn trở lại.");
      await get().fetchCurrentUser();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      set({ isAuthenticated: false, userData: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    apiClient.defaults.headers.common["Authorization"] = "";
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      userData: null,
      roleIDs: null,
    });
    toast.info("Bạn đã đăng xuất.");
  },

  checkAuth1: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ accessToken: token, isAuthenticated: true });
      get().fetchCurrentUser();
    } else if (!token) {
      set({ accessToken: null, isAuthenticated: false, userData: null });
    }
  },
  fetchCurrentUser: async () => {
    try {
      const response = await apiClient.get("/current-user");
      const user = response.data?.data?.user;
  
      // Make sure user is available
      if (!user) {
        throw new Error("User data is missing.");
      }
  
      set({ userData: user });
  
      // Check and fetch role-specific IDs (job_seeker, recruiter, company)
      const roleIDs: UserRoleIDs = {};
      const accessToken = get().accessToken;
  
      if (user.role === "job_seeker") {
        const jobSeekerResponse = await apiUser.get(`/job_seekers?user_id=${user._id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        roleIDs.job_seeker_id = jobSeekerResponse.data?.data?.jobSeekers[0]?._id;
      } else if (user.role === "recruiter") {
        const recruiterResponse = await apiUser.get("/recruiters", {
          params: { user_id: user._id },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        roleIDs.recruiter_id = recruiterResponse.data?.data[0]?._id;
      } else if (user.role === "company") {
        const companyResponse = await apiUser.get("/companies", {
          params: { user_id: user._id },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        roleIDs.company_id = companyResponse.data?.data?.docs.find(
          (company: any) => company.user_id === user._id
        )?._id;
      }
  
      // Set the role IDs in the store
      get().setRoleIDs(roleIDs);
      console.log("Role:", roleIDs);
      
    } catch (error) {
      console.error("Fetch user error:", error);
      get().logout();
    }
  },
  
}));

export default useAuthStore;
