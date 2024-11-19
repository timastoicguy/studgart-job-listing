import axios from "axios";

export const sendNotification = async (userId: string, type: string, content: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications`,
        {
          userId,
          type,
          content,
        }
      );
  
      if (response.status === 200) {
        console.log("Notification sent successfully");
      } else {
        console.error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  