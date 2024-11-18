import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getUserIdFromLocalStorage = (): string | null => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.id || null; // Return user ID or null if not found
    }
    return null; // Return null if no userData in localStorage
  };

const PaymentRedirect = () => {
    
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy query params từ URL hiện tại
    const searchParams = new URLSearchParams(window.location.search);
    const customId = getUserIdFromLocalStorage(); // ID bạn muốn thêm

    // Chuyển hướng sang URL mới với customId và giữ nguyên query params
    navigate(`/payment/${customId}?${searchParams.toString()}`, { replace: true });
  }, [navigate]);

  return <div>Đang xử lý...</div>;
};

export default PaymentRedirect;
