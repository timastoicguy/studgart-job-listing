/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { toast } from 'react-toastify';
import { login } from '../auth/Login';

interface LoginState {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (navigate: (path: string) => void, setPage: (page: string) => void) => Promise<void>;
}

const useLoginStore = create<LoginState>((set) => ({
  email: '',
  password: '',
  loading: false,
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),

  handleLogin: async (navigate, setPage) => {
    set({ loading: true });

    try {
      const { email, password } = useLoginStore.getState();
      const data = await login(email, password);
      if ('error' in data && data.error) {
        toast.error(data.message || "Login failed. Please check your credentials.");
      } else {
        const userData = {
          name: data?.data?.user?.username || "Default User",
          role: data?.data?.user?.role || "jobseeker",
          id: data?.data?.user?._id || "null"
        };
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        toast.success("Login successful!");

        setTimeout(() => {
          setPage('about');
          navigate('/about');
        }, 5000);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      set({ loading: false });
    }
  }
}));

export default useLoginStore;
