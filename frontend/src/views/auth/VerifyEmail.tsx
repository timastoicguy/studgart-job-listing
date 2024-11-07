/* eslint-disable @typescript-eslint/no-unused-vars */
// VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get token from URL
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    const verifyEmail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/verify/${token}`);
        if (response.status === 200) {
          setVerified(true);
          toast.success("Email verified successfully!");
          localStorage.removeItem("userEmail");
        }
      } catch (error) {
        toast.error("Verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem("userEmail"); // Get email from local storage
      if (!userEmail) {
        toast.error("Email not found. Please register again.");
        return;
      }
      const response = await axios.post('http://localhost:3000/api/auth/resend-verification', { email: userEmail });
      if (response.status === 200) {
        toast.success("Verification email resent successfully!");
      }
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">Welcome to STUDGART</h1>
        <p className="mt-4">
          {loading ? "Verifying your email..." : verified ? "Your email has been verified!" : "Verification in progress..."}
        </p>
        {!loading && verified && (
          <p className="mt-4">
            Thank you for verifying your email address. You can now log in to your account.
          </p>
        )}
        {!loading && !verified && (
          <div className="mt-6">
            <button
              onClick={resendVerificationEmail}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none"
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
