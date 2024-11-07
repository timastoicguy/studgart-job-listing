// menuData.ts

// Định nghĩa interface cho MenuItem
export interface MenuItem {
  label: string;
  action?: () => void;
  href?: string;
  dropdownItems?: MenuItem[];
}

// Lấy userData và userId từ localStorage
const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const userId = userData.id;  // Lấy userId từ localStorage

// Định nghĩa các lựa chọn menu cho từng vai trò
export const roleOptions: Record<string, MenuItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Settings", href: "/admin/settings" },
    { 
      label: "Account", 
      href: "/admin/accountall", 
      dropdownItems: [
        { label: "Account Company", href: "/admin/account/company" },
        { label: "Account Jobseeker", href: "/admin/account/jobseeker" }
      ]
    },
  ],
  job_seeker: [
    { label: "Profile", href: userId ? `/jobseeker/profile/${userId}` : "/jobseeker/profile" },  // Kiểm tra userId ở đây
    { label: "Job Listings", href: "/jobseeker/jobs" },
  ],
  jobposter: [
    { label: "Post a Job", href: "/jobposter/post" },
    { label: "My Jobs", href: "/jobposter/my-jobs" },
  ],
  company: [
    { label: "Company Profile", href: "/company/profile" },
    { label: "Job Postings", href: "/company/jobs" },
  ],
};
