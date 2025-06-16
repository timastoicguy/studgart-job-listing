import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../../lib/reducers/auth/Register";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import JobSeekerRegistrationFields from "./JobSeekerRegistrationFields";
import CompanyRegistrationFields from "./CompanyRegistrationFields";
import JobPosterRegistrationFields from "./JobPosterRegistrationFields";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>(""); // New state for address
  const [bio, setBio] = useState<string>(""); // New state for bio
  const [companyName, setCompanyName] = useState<string>(""); // State for company name
  const [companySize, setCompanySize] = useState<string>(""); // State for company size
  const [contactEmail, setContactEmail] = useState<string>(""); // State for contact email
  const [contactPhone, setContactPhone] = useState<string>(""); // State for contact phone
  const [role, setRole] = useState<string>("job_seeker"); // Default to job_seeker
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const registerData = {
        email,
        password,
        role,
        username,
        fullName,
        phone,
        address, // Include address
        bio, // Include bio
        companyName, // Include company name
        companySize, // Include company size
        contactEmail, // Include contact email
        contactPhone, // Include contact phone
      };
      console.log("Data being sent:", registerData);
      const response = await register(registerData);
      toast.success("Đăng ký thành công!");
      localStorage.setItem("userEmail", email);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      console.log("Registration response:", response);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
        toast.error("Có lỗi xảy ra khi đăng ký.");
      } else {
        console.error("Unexpected error during registration:", error);
        toast.error("Có một lỗi không mong muốn đang xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <img className="" src="..\public\images\logo.png" alt="STUDGART Logo" />
          <h2 className="text-2xl font-bold text-green-500">STUDGART</h2>
        </div>

        <Tabs defaultValue="job_seeker" onValueChange={setRole}>
          <TabsList>
            <TabsTrigger value="job_seeker">Người tìm việc</TabsTrigger>
            <TabsTrigger value="company">Công ty</TabsTrigger>
            <TabsTrigger value="recruiter">Nhà Tuyển Dụng</TabsTrigger>
          </TabsList>

          <TabsContent value="job_seeker">
            <JobSeekerRegistrationFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rePassword={rePassword}
              setRePassword={setRePassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="company">
            <CompanyRegistrationFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rePassword={rePassword}
              setRePassword={setRePassword}
              username={username}
              setUsername={setUsername}
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              bio={bio}
              setBio={setBio}
              companyName={companyName}
              setCompanyName={setCompanyName}
              companySize={companySize}
              setCompanySize={setCompanySize}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="recruiter">
            <JobPosterRegistrationFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rePassword={rePassword}
              setRePassword={setRePassword}
              username={username}
              setUsername={setUsername}
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              bio={bio}
              setBio={setBio}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
            />
          </TabsContent>
        </Tabs>

        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 animate-spin" />}
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <div className="text-center mt-4">
          Bạn đã có tài khoản ?{" "}
          <Link
            to="/login"
            className="font-bold text-sm text-green-600 hover:text-green-800"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
