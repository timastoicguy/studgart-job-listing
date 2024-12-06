/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import useAuthStore from "@/store/auth/useAuthStore";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  techStack: string;
  timePosted: string;
  avatar: string;
  isHot?: boolean;
  isNew?: boolean;
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
  isHot?: boolean;
  isNew?: boolean;
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

export interface User {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
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
  const { userData } = useAuthStore(); // Truy cập thông tin người dùng từ store

  const [jobs, setJobs] = useState<Job[]>([]);
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
        // Map over the companies to format and fetch additional user data
        const formattedTopCompanies = await Promise.all(
          result.data.topCompanies.map(async (company: any) => {
            const avatar = await fetchUserData(company.company.user_id); // Fetch user data based on user_id

            return {
              id: company.company._id,
              name: company.company.company_name,
              avatar: avatar?.profilePicture || company.company.logo || "", // Use user profile picture or company logo
              location: company.company.contact_email,
              openings: company.jobCount,
            };
          })
        );
  
        setTopCompanies(formattedTopCompanies);
        //console.log("User Data1111:", formattedTopCompanies);
      } else {
        console.error("Failed to fetch top companies:", result);
        setTopCompanies([]);
      }
    } catch (error) {
      console.error("Failed to fetch top companies:", error);
      setTopCompanies([]);
    }
  };
  

   const fetchUserData = async (userId: string): Promise<User | null> => {
    try {
      const response = await axios.get<{ data: User }>(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`);

      return response.data.data; // Assuming data is nested within response
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };
  const fetchCompanyData = async (userId: string): Promise<any | null> => {
    try {
      const response = await axios.get<{ data: User }>(`${import.meta.env.VITE_API_BASE_URL}/api/companies/${userId}`);

      //console.log("User Data:3323", response.data);
      return response.data.data; // Assuming data is nested within response
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };
  const fetchUserAvatar = async (userId: string): Promise<string> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
      );
      const data = await response.json();
      return data.data?.profilePicture || "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png";

    } catch (error) {
      console.error(`Failed to fetch avatar for user ${userId}:`, error);
      return "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png"; // Fallback avatar
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
        const formattedRecommendedJobs = await Promise.all(
          result.data.jobs.map(async (job: any) => {
            const companyId = job.company?.user_id;
            const avatar = companyId
              ? await fetchUserAvatar(companyId)
              : "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png";
  
            return {
              id: job._id,
              title: job.title,
              company: job.company?.company_name || "",
              location: job.location[0]?.name || "",
              salary: formatSalary(job.salaryRange?.min, job.salaryRange?.max),
              techStack: job.technologies.map((tech: any) => tech.name).join(", "),
              timePosted: new Date(job.postedDate).toLocaleDateString(),
              avatar,
              isHot: job.isUrgent,
              isNew:
                new Date().getTime() - new Date(job.postedDate).getTime() <
                7 * 24 * 60 * 60 * 1000,
            };
          })
        );
  
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
  
      // Add page and limit to query if not already present
      if (!query.has("page")) {
        query.set("page", currentPageJobs.toString());
      }
      if (!query.has("limit")) {
        query.set("limit", limit.toString());
      }
  
      const queryString = query.toString();
      //console.log(queryString);
  
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs?${queryString}`
      );
      const result: ApiResponse = await response.json();
  
  
      if (!result.error) {
        // Fetch avatar for each company
        const formattedJobs = await Promise.all(
          result.data.docs.map(async (job: any) => {
            let avatar = job.company?.logo || "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png"; // Default to company logo if available
            if (job.company?.user_id) {
              const userData = await fetchUserData(job.company.user_id);
              avatar = userData?.profilePicture || avatar; // Use user profile picture if available
            }
            return {
              id: job._id,
              title: job.title,
              company: job.company?.company_name || "",
              location: job.location[0]?.name || "",
              salary: formatSalary(job.salaryRange?.min, job.salaryRange?.max),
              techStack: job.technologies.map((tech: any) => tech.name).join(", "),
              timePosted: new Date(job.postedDate).toLocaleDateString(),
              avatar, // Set the resolved avatar
              isHot: job.isUrgent,
              isNew:
                Date.now() - new Date(job.postedDate).getTime() <
                7 * 24 * 60 * 60 * 1000, // Check if the job is new
            };
          })
        );
  
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
        }/api/favorites?job_seeker_id=${userData.job_seeker_id}&page=${currentFavertiedPageJobs}&limit=${limit}`
      );
      const result: ApiResponse = await response.json();
  
      if (!result.error && Array.isArray(result.data?.docs)) {
        // Fetch avatar for each favorite job
        const formattedJobs = await Promise.all(
          result.data.docs.map(async (favorite: any) => {
            const jobDetails = favorite.job_id;
  
            // Default avatar
            let avatar = jobDetails?.company?.logo || 
                         "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png";
  
            // Fetch user profile picture if company user_id exists
            if (jobDetails?.company) {
              const companyData = await fetchCompanyData(jobDetails.company);
              //console.log("Company Data: ", companyData);
              avatar = companyData?.user_id?.profilePicture || avatar;
            }
  
            return {
              id_job: jobDetails?._id || "",
              id: favorite._id || "",
              title: jobDetails?.title || "N/A",
              company: jobDetails?.company?.company_name || "Unknown",
              location: jobDetails?.location?.[0]?.name || "Unknown",
              salary: jobDetails?.salaryRange
                ? formatSalary(
                    jobDetails.salaryRange.min,
                    jobDetails.salaryRange.max
                  )
                : "N/A",
              techStack: Array.isArray(jobDetails?.technologies)
                ? jobDetails.technologies.map((tech: any) => tech.name).join(", ")
                : "N/A",
              timePosted: jobDetails?.postedDate
                ? new Date(jobDetails.postedDate).toLocaleDateString()
                : "Unknown",
              avatar, // Resolved avatar
              isHot: jobDetails?.isUrgent || false,
              isNew: jobDetails?.postedDate
                ? Date.now() - new Date(jobDetails.postedDate).getTime() <
                  7 * 24 * 60 * 60 * 1000
                : false,
            };
          })
        );
  
        setFavertiedJobs(formattedJobs);
        setTotalFavertiedPagesJobs(result.data.totalPages);
      } else {
        console.warn("No valid job data found or result.data.docs is not an array");
        setFavertiedJobs([]); // Reset list to empty array if no data
      }
    } catch (error) {
      console.error("Failed to fetch favorite jobs:", error);
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
