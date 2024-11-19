import axios from "axios";

export const sendNotification = async (
  userId: string,
  type: string,
  content: string
) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, {
      userId,
      type,
      content,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
