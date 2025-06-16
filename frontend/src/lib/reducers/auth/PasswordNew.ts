// PasswordNew.ts (logic)
import axios from "axios";

export const passwordNew = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`,
      {
        newPassword: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error message extraction
      throw error.response?.data?.message || "Có lỗi xảy ra.";
    } else {
      // General error handling
      throw new Error("An unexpected error occurred.");
    }
  }
};
