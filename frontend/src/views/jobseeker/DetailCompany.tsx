/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiMapPin, FiHeart, FiUsers, FiFlag, FiBriefcase,FiGlobe } from "react-icons/fi"; // Import các icon cần thiết
import { FaIndustry } from 'react-icons/fa'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DetailCompany: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
  const [companyLink, setcompanyLink] = useState("https://www.ca-adv.vn/vi/");
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
const [introCompany, setIntroCompany] = useState("Công ty CA ADVANCE VIETNAM là một công ty đi đầu trong lĩnh vực Internet Marketing, trực thuộc tập đoàn Cyber Agent- một trong những tập đoàn hàng đầu của Nhật bản.");

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

  return (
    <TooltipProvider>
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Center Column: Job Info and Job Details */}
      <div className="lg:col-span-2 bg-white p-6 rounded-md shadow-md space-y-6">
        
        {/* Section 1: Job Info */}

        <div className="p-4 bg-white shadow rounded-md border">
        <div className="mb-4 bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin công ty
        </div>
          <div className="flex items-center justify-between mb-4">
            {/* Company Logo and Info */}
            <div className="flex items-center">
              <img
                src={companyLogo} // Use the company logo from state
                alt="Company Logo"
                className="w-20 h-20 mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{companyName}</h2>
                <p className="text-gray-600">{companyLink}</p>
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
  <div className="grid grid-cols-3 gap-4 mt-4">
    {/* Quy mô công ty */}
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <FiUsers className="mr-2 text-gray-500" size={24} /> {/* Icon quy mô công ty */}
        <p className="text-gray-500">Quy mô công ty</p>
      </div>
      <p className="text-gray-400 text-sm mt-1">Số lượng: 500+</p> {/* Thay số lượng */}
    </div>

    {/* Ngành nghề */}
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <FaIndustry className="mr-2 text-gray-500" size={24} /> {/* Icon ngành nghề */}
        <p className="text-gray-500">Ngành nghề</p>
      </div>
      <p className="text-gray-400 text-sm mt-1">Truyền thông</p> {/* Thay số lượng */}
    </div>

    {/* Quốc tịch */}
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <FiGlobe className="mr-2 text-gray-500" size={24} /> {/* Icon quốc tịch */}
        <p className="text-gray-500">Quốc tịch</p>
      </div>
      <p className="text-gray-400 text-sm mt-1">Japan</p> {/* Thay số lượng */}
    </div>
  </div>
</div>

        </div>

        {/* Section 2: Job Details */}
        <div className="p-4 bg-white shadow rounded-md border">
  <div className="mb-4 bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
    Tuyển dụng
  </div>

  {/* Job Listings */}
  <div className="space-y-4 overflow-y-auto ">
    {jobListings.slice(0, itemsPerPage).map((job, index) => (
      <div
        key={index}
        className="p-4 border rounded-md flex flex-col sm:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex space-x-4 flex-1">
          <img
            src={job.avatar}
            alt="company logo"
            className="w-20 h-20 object-cover rounded-full"
          />
          <div className="flex-1 flex flex-col justify-between">
            {/* Labels Section */}
            <div className="flex items-center space-x-2 mb-1">
              {job.isHot && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                  Tuyển gấp
                </span>
              )}
              {job.isNew && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                  Mới
                </span>
              )}
            </div>
            {/* Job Title with Tooltip */}
            <Tooltip>
              <TooltipTrigger>
                <h3 className="font-bold text-lg truncate max-sm:max-w-[150px] max-w-full flex items-center cursor-pointer">
                  {job.title}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <span>{job.title}</span>
              </TooltipContent>
            </Tooltip>
            <p className="text-gray-600">{job.techStack}</p>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <FiMapPin className="text-gray-500" />
              <span>{job.location}</span>
              <span>- {job.timePosted}</span>
            </div>
            <div className="text-red-500 font-semibold mt-1">
              {job.salary}
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center max-sm:w-full space-x-2 sm:space-y-2 mt-4 sm:mt-0 justify-end">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Ứng tuyển
          </button>
          <Tooltip>
            <TooltipTrigger>
              <FiHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>Yêu thích</TooltipContent>
          </Tooltip>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination */}
  <div className="mt-6 flex justify-between items-center">
    <Pagination>
      <PaginationPrevious>Trang trước</PaginationPrevious>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink isActive={true}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
      </PaginationContent>
      <PaginationNext>Trang sau</PaginationNext>
    </Pagination>
  </div>
</div>

      </div>

      {/* Right Column: Company Info and Related Jobs */}
<aside className="space-y-6">
  {/* Company Info */}
  <div className="bg-white p-6 rounded-md shadow-md border">
  <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Giới thiệu công ty
        </div>
  <div className="bg-white p-6 rounded-md shadow-md border">
  <p className="text-gray-500 text-sm">{introCompany}</p>
  </div>
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

const jobListings = [
  {
    title: 'Fresher Frontend Developer (ReactJS)',
    techStack: 'ReactJS, MongoDB, JavaScript',
    location: 'HCM',
    timePosted: '10 mins ago',
    salary: 'Lên tới 12.000.000',
    isHot: true,  // This job is "Tuyển gấp"
    isNew: true,  // This job is "Mới"
    avatar: 'https://via.placeholder.com/48', // Placeholder for avatar image
  },
  {
    title: 'Frontend Developer (Junior)',
    techStack: 'ReactJS, NodeJS, MongoDB',
    location: 'HCM',
    timePosted: '2 days ago',
    salary: 'Lên tới 20.000.000',
    isHot: false,
    isNew: true,  // This job is "Mới"
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Web Developer',
    techStack: 'ReactJS, NodeJS, MongoDB',
    location: 'HCM',
    timePosted: '3 days ago',
    salary: '20.000.000 - 28.000.000',
    isHot: false,
    isNew: false,
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Python Developer',
    techStack: 'ReactJS, MongoDB, JavaScript',
    location: 'HCM',
    timePosted: '10 mins ago',
    salary: 'Lên tới 15.000.000',
    isHot: true,  // This job is "Tuyển gấp"
    isNew: true,  // This job is "Mới"
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Senior Front-End Developer (ReactJS)',
    techStack: 'ReactJS, MongoDB, JavaScript',
    location: 'HCM',
    timePosted: '1 week ago',
    salary: 'Lên tới 48.000.000',
    isHot: true,  // This job is "Tuyển gấp"
    isNew: false,
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Fresher Frontend Developer (ReactJS)',
    techStack: 'ReactJS, MongoDB, JavaScript',
    location: 'HCM',
    timePosted: '10 mins ago',
    salary: 'Lên tới 12.000.000',
    isHot: true,  // This job is "Tuyển gấp"
    isNew: true,  // This job is "Mới"
    avatar: 'https://via.placeholder.com/48', // Placeholder for avatar image
  },
  {
    title: 'Frontend Developer (Junior)',
    techStack: 'ReactJS, NodeJS, MongoDB',
    location: 'HCM',
    timePosted: '2 days ago',
    salary: 'Lên tới 20.000.000',
    isHot: false,
    isNew: true,  // This job is "Mới"
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Web Developer',
    techStack: 'ReactJS, NodeJS, MongoDB',
    location: 'HCM',
    timePosted: '3 days ago',
    salary: '20.000.000 - 28.000.000',
    isHot: false,
    isNew: false,
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Python Developer',
    techStack: 'ReactJS, MongoDB, JavaScript',
    location: 'HCM',
    timePosted: '10 mins ago',
    salary: 'Lên tới 15.000.000',
    isHot: true,  // This job is "Tuyển gấp"
    isNew: true,  // This job is "Mới"
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Senior Front-End Developer (ReactJS)',
    techStack: 'ReactJS, MongoDB, JavaScript',
    location: 'HCM',
    timePosted: '1 week ago',
    salary: 'Lên tới 48.000.000',
    isHot: true,  // This job is "Tuyển gấp"
    isNew: false,
    avatar: 'https://via.placeholder.com/48',
  },
];

const recommendedJobs = [
  {
    title: 'Frond-end Developer',
    level: 'Fresher, Junior', // Added level
    location: 'HCM',
    salary: '8.000.000 - 10.000.000',
    avatar: 'https://via.placeholder.com/48',
  },
  
  {
    title: 'Backend Developer',
    level: 'Junior',
    location: 'HN',
    salary: '10.000.000 - 15.000.000',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    title: 'Fullstack Developer',
    level: 'Junior',
    location: 'DN',
    salary: '15.000.000 - 20.000.000',
    avatar: 'https://via.placeholder.com/48',
  },
];

const topCompanies = [
  {
    name: 'Tech Company A',
    location: 'HCM',
    openings: 2,
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Tech Company B',
    location: 'HN',
    openings: 3,
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'FPT Software',
    location: 'HCM',
    openings: 1,
    avatar: 'https://via.placeholder.com/48',
  },
];
export default DetailCompany;
