/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

// Cấu hình API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/auth/", // Thay bằng URL API của bạn
});

// Interceptor để xử lý lỗi 401 (hết hạn phiên)
apiClient.interceptors.response.use(
  (response) => {
    return response},
  (error) => {
    console.log(error);
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Tạo store zustand
interface AuthStore {
  email: string;
  password: string;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userData: any | null;
  isAuthenticated: boolean;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserData: (userData: any) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
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
    });
    toast.info("Bạn đã đăng xuất.");
  },

  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    if (token && !get().isAuthenticated) {
      console.log(token)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ accessToken: token, isAuthenticated: true });
        get().fetchCurrentUser();
    } else if (!token) {
        set({ accessToken: null, isAuthenticated: false, userData: null });
    }
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
      console.log(apiClient);
        const response = await apiClient.get('/current-user');
        set({ userData: response.data?.data?.user });
    } catch (error) {
        console.error('Fetch user error:', error);
        get().logout();
    }
},
}));

export default useAuthStore;
