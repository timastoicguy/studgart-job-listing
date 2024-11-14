// menuData.ts

// Interface for MenuItem
export interface MenuItem {
  name: string; // Add this line to include 'name' property
  label: string;
  action?: () => void;
  href?: string;
  dropdownItems?: MenuItem[];
}

// Function to get user data from localStorage
const getUserIdFromLocalStorage = (): string | null => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return userData?.id || null;  // Return userId if it exists, else null
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    return null;
  }
};

// Fetch the userId at runtime
const userId = getUserIdFromLocalStorage();

// Define menu options for each role
export const roleOptions: Record<string, MenuItem[]> = {
  admin: [
    { name: "dashboard", label: "Dashboard", href: "/admin/dashboard" },
    { name: "settings", label: "Settings", href: "/admin/settings" },
    { 
      name: "account", 
      label: "Account", 
      href: "/admin/accountall", 
      dropdownItems: [
        { name: "account_company", label: "Account Company", href: "/admin/account/company" },
        { name: "account_jobseeker", label: "Account Jobseeker", href: "/admin/account/jobseeker" },
      ],
    },
  ],
  job_seeker: [
    { 
      name: "profile", 
      label: "Profile", 
      href: userId ? `/jobseeker/profile/${userId}` : "/jobseeker/profile",
      dropdownItems: [
        { name: "account_company", label: "Account Company", href: "/admin/account/company" },
        { name: "account_jobseeker", label: "Account Jobseeker", href: "/admin/account/jobseeker" },
      ],
    }, 
    { name: "job_listings", label: "Job Listings", href: "/jobseeker/jobs" },
  ],
  recruiter: [
    { name: "post_job", label: "Post Job", href: "/recruiter/postjob" },
    { name: "my_jobs", label: "My Jobs", href: "/recruiter/my-jobs" },
  ],
  company: [
    { name: "company_profile", label: "Company Profile", href: "/company/profile" },
    { name: "job_postings", label: "Job Postings", href: "/company/jobs" },
  ],
};
