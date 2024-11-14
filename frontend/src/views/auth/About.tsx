/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { FiSend, FiHeart, FiMapPin } from "react-icons/fi";

export default function JobListing() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi'); // State for language selection
  const [title, setTitle] = useState("FRONT-END DEVELOPER");
  const [salaryMin, setSalaryMin] = useState(750);
  const [salaryMax, setSalaryMax] = useState(1200);
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("2025-12-14");
  const [jobDescription, setJobDescription] = useState(`
  - Understand requirements, analyze - design, build and optimize E-commerce products for the company.
  - Participate in the maintenance and upgrade of the website's features.
  - Write well designed, testable, efficient code; Create website layout/user interface by using standard HTML/CSS/JS practices.
  - Perform work as requested by the manager.`);
  const [requirements, setRequirements] = useState(`
  - Good command in English
  - Bachelor's degree in related field
  - Experience with PHP (Laravel, WordPress, CodeIgniter), knowledge of Bootstrap, Sass, ReactJS / NodeJS...is an advantage
  - Proficient in using MySQL/PostgreSQL/MariaDB for database administration
  - Master the knowledge and experience of HTML 5, CSS 3, JS`);
  const [benefits, setBenefits] = useState(`
  - Salary: Negotiable based on experience and track records
  - A friendly, dynamic and professional environment with great chances to learn new skills and gain valuable experience
  - Annual leave, insurance following Vietnam Law and company’s regulation (social insurance and health care insurance, etc.)
  - Periodic and regular evaluations for salary raises in accordance with performances.`);
  const [location, setLocation] = useState("Hồ Chí Minh: 40 Thiên Phước phường 9, Tân Bình");
  const [companyName, setCompanyName] = useState("CA Advance");
  const [companyLogo, setCompanyLogo] = useState("/path/to/company-logo.png");
  const [companyAddress, setCompanyAddress] = useState("Lầu 21, Centec Tower, 72-74 đường Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh");

  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      {/* Left Side - Language Selector and Input Fields */}
      <div className="p-6 bg-white shadow-md rounded-md border">
        <h2 className="text-2xl font-bold mb-6">Thêm công việc</h2>
        
        {/* Language Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Ngôn ngữ</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
            className="w-full p-3 border rounded-md"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>
        
        {/* Salary Range */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Khoảng lương từ</label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(Number(e.target.value))}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">đến</label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(Number(e.target.value))}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Đơn vị tiền</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>
        
        {/* Deadline */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Thời gian hết hạn</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Mô tả công việc</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>

        {/* Job Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Yêu cầu ứng viên</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>

        {/* Job Benefits */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Quyền lợi</label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>

        {/* Job Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Địa điểm làm việc</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>
      </div>

      {/* Right Side - Job Preview */}
      <div className="p-6 bg-gray-50 shadow-md rounded-md border space-y-6">
        {/* Section 1: Job Info and Company */}
        <div className="p-4 bg-white shadow rounded-md border">
          <div className="flex items-center justify-between mb-4">
            {/* Company Logo */}
            <div className="flex items-center">
              <img src={companyLogo} alt="Company Logo" className="w-16 h-16 mr-4" />
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-gray-600">{companyName}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMapPin className="mr-1" />
                  {companyAddress}
                </div>
              </div>
            </div>
            {/* Icons */}
            <div className="flex space-x-4">
              <FiHeart className="text-gray-400 w-6 h-6" />
            </div>
          </div>

          <p className="text-red-500 text-lg font-bold">
            {salaryMin} {currency} - {salaryMax} {currency}
          </p>
          <p className="text-gray-400 mt-1">10 minutes ago</p>

          <p className="text-gray-500 mt-2">Hết hạn: {deadline}</p>
        </div>

        {/* Section 2: Job Details */}
        <div className="p-4 bg-white shadow rounded-md border">
          <h3 className="font-bold">Chi tiết tuyển dụng</h3>

          <h4 className="font-bold mt-4">Mô tả công việc</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{jobDescription}</p>

          <h4 className="font-bold mt-4">Yêu cầu ứng viên</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{requirements}</p>

          <h4 className="font-bold mt-4">Quyền lợi</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{benefits}</p>

          <h4 className="font-bold mt-4">Địa điểm làm việc</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{location}</p>
        </div>
      </div>
    </div>
  );
}
