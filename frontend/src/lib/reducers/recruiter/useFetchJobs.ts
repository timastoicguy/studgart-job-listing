/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from "@/store/auth/useAuthStore";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { User } from "../jobseeker/useFetchJobs";
import axios from "axios";

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
  status?: string;
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
  setJobs: any;
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
  const { userData, roleIDs } = useAuthStore(); // Truy cập thông tin người dùng từ store
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
      const response = await axios.get<{ data: User }>(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
      );

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
      return (
        data.data?.profilePicture ||
        "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png"
      );
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
              techStack: job.technologies
                .map((tech: any) => tech.name)
                .join(", "),
              timePosted: new Date(job.postedDate).toLocaleDateString(),
              avatar,
              isHot: job.isUrgent,
              applicationDeadline: new Date(job.applicationDeadline),
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
        query.set("recruiter", `${roleIDs?.recruiter_id}`); // Giá trị recruiter mặc định
        console.log(roleIDs);
      }

      const queryString = query.toString();
      console.log(queryString);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs?${queryString}`
      );
      const result: ApiResponse = await response.json();

      if (!result.error) {
        // Fetch avatar for each company
        const formattedJobs = await Promise.all(
          result.data.docs.map(async (job: any) => {
            let avatar =
              job.company?.logo ||
              "https://joblisting2024a.blob.core.windows.net/imgs/09c6a2fb-a3fc-40f6-aa3a-51a5221c0573.png"; // Default to company logo if available
            if (job.company?.user_id) {
              const userData = await fetchUserData(job.company.user_id);
              avatar = userData?.profilePicture || avatar; // Use user profile picture if available
            }
            return {
              id: job._id,
              title: job.title,
              status: job.status,
              company: job.company?.company_name || "",
              location: job.location[0]?.name || "",
              salary: formatSalary(job.salaryRange?.min, job.salaryRange?.max),
              techStack: job.technologies
                .map((tech: any) => tech.name)
                .join(", "),
              timePosted: new Date(job.postedDate).toLocaleDateString(),
              applicationDeadline: new Date(job.applicationDeadline),
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

  useEffect(() => {
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
    setJobs,
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
