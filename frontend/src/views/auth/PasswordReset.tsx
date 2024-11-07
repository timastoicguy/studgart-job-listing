import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { passwordReset } from '../../lib/reducers/auth/PasswordReset'; // Import the passwordReset function

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to handle password reset using the imported function
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await passwordReset(email);
      toast.success("Reset link sent to your email!");
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
        <div className="flex justify-start w-full mb-4">
          <button
            className="text-gray-500 text-2xl"
            onClick={() => navigate("/login")}
          >
            &larr;
          </button>
        </div>
        <img
          className="h-[50px] mb-4"
          src="/images/FPT_Logo.svg"
          alt="FPT Logo"
        />
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <div className="mb-4 w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Username or primary email
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaEnvelope className="ml-3 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Username or primary email"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
          onClick={handlePasswordReset}
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 animate-spin" />}
          {loading ? "Sending..." : "Send to Email"}
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
