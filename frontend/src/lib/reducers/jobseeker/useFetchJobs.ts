/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  techStack: string;
  timePosted: string;
  avatar: string;
  isHot: boolean;
  isNew: boolean;
}

interface Company {
  id: string;
  name: string;
  avatar: string;
  location: string;
  openings: number;
}

interface ApiResponse {
  data: {
    docs: any[];
    recommendedJobs: Job[];
    topCompanies: Company[];
    totalDocs: number; // total number of documents
    totalPages: number; // total number of pages
    page: number; // current page number
    limit: number; // limit per page
  };
  error?: string;
}

interface FetchJobsReturn {
  jobs: Job[];
  recommendedJobs: Job[];
  topCompanies: Company[];
  loading: boolean;
  currentPage: number; // current page
  totalPages: number; // total pages
  setSearchParams: React.Dispatch<React.SetStateAction<any>>;
}

export const useFetchJobs = (): FetchJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Function to format the salary range
  const formatSalary = (min: number | undefined, max: number | undefined) => {
    if (min === undefined || max === undefined) {
      return 'N/A'; // Handle undefined values
    }
    return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
  };

  const fetchJobs = async () => {
    try {
      const query = searchParams.toString();
      const response = await fetch(`http://localhost:3000/api/jobs?${query}`);
      const result: ApiResponse = await response.json();



      if (!result.error) {


        const formattedJobs = result.data.docs.map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.company?.company_name || '',
          location: job.location[0]?.name || '',
          salary: formatSalary(job.salaryRange?.min, job.salaryRange?.max),
          techStack: job.technologies.map((tech: any) => tech.name).join(', '),
          timePosted: new Date(job.postedDate).toLocaleDateString(),
          avatar: job.company?.avatar || '',
          isHot: job.isUrgent,
          isNew: new Date().getTime() - new Date(job.postedDate).getTime() < 7 * 24 * 60 * 60 * 1000,
        }));

        setJobs(formattedJobs);
        setRecommendedJobs(result.data.recommendedJobs || []);
        setTopCompanies(result.data.topCompanies || []);
        setCurrentPage(result.data.page);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value);
    });
    setSearchParams(updatedParams);
    navigate({ search: updatedParams.toString() });
  };

  return { jobs, recommendedJobs, topCompanies, loading, currentPage, totalPages, setSearchParams: updateSearchParams };
};
