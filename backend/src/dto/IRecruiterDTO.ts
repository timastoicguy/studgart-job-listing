import { ICompanyDTO } from "./ICompanyDTO";
import { IUserDTO } from "./user.dto";

export interface IRecruiterDTO {
  _id: string;
  status: string;
  created_at: Date;
  user: IUserDTO;
  company: ICompanyDTO;
}
