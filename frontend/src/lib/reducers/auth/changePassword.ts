// PasswordNew.ts (logic)
import axios from "axios";

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  userID: string
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password/`,
      {
        oldPassword: oldPassword,
        userID: userID,
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
