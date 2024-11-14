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
    topCompanies: Company[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  error?: string;
}

interface RecommendedApiResponse {
  data: {
    jobs: Job[];
  };
  error?: string;
}

interface FetchJobsReturn {
  jobs: Job[];
  recommendedJobs: Job[];
  topCompanies: Company[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
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
      return 'N/A';
    }
    return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
  };

  // Fetch main jobs and top companies
  const fetchJobs = async () => {
    setLoading(true);
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
        setCurrentPage(result.data.page);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };
 // Fetch top companies
 const fetchTopCompanies = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/companies-top/top?size=5');
    const result = await response.json();

    if (!result.error && result.data && result.data.topCompanies) {
      const formattedTopCompanies = result.data.topCompanies.map((company: any) => ({
        id: company.company._id,
        name: company.company.company_name,
        avatar: '', // If avatar is available in the API response, use it here
        location: company.company.company_address,
        openings: company.jobCount,
      }));

      setTopCompanies(formattedTopCompanies);
    } else {
      console.error("Failed to fetch top companies:", result);
      setTopCompanies([]); // Fallback to empty list if there's an error
    }
  } catch (error) {
    console.error('Failed to fetch top companies:', error);
    setTopCompanies([]); // In case of error, fallback to an empty list
  }
};
  // Fetch recommended jobs from a different endpoint
  const fetchRecommendedJobs = async (page: number, limit: number) => {
    const query = searchParams.toString();
    try {
      const response = await fetch(`http://localhost:3000/api/group/jobs/suggestions/?page=${page}&limit=${limit}&${query}`);
      const result: RecommendedApiResponse = await response.json();

      if (!result.error && result.data && result.data.jobs && Array.isArray(result.data.jobs)) {
        const formattedRecommendedJobs = result.data.jobs.map((job: any) => ({
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

        setRecommendedJobs(formattedRecommendedJobs);
      } else {
        console.error("No jobs found or incorrect format:", result);
        setRecommendedJobs([]); // Fallback to empty list if format is not as expected
      }
    } catch (error) {
      console.error('Failed to fetch recommended jobs:', error);
      setRecommendedJobs([]); // In case of error, fallback to an empty list
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchTopCompanies(); // Fetch top companies
    fetchRecommendedJobs(currentPage, 3); // Fetch 3 recommended jobs based on current page
  }, [searchParams, currentPage]);

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
