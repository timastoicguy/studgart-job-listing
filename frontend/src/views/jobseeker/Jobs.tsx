/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { FiHeart, FiMapPin } from "react-icons/fi";
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
import { useFetchJobs } from "@/lib/reducers/jobseeker/useFetchJobs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Jobs: React.FC = () => {
  const itemsPerPage = 10;
  const jobSeekerId = "67273fea96599e898e7bbd6c"; // Replace with dynamic ID
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState(new Map<string, boolean>());
  const [appliedJobs, setAppliedJobs] = useState<Map<string, boolean>>(new Map());
  const navigate = useNavigate();

  const {
    jobs: jobListings,
    recommendedJobs = [],
    topCompanies = [],
    totalPagesJobs,
    loading,
    handlePageChange ,
  } = useFetchJobs(currentPage);

  const formatSalary = (salary: string) => Number(salary).toLocaleString();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const handleFavoriteJob = async (jobId: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/favorites", {
        job_id: jobId,
        job_seeker_id: jobSeekerId,
        status: "saved",
      });

      if (response.status === 200) {
        setFavorites(new Map(favorites).set(jobId, true));
      }
    } catch (error) {
      console.error("Error favoriting job:", error);
    }
  };

  const handleJobClick = (job: any) => navigate(`/jobseeker/detailjob/${job.id}`, { state: { job } });
  const handleCompanyClick = (company: any) => navigate(`/jobseeker/detailCompany/${company.id}`, { state: { company } });

  useEffect(() => {
    jobListings.forEach(async (job) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/applications?page=1&job_id=${job.id}&job_seeker_id=${jobSeekerId}`);
        setAppliedJobs((prev) => new Map(prev).set(job.id, response.data.data.docs.length > 0));
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    });
  }, [jobListings]);

  useEffect(() => {
    const filtered = jobListings.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.avatar.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobListings, searchQuery]);
  return (
    <TooltipProvider>
      <div className="lg:pl-[250px] flex flex-col lg:flex-row bg-gray-100">
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
              Danh sách công việc
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
              <input
                type="text"
                className="w-full sm:w-1/2 border rounded-md p-2"
                placeholder="Tìm kiếm theo tên công ty, công việc"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="flex items-center w-full sm:w-auto">
                <span className="mr-2">Sort by:</span>
                <select className="border rounded-md p-2 w-full sm:w-auto">
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto">
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <div key={index} className="p-4 border rounded-md flex flex-col md:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm">
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <Skeleton className="w-20 h-8 rounded-md" />
                    </div>
                  ))
                : currentJobs.map((job, index) => (
                    <div key={index} className="p-4 border rounded-md flex flex-col md:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow">
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
                          </div>
                          <span>{job.timePosted}</span>
                          <div className="text-red-500 font-semibold mt-1">
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center max-md:w-full space-x-2 md:space-y-2 mt-4 md:mt-0 justify-end">
                        <button className={`${appliedJobs.get(job.id) ? "bg-gray-400" : "bg-green-500"} text-white px-4 py-2 rounded-md`}>
                          {appliedJobs.get(job.id) ? "Đã ứng tuyển" : "Ứng tuyển"}
                        </button>
                        <Tooltip>
                          <TooltipTrigger>
                            <FiHeart
                              className={`${favorites.get(job.id) ? "text-red-500" : "text-gray-500"} hover:text-red-500 cursor-pointer`}
                              onClick={() => handleFavoriteJob(job.id)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Yêu thích</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
            <Pagination>
  <PaginationPrevious
    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
  >
    Trang trước
  </PaginationPrevious>
  <PaginationContent>
    {Array.from({ length: totalPagesJobs }, (_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          isActive={currentPage === i + 1}
          onClick={() => handlePageChange(i + 1)}
          className={currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-transparent text-black"} // Apply custom styles here
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}
  </PaginationContent>
  <PaginationNext
    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPagesJobs))}
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
                      <p className="text-gray-600 flex items-center">
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
                    <p className="text-gray-600 flex items-center">
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

export default Jobs;
