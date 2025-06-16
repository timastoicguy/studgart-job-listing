// PasswordNew.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { passwordNew } from "../../lib/reducers/auth/PasswordNew"; // Import the passwordNew function

const PasswordNew: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    try {
      await passwordNew(token as string, password);
      toast.success("Mật khẩu thay đổi thành công!");

      // Redirect to login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Adding a 2-second delay before redirecting
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-sm flex flex-col items-center">
        <img className="h-[50px] mb-4" src="/images/logo.png" alt="FPT Logo" />
        <h2 className="text-2xl font-bold mb-6">Tạo mới mật khẩu</h2>
        <div className="mb-4 w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Mật khẩu mới
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaLock className="ml-3 text-gray-400" />
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu mới của bạn"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirm-password"
          >
            Nhập lại mật khẩu
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaLock className="ml-3 text-gray-400" />
            <input
              type="password"
              id="confirm-password"
              placeholder="Nhập lại mật khẩu"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
          onClick={handlePasswordChange}
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 animate-spin" />}
          {loading ? "Đang tạo..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
};

export default PasswordNew;
