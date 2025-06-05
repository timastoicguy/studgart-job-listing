/* eslint-disable @typescript-eslint/no-unused-vars */
// menuData.ts

// Interface for MenuItem
export interface MenuItem {
  name: string;
  label: string;
  action?: () => void;
  href?: string;
  dropdownItems?: MenuItem[];
  target?: string; // Thêm target
  rel?: string;    // Thêm rel
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
    { name: "Tổng quan", label: "Tổng quan", href: "/admin/dashboard" },
    { name: "Tài khoản", label: "Tài khoản", href: "/admin/accountall" },
    { name: "Giao dịch", label: "Giao dịch", href: "/admin/transactionmanual" },
  ],
  job_seeker: [
    { name: "Tuyển dụng IT", label: "Tuyển dụng IT", href: "/jobseeker/jobs" },
    { name: "Việc làm đã lưu", label: "Việc làm đã lưu", href: `/jobseeker/favoritejobs` },
    { 
      name: "Tạo CV tự động", 
      label: `Tạo CV tự động`, 
      href: `${import.meta.env.VITE_REACT_BASE_URL2}`,
      target: "_blank", // Mở trong tab mới
      rel: "noopener noreferrer", // Bảo mật
    },
  ],
  recruiter: [
    { name: "post_job", label: "Đăng bài tuyển dụng", href: "/recruiter/postjob" },
    { name: "my_jobs", label: "Bài đã đăng", href: "/recruiter/jobposted" },
  ],
  company: [
    { name: "Danh sách nhà tuyển dụng", label: "Danh sách nhà tuyển dụng", href: "/company/companyidentity" },
    { name: "Thêm nhà tuyển dụng", label: "Thêm nhà tuyển dụng", href: "/company/addcompanyidentity" },
  ],
};


// { 
//   name: "Trang chủ", 
//   label: "Trang chủ", 
//   href: userId ? `/profile/${userId}` : "/profile",
//   dropdownItems: [
//     { name: "account_company", label: "Account Company", href: "/admin/account/company" },
//     { name: "account_jobseeker", label: "Account Jobseeker", href: "/admin/account/jobseeker" },
//   ],
// }, 