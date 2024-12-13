// store/authStore.js
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner'
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API + "/api/auth/", // Đổi thành URL API của bạn
});

// Thiết lập interceptor để kiểm tra lỗi 401 (hết hạn phiên đăng nhập)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

const useAuthStore = create((set, get) => ({
    token: null,
    isAuthenticated: false,
    user: null,

    login: async (email, password) => {
        try {
            const response = await apiClient.post('/login', { email, password });
            const { accessToken, refreshToken } = response.data.data;
            console.log('Login successful:', response);

            // Lưu token vào local storage và thiết lập trạng thái
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            set({ token: accessToken, isAuthenticated: true });
            toast.success("Đăng nhập thành công! Chào mừng bạn trở lại.");
            // Gọi fetchCurrentUser sau khi đăng nhập
            get().fetchCurrentUser();
        } catch (error) {
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
            console.error('Login error:', error);
            set({ token: null, isAuthenticated: false, user: null });
        }
    },

    logout: () => {
        set({ token: null, isAuthenticated: false, user: null });
        apiClient.defaults.headers.common['Authorization'] = '';
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    checkAuth: () => {
        const token = localStorage.getItem('accessToken');
        if (token && !get().isAuthenticated) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            set({ token, isAuthenticated: true });
            get().fetchCurrentUser();
        } else if (!token) {
            set({ token: null, isAuthenticated: false, user: null });
        }
    },

    fetchCurrentUser: async () => {
        try {
            const response = await apiClient.get('/current-user');
            set({ user: response.data?.data?.user });
        } catch (error) {
            console.error('Fetch user error:', error);
            get().logout();
        }
    },
}));

export default useAuthStore;
