/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiHeart,
  FiUsers,
  FiFlag,
  FiBriefcase,
  FiGlobe,
} from "react-icons/fi"; // Import các icon cần thiết
import { FaIndustry } from "react-icons/fa";
import axios from "axios";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
  interface Job {
    _id: string;
    title: string;
    company: {
      logo: string;
      company_name: string;
      contact_email: string;
      contact_phone: string;
      _id: string;
    };
    salaryRange: {
      min: number;
      max: number;
    };
    location: Array<{ name: string; code: string }>;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    employmentType: Array<{ name: string; code: string }>;
    experienceLevel: Array<{ name: string; code: string }>;
    applicationDeadline: string;
    benefits: string[];
  }

  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);

  const [companyData, setCompanyData] = useState<any>(null);
  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get<{ data: { avatar: string } }>(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
      );
      console.log("User Data Response:xssx ", response);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/group/jobs/suggestions/?page=1&limit=5`
      );
      const data = await response.json();

      const jobsWithCompanyLogo = await Promise.all(
        data.data.jobs.map(async (job: Job) => {
          if (job.company === null) {
            return {
              ...job,
              company: {
                logo: "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png", // Default logo if company is null
                company_name: "Unknown Company",
                contact_email: "N/A",
                contact_phone: "N/A",
                _id: "unknown-company-id",
              },
              logo: "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png",
            };
          }
          console.log("Job:", job.company);
          const companyResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/companies/${
              job?.company?._id ?? "615274cccd5f865b7ac0366v"
            }`
          );
          const logo = companyResponse?.data?.data?.user_id?.profilePicture; // Profile picture URL from the user_id

          return {
            ...job,
            company: {
              ...job.company,
              logo,
            },
          };
        })
      );

      setRelatedJobs(jobsWithCompanyLogo);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchCompanyAndUser = async () => {
      try {
        if (companyId) {
          const companyResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/companies/${companyId}`
          );
          const companyData = companyResponse.data.data;

          setCompanyData({
            bio: companyData?.user_id?.bio || "N/A",
            name: companyData.company_name,
            address: companyData.company_address || "N/A",
            industry: companyData.industry || "N/A",
            size: companyData.size || "N/A",
            nationality: companyData.nationality || "N/A",
            intro: companyData.intro || "N/A",
            email: companyData.contact_email || "N/A",
            logo:
              companyData.user_id.profilePicture ||
              "https://via.placeholder.com/48",
          });
        }
      } catch (error) {
        console.error("Error fetching company or user data:", error);
      }
    };

    fetchCompanyAndUser();
  }, [companyId, itemsPerPage]); // Add missing dependencies

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

  const handleJobClick = (jobId: string) => {
    // Define 'jobId' as a string
    navigate(`/jobseeker/detailjob/${jobId}`);
  };

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/jobs?page=${page}&limit=${itemsPerPage}&company=${companyId}`
        );
        setJobListings(response.data.data.docs);
        setTotalPages(response.data.data.totalPages); // Set total pages based on API response
        console.log(response.data.data.docs);
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
                  src={companyData.logo}
                  alt="Company Logo"
                  className="w-20 h-20 mr-4"
                />
                <div>
                  <h2 className="text-lg font-bold">{companyData.name}</h2>
                  <p className="text-gray-600">{companyData.email}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="mr-1" />
                    {companyData.address}
                  </div>
                </div>
              </div>
              {/* Icons
              <div className="flex space-x-4">
                <Tooltip>
                  <TooltipTrigger>
                    <FiHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>Yêu thích</TooltipContent>
                </Tooltip>
              </div> */}
            </div>
            <div className="pl-24">
              <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Quy mô công ty */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <FiUsers className="mr-2 text-gray-500" size={24} />
                    <p className="text-gray-500">Quy mô công ty</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {companyData.size}
                  </p>
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
                      src={companyData.logo || "default-logo.png"}
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
                      <p className="text-gray-600">
                        {job.technologies?.map((tech) => tech.name).join(", ")}
                      </p>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <FiMapPin className="text-gray-500" />
                        <span>
                          {job.location?.[0]?.name || "Địa điểm không xác định"}
                        </span>
                        <span>
                          - {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-red-500 font-semibold mt-1">
                        {job.salaryRange
                          ? `${job.salaryRange.min} - ${job.salaryRange.max} USD`
                          : "Thương lượng"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center max-sm:w-full space-x-2 sm:space-y-2 mt-4 sm:mt-0 justify-end">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                      Ứng tuyển
                    </button>
                    {/* <Tooltip>
                      <TooltipTrigger>
                        <FiHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>Yêu thích</TooltipContent>
                    </Tooltip> */}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <Pagination>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
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
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
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
                <li
                  onClick={() => handleJobClick(job._id)}
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm"
                >
                  <img
                    src={job.company.logo || "default-logo.png"}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {job.company.contact_email}
                    </p>
                    <p className="text-red-500 text-sm font-semibold">
                      {job.salaryRange.min} - {job.salaryRange.max} VNĐ
                    </p>
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

// Sample data for related jobs

export default DetailCompany;
