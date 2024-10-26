import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface JobSeekerRegistrationFieldsProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  rePassword: string;
  setRePassword: React.Dispatch<React.SetStateAction<string>>;
  address: string; // Add address prop
  setAddress: React.Dispatch<React.SetStateAction<string>>; // Add setAddress prop
  bio: string; // Add bio prop
  setBio: React.Dispatch<React.SetStateAction<string>>; // Add setBio prop
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const JobSeekerRegistrationFields: React.FC<JobSeekerRegistrationFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  rePassword,
  setRePassword,
  address,
  setAddress,
  bio,
  setBio,
  showPassword,
  setShowPassword,
  loading,
}) => {
  const [showRePassword, setShowRePassword] = useState<boolean>(false);

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Minimum length is 8 characters"
            className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-0 pr-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rePassword">
          Re-Password
        </label>
        <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type={showRePassword ? "text" : "password"}
            id="rePassword"
            placeholder="Re-enter your password"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-0 pr-3"
            onClick={() => setShowRePassword(!showRePassword)}
            disabled={loading}
          >
            {showRePassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* New address field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
          Address
        </label>
        <input
          type="text"
          id="address"
          placeholder="Your address"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* New bio field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          placeholder="Tell us about yourself"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={loading}
        />
      </div>
    </>
  );
};

export default JobSeekerRegistrationFields;
