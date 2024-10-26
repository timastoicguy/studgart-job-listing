import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from '../../lib/reducers/auth/Register';
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
  const [address, setAddress] = useState<string>("");  // New state for address
  const [bio, setBio] = useState<string>("");          // New state for bio
  const [role, setRole] = useState<string>("job_seeker");
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
        address,   // Include address
        bio        // Include bio
      };
      console.log("Data being sent:", registerData);
      const response = await register(registerData);
      toast.success("Registration successful!");
      localStorage.setItem("userEmail", email);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      console.log("Registration response:", response);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
        toast.error("Error during registration.");
      } else {
        console.error("Unexpected error during registration:", error);
        toast.error("An unexpected error occurred.");
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
          <img className="h-[50px]" src="/images/FPT_Logo.svg" alt="FPT Logo" />
          <h2 className="text-2xl font-bold">STUDGART</h2>
        </div>

        <Tabs defaultValue="job_seeker">
          <TabsList>
            <TabsTrigger value="job_seeker" onClick={() => setRole("job_seeker")}>
              Người tìm việc
            </TabsTrigger>
            <TabsTrigger value="company" onClick={() => setRole("company")}>
              Công ty
            </TabsTrigger>
            <TabsTrigger value="job_poster" onClick={() => setRole("job_poster")}>
              Nhà Tuyển Dụng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="job_seeker">
            <JobSeekerRegistrationFields 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rePassword={rePassword}
              setRePassword={setRePassword}
              address={address}           // Pass address
              setAddress={setAddress}     // Pass setter for address
              bio={bio}                   // Pass bio
              setBio={setBio}             // Pass setter for bio
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
              address={address}           // Pass address
              setAddress={setAddress}     // Pass setter for address
              bio={bio}                   // Pass bio
              setBio={setBio}             // Pass setter for bio
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="job_poster">
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
              address={address}           // Pass address
              setAddress={setAddress}     // Pass setter for address
              bio={bio}                   // Pass bio
              setBio={setBio}             // Pass setter for bio
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
            />
          </TabsContent>
        </Tabs>

        <button
          className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 animate-spin" />}
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-sm text-[#007acc] hover:text-blue-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
