/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useFetchJobs } from '@/lib/reducers/jobseeker/useFetchJobs';

const Jobs: React.FC = () => {

  const formatSalary = (salary: string) => {
    const salaryNumber = Number(salary); // Convert to number if it's a string
    return salaryNumber.toLocaleString(); // Format with commas
  };
 const { jobs: jobListings, loading } = useFetchJobs(); // Use jobs fetched from useFetchJobs
  const itemsPerPage = 5; // Set items per page as a constant

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <TooltipProvider>
      <div className=" lg:pl-[250px] flex flex-col lg:flex-row bg-gray-100">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-md shadow-md">
          <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Danh sách công việc
        </div>
            
  
            {/* Search and Sort Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4">

              <input
                type="text"
                className="w-full sm:w-1/2 border rounded-md p-2"
                placeholder="Tìm kiếm theo tên công ty, công việc"
              />
              <div className="flex items-center w-full sm:w-auto">
                <span className="mr-2">Sort by:</span>
                <select className="border rounded-md p-2 w-full sm:w-auto">
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
  
            {/* Job Listings */}
            <div className="space-y-4 overflow-y-auto   ">

              {jobListings.slice(0, itemsPerPage).map((job, index) => (
                <div
                  key={index}
                  className="p-4   border rounded-md flex flex-col md:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-4 flex-1 ">
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
                          {/* Apply truncate to prevent text overflow */}
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
                      <span> {job.timePosted}</span>
                      <div className="text-red-500 font-semibold mt-1">
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center max-md:w-full space-x-2 md:space-y-2 mt-4 md:mt-0 justify-end">
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
                  {/* <PaginationEllipsis /> */}
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  {/* <PaginationEllipsis /> */}
                  <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                  </PaginationItem>
                </PaginationContent>
                <PaginationNext>Trang sau</PaginationNext>
              </Pagination>
            </div>
          </div>
        </main>
  
        {/* Right Sidebar */}
        <aside className="space-y-6">
        <div className="bg-white p-6 rounded-md shadow-md border">
          <h2 className="text-lg font-bold mb-4">Các công việc có thể bạn quan tâm</h2>
          <div className="space-y-4">
            {recommendedJobs.map((job, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-2 border rounded-md hover:bg-gray-100 transition-colors"
              >
                <img
                  src={job.avatar}
                  alt="company logo"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div>
                  <h3 className="font-bold text-sm">{job.title}</h3>
                  <p className="text-gray-600">{job.level}</p>
                  <p className="text-gray-600 flex items-center">
                    <FiMapPin className="mr-1" /> {job.location}
                  </p>
                  <span className="text-sm text-red-500">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>
          <hr className="col-span-3 border-t border-gray-300 my-4" />
          
          <h2 className="text-lg font-bold mt-6 mb-4">Các công ty hàng đầu</h2>
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-2 border rounded-md hover:bg-gray-100 transition-colors"
              >
                <img
                  src={company.avatar}
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
// Mock Data
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

export default Jobs;
