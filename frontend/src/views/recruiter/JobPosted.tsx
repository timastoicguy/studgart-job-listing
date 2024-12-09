/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {  FiMapPin,FiRefreshCcw } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchJobs } from "@/lib/reducers/recruiter/useFetchJobs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { notification } from 'antd';  // Import notification from Ant Design
import ConfirmationDialog from "../component/ConfirmationDialog";


const JobPosted: React.FC = () => {
  const itemsPerPage = 3;
  const jobSeekerId = "67273fea96599e898e7bbd6c"; // Replace with dynamic ID

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState(new Map<string, boolean>());
  const [applicationDeadlineMap, setApplicationDeadlineMap] = useState<Map<string, boolean>>(new Map());
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog open state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null); // Store selected job ID for favoriting
  const navigate = useNavigate();

  const [currentPageJobs, setCurrentPageJobs] = useState(1); // Initialize currentPageJobs

  const {
    jobs: jobListings,
    recommendedJobs = [],
    topCompanies = [],
    totalPagesJobs,
    loading,
    handlePageChange,
  } = useFetchJobs(currentPageJobs);
  const formatSalary = (salary: string) => Number(salary).toLocaleString();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);


  const handleJobClick = (job: any) =>
    navigate(`/recruiter/jobseekerpending/${job.id}`, { state: { job } });
  const handleCompanyClick = (company: any) =>
    navigate(`/jobseeker/detailCompany/${company.id}`, { state: { company } });



  
  useEffect(() => {
    const filtered = jobListings.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.avatar.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [jobListings, searchQuery]);

 // Function to handle page change and update URL
 const handlePageUrlChange = (page: number) => {
  setCurrentPageJobs(page);
  const searchParams = new URLSearchParams(location.search);
  searchParams.set("page", page.toString()); // Update page in the URL
  navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
};

useEffect(() => {
  // Parse the page number from the URL when component mounts
  const params = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(params.get("page") || "1", 10);
  setCurrentPageJobs(pageFromUrl);
}, [location]);
  return (
    
    <TooltipProvider>
      <div className="lg:pl-[250px] flex flex-col lg:flex-row bg-gray-100">

        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
              Danh sách công việc đã đăng
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4">

            </div>

            <div className="space-y-4 overflow-y-auto">
            {loading
        ? Array.from({ length: itemsPerPage }).map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-md flex flex-col md:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm"
            >
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="w-20 h-8 rounded-md" />
            </div>
          ))
        : jobListings.map((job, index) => {
            // Chuyển đổi applicationDeadline sang Date và so sánh với ngày hiện tại
            const jobDeadline = new Date(job.applicationDeadline);
            const isExpired = jobDeadline < new Date();
            console.log("isExpired:", isExpired);

            return (
              <div
                key={index}
                className="p-4 border rounded-md flex flex-col md:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-4 flex-1">
                  <img
                    src={job.avatar || "https://via.placeholder.com/48"}
                    alt="company logo"
                    className="w-20 h-20 object-cover rounded-full"
                  />
                  <div className="flex-1 flex flex-col justify-between">
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
                    <Tooltip>
                      <TooltipTrigger>
                        <h3
                          className="font-bold text-lg truncate max-sm:max-w-[150px] max-w-full flex items-center cursor-pointer"
                          onClick={() => handleJobClick(job)} // Navigate on click
                        >
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
                    </div>
                    <span className="text-sm text-red-500">Exp: {job.applicationDeadline.toLocaleDateString()}</span>
                    <div className="text-red-500 font-semibold mt-1">
                      {job.salary}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center max-md:w-full space-x-2 md:space-y-2 mt-4 md:mt-0 justify-end">
                  <button
                    onClick={() => handleJobClick(job)} // Navigate on click
                    className={`${
                      isExpired ? "bg-gray-400" : "bg-green-500"
                    } text-white px-4 py-2 rounded-md`}
                  >
                    {isExpired ? "Đã hết hạn" : "Còn hạn"}
                  </button>

                </div>
                
              </div>
            );
          })}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Pagination>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(currentPageJobs - 1, 1))
                  }
                >
                  Trang trước
                </PaginationPrevious>
                <PaginationContent>
                  {Array.from({ length: totalPagesJobs }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPageJobs === i + 1}
                        onClick={() => {
                          handlePageChange(i + 1);
                          setCurrentPageJobs(i + 1); // Correctly set the current page
                          handlePageUrlChange(i + 1);
                        }}
                        className={
                          currentPageJobs === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-black"
                        } // Apply custom styles here
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(currentPageJobs + 1, totalPagesJobs)
                    )
                  }
                >
                  Trang sau
                </PaginationNext>
              </Pagination>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-md border">
            <h2 className="text-lg text-green-500 font-bold mb-4">
              Các công việc có thể bạn quan tâm
            </h2>
            <div className="space-y-4">
              {/* Replace recommendedJobs with your actual recommended jobs data */}
              {recommendedJobs && recommendedJobs.length > 0 ? (
                recommendedJobs.map((job, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-2 border rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => handleJobClick(job)} // Navigate on click
                  >
                    <img
                      src={job.avatar || "https://via.placeholder.com/48"}
                      alt="company logo"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-sm">{job.title}</h3>
                      <p className="text-gray-600">{job.techStack}</p>
                      <p className="text-gray-600 flex items-center w-[100px] truncate">
                        <FiMapPin className="mr-1" /> {job.location}
                      </p>
                      <span className="text-sm text-red-500">{job.salary}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recommended jobs available.</p>
              )}
            </div>
            <hr className="col-span-3 border-t border-gray-300 my-4" />

            <h2 className="text-lg text-green-500 font-bold mt-6 mb-4">
              Các công ty hàng đầu
            </h2>
            <div className="space-y-4">
              {/* Replace topCompanies with your actual top companies data */}
              {topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-2 border rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => handleCompanyClick(company)} // Navigate on click
                >
                  <img
                    src={company.avatar || "https://via.placeholder.com/48"}
                    alt="company logo"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-sm">{company.name}</h3>
                    <p className="text-gray-600 flex items-center w-[100px] truncate">
                        <FiMapPin className="mr-1" /> {company.location}
                      </p>
                    <span className="text-sm text-red-500">
                      {company.openings} công việc đang tuyển
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  );
};

export default JobPosted;
