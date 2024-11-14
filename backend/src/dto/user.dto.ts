export interface IUserDTO {
  _id: string;
  username?: string;
  email: string;
  phone?: string;
  fullName?: string;
  role: "job_seeker" | "recruiter" | "admin" | "company";
  profilePicture?: string;
  address?: string;
  bio?: string;
  lastLogin?: Date;
  isActive: boolean;
  isVerified: boolean;
}
