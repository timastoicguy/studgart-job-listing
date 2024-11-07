/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState,useEffect } from "react";
import { FiMapPin, FiHeart, FiUsers, FiFlag, FiBriefcase,FiGlobe } from "react-icons/fi"; // Import các icon cần thiết
import { FaIndustry } from 'react-icons/fa';
import axios from "axios";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useParams } from "react-router-dom";

const DetailCompany: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>(); // Get jobId from URL
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

const [companyData, setCompanyData] = useState<any>(null);

useEffect(() => {
  console.log(companyId);

  // Gọi API khi component được mount
  axios.get(`http://localhost:3000/api/companies/${companyId}`)
    .then(response => {
      setCompanyData(response.data.data);
    })
    .catch(error => {
      console.error("Error fetching company data:", error);
    });
}, [companyId]);

interface Job {
  _id: string;
  title: string;
  description: string;
  isUrgent?: boolean;
  isNew?: boolean;
  salaryRange: { min: number; max: number };
  location: { name: string; code: string }[];
  technologies: { name: string; code: string }[];
  postedDate: string;
  // Add any other necessary properties here
}


// State for job listings, current page, and total pages
const [jobListings, setJobListings] = useState<Job[]>([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1); // initialize with 1 as a default value

const navigate = useNavigate(); // Initialize navigate function

const handleJobClick = (jobId: string) => { // Define 'jobId' as a string
  navigate(`/jobseeker/detailjob/${jobId}`);
};


useEffect(() => {
  const fetchJobListings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/jobs?page=${page}&limit=${itemsPerPage}&company=${companyId}`);
      setJobListings(response.data.data.docs);
      setTotalPages(response.data.data.totalPages); // Set total pages based on API response
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  fetchJobListings();
}, [page, companyId]);

  if (!companyData) {
    return <div>Loading...</div>; // Hiển thị loading khi dữ liệu chưa được tải
  }

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
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-20 h-20 mr-4"
                />
                <div>
                  <h2 className="text-lg font-bold">{companyData.company_name}</h2>
                  <p className="text-gray-600">{companyData.contact_email}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="mr-1" />
                    {companyData.company_address}
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
                    <FiUsers className="mr-2 text-gray-500" size={24} />
                    <p className="text-gray-500">Quy mô công ty</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{companyData.company_size}</p>
                </div>
  
                {/* Ngành nghề */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <FaIndustry className="mr-2 text-gray-500" size={24} />
                    <p className="text-gray-500">Ngành nghề</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Truyền thông</p>
                </div>
  
                {/* Quốc tịch */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <FiGlobe className="mr-2 text-gray-500" size={24} />
                    <p className="text-gray-500">Quốc tịch</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Japan</p>
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
  <div className="space-y-4 overflow-y-auto">
    {jobListings.map((job, index) => (
      <div
        key={index}
        className="p-4 border rounded-md flex flex-col sm:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow"
        onClick={() => handleJobClick(job._id)} // Add onClick here
      >
        <div className="flex space-x-4 flex-1">
          <img
            src={companyData.company?.logo || 'default-logo.png'}
            alt="company logo"
            className="w-20 h-20 object-cover rounded-full"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-1">
              {job.isUrgent && (
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
            <p className="text-gray-600">{job.technologies?.map(tech => tech.name).join(', ')}</p>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <FiMapPin className="text-gray-500" />
              <span>{job.location?.[0]?.name || 'Địa điểm không xác định'}</span>
              <span>- {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
            <div className="text-red-500 font-semibold mt-1">
              {job.salaryRange ? `${job.salaryRange.min} - ${job.salaryRange.max} USD` : 'Thương lượng'}
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
      <PaginationPrevious onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
        Trang trước
      </PaginationPrevious>
      <PaginationContent>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i + 1}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
      <PaginationNext onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>
        Trang sau
      </PaginationNext>
    </Pagination>
  </div>
</div>
        </div>
  
        {/* Right Column: Company Info and Related Jobs */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-md border">
            <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
              Giới thiệu công ty
            </div>
            <div className="bg-white p-6 rounded-md shadow-md border">
              <p className="text-gray-500 text-sm">{companyData.bio}</p>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-md shadow-md border">
            <h2 className="text-lg font-bold mb-4">Công việc liên quan</h2>
            <ul className="space-y-4">
              {relatedJobs.map((job, index) => (
                <li key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm">
                  <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 object-cover" />
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

export default DetailCompany;
