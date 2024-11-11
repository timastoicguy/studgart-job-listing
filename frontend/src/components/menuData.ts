// menuData.ts

// Interface for MenuItem
export interface MenuItem {
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
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Settings", href: "/admin/settings" },
    { 
      label: "Account", 
      href: "/admin/accountall", 
      dropdownItems: [
        { label: "Account Company", href: "/admin/account/company" },
        { label: "Account Jobseeker", href: "/admin/account/jobseeker" },
      ],
    },
  ],
  job_seeker: [
    { 
      label: "Profile", 
      href: userId ? `/jobseeker/profile/${userId}` : "/jobseeker/profile",
      dropdownItems: [
        { label: "Account Company", href: "/admin/account/company" },
        { label: "Account Jobseeker", href: "/admin/account/jobseeker" },
      ],
    }, 
    { label: "Job Listings", href: "/jobseeker/jobs" },
  ],
  recruiter: [
    { label: "Post Job", href: "/recruiter/postjob" },
    { label: "My Jobs", href: "/recruiter/my-jobs" },
  ],
  company: [
    { label: "Company Profile", href: "/company/profile" },
    { label: "Job Postings", href: "/company/jobs" },
  ],
};
