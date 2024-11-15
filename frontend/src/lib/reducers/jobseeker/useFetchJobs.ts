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
  favertiedJobs: Job[];
  recommendedJobs: Job[];
  topCompanies: Company[];
  loading: boolean;
  currentPageJobs: number;
  totalPagesJobs: number;
  setSearchParams: React.Dispatch<React.SetStateAction<any>>;
  handlePageChange: (page: number) => void;
}

export const useFetchJobs = (page: number = 1): FetchJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [favertiedJobs, setFavertiedJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPageJobs, setCurrentPageJobs] = useState(page);
  const [limit] = useState("4"); // Default limit value
  const [totalPagesJobs, setTotalPagesJobs] = useState(0);

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
      const query = searchParams.toString(); // Add searchParams to the query string
      const response = await fetch(`http://localhost:3000/api/jobs?page=${currentPageJobs}&limit=${limit}&${query}`);
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
          isNew: Date.now() - new Date(job.postedDate).getTime() < 7 * 24 * 60 * 60 * 1000,
        }));

        setJobs(formattedJobs);
        setTotalPagesJobs(result.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

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
        setTopCompanies([]);
      }
    } catch (error) {
      console.error('Failed to fetch top companies:', error);
      setTopCompanies([]);
    }
  };

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
        setRecommendedJobs([]);
      }
    } catch (error) {
      console.error('Failed to fetch recommended jobs:', error);
      setRecommendedJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchTopCompanies();
    fetchRecommendedJobs(currentPageJobs, parseInt(limit)); // Fetch recommended jobs based on current page and limit
  }, [searchParams, currentPageJobs, limit]); // Ensure limit is included in dependency

  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value);
    });
    setSearchParams(updatedParams);
    navigate({ search: updatedParams.toString() });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPageJobs(newPage); // Update the current page
    updateSearchParams({ page: newPage.toString(), limit }); // Ensure limit is updated in query params as well
  };

  return {
    jobs,
    recommendedJobs,
    topCompanies,
    favertiedJobs,
    loading,
    currentPageJobs,
    totalPagesJobs,
    setSearchParams: updateSearchParams,
    handlePageChange, // Expose page change function
  };
};
