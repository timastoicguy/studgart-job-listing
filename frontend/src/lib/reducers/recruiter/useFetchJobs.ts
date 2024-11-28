/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from "@/store/auth/useAuthStore";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  applicationDeadline: Date;

}
export interface Favorite {
  id: string;
  id_job: string;
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
  favertiedJobs: Favorite[];
  recommendedJobs: Job[];
  topCompanies: Company[];
  loading: boolean;
  currentPageJobs: number;
  totalPagesJobs: number;
  currentFavertiedPageJobs: number;
  totalFavertiedPagesJobs: number;

  setSearchParams: React.Dispatch<React.SetStateAction<any>>;
  handlePageChange: (page: number) => void;
  handleFavertiedPageChange: (page: number) => void;
}



export const useFetchJobs = (page: number = 1): FetchJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { userData } = useAuthStore(); // Truy cập thông tin người dùng từ store
  const [favertiedJobs, setFavertiedJobs] = useState<Favorite[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPageJobs, setCurrentPageJobs] = useState(page);
  const [limit] = useState("10"); // Default limit value
  const [totalPagesJobs, setTotalPagesJobs] = useState(0);
  const [totalFavertiedPagesJobs, setTotalFavertiedPagesJobs] = useState(0);
  const [currentFavertiedPageJobs, setCurrentFavertiedPageJobs] =
    useState(page);

  const formatSalary = (min: number | undefined, max: number | undefined) => {
    if (min === undefined || max === undefined) {
      return "N/A";
    }
    return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
  };

  // Fetch main jobs and top companies

  const fetchTopCompanies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/companies-top/top?size=5`
      );
      const result = await response.json();

      if (!result.error && result.data && result.data.topCompanies) {
        const formattedTopCompanies = result.data.topCompanies.map(
          (company: any) => ({
            id: company.company._id,
            name: company.company.company_name,
            avatar: "", // If avatar is available in the API response, use it here
            location: company.company.contact_email,
            openings: company.jobCount,
          })
        );

        setTopCompanies(formattedTopCompanies);

      } else {
        console.error("Failed to fetch top companies:", result);
        setTopCompanies([]);
      }
    } catch (error) {
      console.error("Failed to fetch top companies:", error);
      setTopCompanies([]);
    }
  };

  const fetchRecommendedJobs = async () => {
    const query = searchParams.toString();
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/group/jobs/suggestions/?page=${page}&limit=5&${query}`
      );
      const result: RecommendedApiResponse = await response.json();

      if (
        !result.error &&
        result.data &&
        result.data.jobs &&
        Array.isArray(result.data.jobs)
      ) {
        const formattedRecommendedJobs = result.data.jobs.map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.company?.company_name || "",
          location: job.location[0]?.name || "",
          salary: formatSalary(job.salaryRange?.min, job.salaryRange?.max),
          techStack: job.technologies.map((tech: any) => tech.name).join(", "),
          timePosted: new Date(job.postedDate).toLocaleDateString(),
          avatar: job.avatar || "",
          isHot: job.isUrgent,
          applicationDeadline: new Date(job.applicationDeadline),
          isNew:
            new Date().getTime() - new Date(job.postedDate).getTime() <
            7 * 24 * 60 * 60 * 1000,
        }));

        setRecommendedJobs(formattedRecommendedJobs);

      } else {
        console.error("No jobs found or incorrect format:", result);
        setRecommendedJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch recommended jobs:", error);
      setRecommendedJobs([]);
    }
  };
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams);
      
      // Add page to query if not already present
      if (!query.has("page")) {
        query.set("page", currentPageJobs.toString());
      }
  
      // Add limit to query if not already present
      if (!query.has("limit")) {
        query.set("limit", limit.toString());
      }

      // Add recruiter to query if not already present
      if (!query.has("recruiter")) {
        query.set("recruiter", `${userData.recruiter_id}`); // Giá trị recruiter mặc định
      }
  
      const queryString = query.toString();
      console.log(queryString);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs?${queryString}`
      );
      const result: ApiResponse = await response.json();

      if (!result.error) {
        const formattedJobs = result.data.docs.map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.company?.company_name || "",
          location: job.location[0]?.name || "",
          salary: formatSalary(job.salaryRange?.min, job.salaryRange?.max),
          techStack: job.technologies.map((tech: any) => tech.name).join(", "),
          timePosted: new Date(job.postedDate).toLocaleDateString(),
          avatar: job.company?.avatar || "",
          isHot: job.isUrgent,
          applicationDeadline: new Date(job.applicationDeadline),
          isNew:
            Date.now() - new Date(job.postedDate).getTime() <
            7 * 24 * 60 * 60 * 1000,
        }));

        setJobs(formattedJobs);
        setTotalPagesJobs(result.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchFaveritedJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/favorites?job_seeker_id=${userData.jobSeekerId}&page=${currentFavertiedPageJobs}&limit=${limit}`
      );
      const result: ApiResponse = await response.json();
  
      if (!result.error && Array.isArray(result.data?.docs)) {
        const formattedJobs = result.data.docs.map((job: any) => {
          const jobDetails = job.job_id; // Truy cập vào job_id để lấy thông tin
  
          // Log ra ID của favorite và job_id
          console.log("Favorite ID:", job._id);
          console.log("Job ID:", jobDetails?._id);
  
          return {
            id_job: jobDetails?._id,
            id: job._id,
            title: jobDetails?.title || "",
            company: jobDetails?.company?.company_name || "",
            location: jobDetails?.location?.[0]?.name || "",
            salary: jobDetails?.salaryRange
              ? formatSalary(
                  jobDetails.salaryRange.min,
                  jobDetails.salaryRange.max
                )
              : "N/A",
            techStack: Array.isArray(jobDetails?.technologies)
              ? jobDetails.technologies.map((tech: any) => tech.name).join(", ")
              : "",
            timePosted: jobDetails?.postedDate
              ? new Date(jobDetails.postedDate).toLocaleDateString()
              : "N/A",
            avatar: jobDetails?.company?.avatar || "",
            isHot: jobDetails?.isUrgent || false,
            isNew: jobDetails?.postedDate
              ? Date.now() - new Date(jobDetails.postedDate).getTime() <
                7 * 24 * 60 * 60 * 1000
              : false,
          };
        });
  
        setFavertiedJobs(formattedJobs);
        setTotalFavertiedPagesJobs(result.data.totalPages);
      } else {
        console.warn(
          "No valid job data found or result.data.docs is not an array"
        );
        setFavertiedJobs([]); // Reset danh sách về mảng rỗng nếu không có dữ liệu
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Re-fetch jobs and related data when searchParams, page or favorite page changes
    fetchFaveritedJobs();
    fetchJobs();

    fetchTopCompanies();
  }, [searchParams, currentPageJobs, currentFavertiedPageJobs, limit]); // Include currentFavertiedPageJobs here

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

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
  };

  const handleFavertiedPageChange = (newPage: number) => {
    setCurrentFavertiedPageJobs(newPage); // Update the current page
  };
  return {
    jobs,
    recommendedJobs,
    topCompanies,
    favertiedJobs,
    loading,
    currentPageJobs,
    totalPagesJobs,
    currentFavertiedPageJobs,
    totalFavertiedPagesJobs,

    setSearchParams: updateSearchParams,
    handlePageChange, // Expose page change function
    handleFavertiedPageChange, // Expose page change function
  };
};
