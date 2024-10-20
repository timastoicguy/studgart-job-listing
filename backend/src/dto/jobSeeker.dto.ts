import { IUserDTO } from "./user.dto";

export interface IJobSeekerDTO {
  _id: string;
  user: IUserDTO;
  resume: string;
  experience: string;
  education: string;
  skills: string[];
  linkedin_profile?: string;
  portfolio_url?: string;
  desired_salary?: string;
  availability?: string;
  languages?: string[];
  certifications?: string[];
  created_at: Date;
}
