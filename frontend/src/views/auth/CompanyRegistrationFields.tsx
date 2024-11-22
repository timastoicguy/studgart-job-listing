/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CompanyRegistrationFieldsProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  rePassword: string;
  setRePassword: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  address: string; // Address field
  setAddress: React.Dispatch<React.SetStateAction<string>>; // Setter for address
  bio: string; // Bio field
  setBio: React.Dispatch<React.SetStateAction<string>>; // Setter for bio
  companyName: string; // Company Name
  setCompanyName: React.Dispatch<React.SetStateAction<string>>; // Setter for company name
  companySize: string; // Company Size
  setCompanySize: React.Dispatch<React.SetStateAction<string>>; // Setter for company size
  contactEmail: string; // Contact Email
  setContactEmail: React.Dispatch<React.SetStateAction<string>>; // Setter for contact email
  contactPhone: string; // Contact Phone
  setContactPhone: React.Dispatch<React.SetStateAction<string>>; // Setter for contact phone
  loading: boolean;
}

const CompanyRegistrationFields: React.FC<CompanyRegistrationFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  rePassword,
  setRePassword,
  username,
  setUsername,
  fullName,
  setFullName,
  phone,
  setPhone,
  address,
  setAddress,
  bio,
  setBio,
  companyName,
  setCompanyName,
  companySize,
  setCompanySize,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  loading,
}) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showRePassword, setShowRePassword] = React.useState<boolean>(false);

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
            onClick={() => setShowPassword((prev) => !prev)}
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
            onClick={() => setShowRePassword((prev) => !prev)}
            disabled={loading}
          >
            {showRePassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          placeholder="Full Name"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone
        </label>
        <input
          type="text"
          id="phone"
          placeholder="Phone"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
          Address
        </label>
        <input
          type="text"
          id="address"
          placeholder="Address"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          placeholder="Tell us about your company"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          placeholder="Company Name"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companySize">
          Company Size
        </label>
        <select
          id="companySize"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          disabled={loading}
        >
          <option value="">Select company size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactEmail">
          Contact Email
        </label>
        <input
          type="email"
          id="contactEmail"
          placeholder="Contact Email"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPhone">
          Contact Phone
        </label>
        <input
          type="text"
          id="contactPhone"
          placeholder="Contact Phone"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          disabled={loading}
        />
      </div>
    </>
  );
};

export default CompanyRegistrationFields;
