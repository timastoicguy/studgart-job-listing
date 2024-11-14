/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiHeart, FiMapPin, FiTrash } from 'react-icons/fi';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Job {
  id: string;
  job_id: {
    title: string;
    salaryRange: {
      min: number;
      max: number;
    };
    recruiter: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    location: { name: string; code: string }[];
    company: string;
    jobCategory: string;
    technologies: string[];
    employmentType: { name: string; code: string }[];
    experienceLevel: { name: string; code: string }[];
    benefits: string[];
    status: string;
    numberOfVacancies: number;
    isUrgent: boolean;
    postedDate: string;
    updatedDate: string;
  };
  job_seeker_id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RecommendedJob {
  title: string;
  level: string;
  location: string;
  salary: string;
  avatar: string;
}

interface TopCompany {
  name: string;
  location: string;
  openings: number;
  avatar: string;
}

const FavoriteJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [recommendedJobs] = useState<RecommendedJob[]>([
    {
      title: 'Front-end Developer',
      level: 'Fresher, Junior',
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
  ]);
  const [topCompanies] = useState<TopCompany[]>([
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
  ]);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch saved jobs from the API
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/favorites?job_seeker_id=67273fea96599e898e7bbd6c'); // Update with your actual API endpoint
        console.log(response.data.data.docs);
        setJobListings(response.data.data.docs);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    fetchSavedJobs();
  }, []);

  return (
    <TooltipProvider>
      <div className="lg:pl-[250px] flex flex-col md:flex-row bg-gray-100">
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
              Danh sách công việc đã lưu
            </div>

            <div className="space-y-4 overflow-y-auto">
              {jobListings.slice(0, itemsPerPage).map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-md flex flex-col sm:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-4 flex-1">
                    <img
                      src={job.job_id.company}  // Assuming `company` field contains the logo or avatar URL.
                      alt="company logo"
                      className="w-20 h-20 object-cover rounded-full"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-center space-x-2 mb-1">
                        {job.job_id.isUrgent && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                            Tuyển gấp
                          </span>
                        )}
                        {job.job_id.status === 'New' && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                            Mới
                          </span>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <h3 className="font-bold text-lg truncate max-sm:max-w-[150px] max-w-full flex items-center cursor-pointer">
                            {job.job_id.title}
                          </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>{job.job_id.title}</span>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-gray-600">{job.job_id.skills.join(', ')}</p>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <FiMapPin className="text-gray-500" />
                        <span>{job.job_id.location[0].name}</span> {/* Assuming the first location is the main one */}
                        <span>- {job.job_id.postedDate}</span>
                      </div>
                      <div className="text-red-500 font-semibold mt-1">
                        {job.job_id.salaryRange.min} - {job.job_id.salaryRange.max} VND
                      </div>
                      <hr className="col-span-3 border-t border-gray-300 my-1" />
                      <div className={`font-semibold mt-1 ${job.status === "Đã ứng tuyển" ? "text-blue-500" : "text-gray-500"}`}>
                        {job.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center max-sm:w-full space-x-2 sm:space-y-2 mt-4 sm:mt-0 justify-end">
                    <Tooltip>
                      <TooltipTrigger>
                        <button className="bg-slate-300 text-black px-4 py-2 rounded-md flex items-center">
                          <FiTrash className="mr-2" /> Bỏ lưu
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Bỏ lưu</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

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
        </main>

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
                    <p className="text-gray-600">{company.location}</p>
                    <p className="text-sm text-gray-600">Mở {company.openings} vị trí</p>
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

export default FavoriteJobs;
