/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "@/store/auth/useAuthStore";
import handleLogin from "@/lib/reducers/auth/handleLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const { setLoading, loading, login } = useAuthStore();

  const onLogin = async () => {
    console.log("Login clicked", email, password);
    if (!email || !password) {

      toast.error("Please fill in all fields.");
      await login(email, password);
      return;
    }
    await handleLogin(email, password, navigate, (path: string) => {
      console.log("Navigated to:", path);
    });
  };

  const handleGoogleLogin = () => {
    console.log("Google Login clicked");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-4xl flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-500">STUDGART</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2"> Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaEnvelope className="ml-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                className="w-full py-2 px-3 text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaLock className="ml-3 text-gray-400" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full py-2 px-3 text-gray-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="mr-3"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            onClick={onLogin}
            className={`w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Đăng nhập"}
          </button>
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center mt-4"
          >
            <FaGoogle className="mr-2" />
            Đăng nhập với Google
          </button>
          <div className="mb-4 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-green-500 font-bold hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 mt-6 sm:mt-0">
          <img
            src="/images/Right_Side_Image.webp"
            alt="Illustration"
            className="hidden sm:block h-full w-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
