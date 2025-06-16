// PasswordReset.ts
import axios from 'axios';

export const passwordReset = async (email: string): Promise<void> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, {
      email: email,
    });

    if (response.status === 200) {
      console.log("Reset link sent to your email.");
      return Promise.resolve();
    } else {
      console.error("Failed to send reset email.");
      return Promise.reject("Failed to send reset email.");
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return Promise.reject("An error occurred. Please try again.");
  }
};
