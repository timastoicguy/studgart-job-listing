/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiMapPin, FiHeart, FiUsers, FiFlag, FiBriefcase } from "react-icons/fi"; // Import các icon cần thiết
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
const DetailJob: React.FC = () => {
  const [title, setTitle] = useState("FRONT-END DEVELOPER");
  const [salaryMin, setSalaryMin] = useState(750);
  const [salaryMax, setSalaryMax] = useState(1200);
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("2025-12-14");
  const [jobDescription, setJobDescription] = useState(`
  - Understand requirements, analyze, design, build and optimize E-commerce products for the company.
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
  const [location, setLocation] = useState("Lầu 21, Centec Tower, 72-74 Nguyễn Thị Minh Khai, Quận 3, Hồ Chí Minh");
  const [companyName, setCompanyName] = useState("CA Advance");
  const [companyLogo, setCompanyLogo] = useState("https://via.placeholder.com/48");
  const [companyAddress, setCompanyAddress] = useState("Lầu 21, Centec Tower, 72-74 Nguyễn Thị Minh Khai, Quận 3, Thành phố Hồ Chí Minh");
  const [industry, setIndustry] = useState("Quảng cáo truyền thông");
const [companySize, setCompanySize] = useState("100-499 nhân viên");
const [nationality, setNationality] = useState("Japan");

  // Sample data for related jobs
  const relatedJobs = [
    {
      title: "Software Engineer",
      company: "WATA Solutions",
      salary: "8,000,000 - 35,000,000 VND",
      logo: "https://via.placeholder.com/48",
    },
    {
      title: "Backend Developer",
      company: "Tech Innovators",
      salary: "10,000,000 - 40,000,000 VND",
      logo: "https://via.placeholder.com/48",
    },
    {
      title: "UI/UX Designer",
      company: "Design Hub",
      salary: "9,000,000 - 30,000,000 VND",
      logo: "https://via.placeholder.com/48",
    },
    {
      title: "Backend Developer",
      company: "Tech Innovators",
      salary: "10,000,000 - 40,000,000 VND",
      logo: "https://via.placeholder.com/48",
    },
    {
      title: "UI/UX Designer",
      company: "Design Hub",
      salary: "9,000,000 - 30,000,000 VND",
      logo: "https://via.placeholder.com/48",
    },
    {
      title: "UI/UX Designer",
      company: "Design Hub",
      salary: "9,000,000 - 30,000,000 VND",
      logo: "https://via.placeholder.com/48",
    },
    // Add more jobs as needed
  ];

  // Function to handle application button click
  const handleApplyClick = () => {
    alert("Đã gửi đơn ứng tuyển cho vị trí " + title);
  };

  return (
    <TooltipProvider>
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Center Column: Job Info and Job Details */}
      <div className="lg:col-span-2 bg-white p-6 rounded-md shadow-md space-y-6">
        
        {/* Section 1: Job Info */}
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin công việc
        </div>
        <div className="p-4 bg-white shadow rounded-md border">
          <div className="flex items-center justify-between mb-4">
            {/* Company Logo and Info */}
            <div className="flex items-center">
              <img
                src={companyLogo} // Use the company logo from state
                alt="Company Logo"
                className="w-20 h-20 mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-gray-600">{companyName}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMapPin className="mr-1" />
                  {location}
                </div>
              </div>
            </div>
            {/* Icons */}
            <div className="flex space-x-4">
  <Tooltip>
    <TooltipTrigger>
      <FiHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
    </TooltipTrigger>
    <TooltipContent>Yêu thích</TooltipContent>
  </Tooltip>
            </div>
          </div>
            <div className="pl-24">
            <p className="text-red-500 text-lg font-bold">
            {salaryMin} {currency} - {salaryMax} {currency}
          </p>
          <p className="text-gray-400 mt-1">10 minutes ago</p>
          <p className="text-gray-500 mt-2">Hết hạn: {new Date(deadline).toLocaleDateString()}</p>
            </div>
          

          {/* Apply Button in Job Info Section */}
          <div className="mt-4 flex justify-end">
  <button 
    onClick={handleApplyClick} 
    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
  >
    Ứng tuyển
  </button>
</div>

        </div>

        {/* Section 2: Job Details */}
        <div className="p-4 bg-white shadow rounded-md border">
          <h3 className="font-bold">Chi tiết tuyển dụng</h3>

          <h4 className="font-bold mt-4">Mô tả công việc</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {jobDescription}
          </p>

          <h4 className="font-bold mt-4">Yêu cầu ứng viên</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {requirements}
          </p>

          <h4 className="font-bold mt-4">Quyền lợi</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {benefits}
          </p>

          <h4 className="font-bold mt-4">Địa điểm làm việc</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {location}
          </p>

          {/* Apply Button in Job Details Section */}
          <button 
            onClick={handleApplyClick} 
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Ứng tuyển
          </button>
        </div>
      </div>

      {/* Right Column: Company Info and Related Jobs */}
      {/* Right Column: Company Info and Related Jobs */}
<aside className="space-y-6">
  {/* Company Info */}
  <div className="bg-white p-6 rounded-md shadow-md border">
    <h2 className="text-lg font-bold mb-4 text-center">Thông tin công ty</h2>

    <div className="flex space-x-4 mb-4">
      <img
        src={companyLogo} // Sử dụng logo công ty từ state
        alt="Company Logo"
        className="w-16 h-16 object-cover"
      />
      <div>
        <h3 className="font-bold text-lg">{companyName}</h3>
        <div className="space-y-2 mt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiBriefcase className="text-green-500" /> {/* Icon ngành nghề */}
            <span>Ngành nghề:</span> <span className="font-semibold">{industry}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiUsers className="text-green-500" /> {/* Icon quy mô công ty */}
            <span>Quy mô:</span> <span className="font-semibold">{companySize}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiFlag className="text-green-500" /> {/* Icon quốc tịch */}
            <span>Quốc tịch:</span> <span className="font-semibold">{nationality}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiMapPin className="text-green-500" /> {/* Icon địa chỉ */}
            <span>Địa chỉ:</span> <span className="font-semibold">{companyAddress}</span>
        </div>


        </div>
      </div>
    </div>

    <a href="#" className="text-green-500 text-center block font-semibold">
      Xem trang công ty
    </a>
  </div>

{/* Related Jobs */}
<div className="bg-white p-6 rounded-md shadow-md border">
  <h2 className="text-lg font-bold mb-4">Công việc liên quan</h2>
  <ul className="space-y-4">
    {relatedJobs.map((job, index) => (
      <li 
        key={index} 
        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm"
      >
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          className="w-12 h-12 object-cover"
        />
        <div>
          <h3 className="font-bold">{job.title}</h3>
          <p className="text-gray-500 text-sm">{job.company}</p>
          <p className="text-red-500 text-sm font-semibold">{job.salary}</p>
        </div>
      </li>
    ))}
  </ul>
</div>

</aside>

    </div>
        </TooltipProvider>
  );
  
};

export default DetailJob;
