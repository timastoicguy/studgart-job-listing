/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface AuthStore {
  email: string;
  password: string;
  loading: boolean;
  accessToken: string | null; // Add accessToken to the state
  refreshToken: string | null; // Add refreshToken to the state
  userData: any | null; // Add userData to the state
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserData: (userData: any) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  email: "",
  password: "",
  loading: false,
  accessToken: null, // Initialize accessToken
  refreshToken: null, // Initialize refreshToken
  userData: null, // Initialize userData
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoading: (loading) => set({ loading }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setUserData: (userData) => set({ userData }),
})
);


export default useAuthStore;
