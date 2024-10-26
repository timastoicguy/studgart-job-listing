/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string; // This will be formatted as a range
  techStack: string; // Comma-separated technologies
  timePosted: string; // Formatted date string
  avatar: string; // Company avatar URL
  isHot: boolean; // To determine if a job is urgent
  isNew: boolean; // To determine if a job is new
}

interface Company {
  id: string;
  name: string;
  avatar: string; // Company avatar URL
  location: string;
  openings: number;
}

interface ApiResponse {
  data: {
    docs: any[]; // Define this more precisely if possible
    recommendedJobs: Job[];
    topCompanies: Company[];
  };
  error?: string; // Handle potential errors
}

interface FetchJobsReturn {
  jobs: Job[];
  recommendedJobs: Job[];
  topCompanies: Company[];
  loading: boolean;
}

export const useFetchJobs = (): FetchJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const formatSalary = (min: number, max: number) => {
    return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`; // Formatting with commas and VNĐ
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/jobs?page=1&limit=10');
        const result: ApiResponse = await response.json();

        if (!result.error) {
          const formattedJobs = result.data.docs.map((job: any) => ({
            id: job._id,
            title: job.title,
            company: job.company.company_name, // Accessing the company name
            location: job.location[0]?.name || '', // Accessing the location name
            salary: formatSalary(job.salaryRange.min, job.salaryRange.max), // Using the formatSalary function
            techStack: job.technologies.map((tech: any) => tech.name).join(', '), // Joining technologies into a string
            timePosted: new Date(job.postedDate).toLocaleDateString(), // Formatting posted date
            avatar: job.company.avatar || '', // Assuming there's an avatar URL; adjust if necessary
            isHot: job.isUrgent,
            isNew: new Date().getTime() - new Date(job.postedDate).getTime() < 7 * 24 * 60 * 60 * 1000 // Job is new if posted in the last 7 days
          }));

          setJobs(formattedJobs);
          setRecommendedJobs(result.data.recommendedJobs || []);
          setTopCompanies(result.data.topCompanies || []);
          console.log("Fetched jobs data:", formattedJobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, recommendedJobs, topCompanies, loading };
};
