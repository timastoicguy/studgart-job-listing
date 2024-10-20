// DTO for creating a job
export class CreateJobDTO {
  title!: string;
  description!: string;
  responsibilities!: string[];
  requirements!: string[];
  skills!: string[];
  location!: string;
  salaryRange!: { min: number; max: number };
  company!: string; // company ID
  jobCategory!: string; // jobCategory ID
  recruiter_id!: string; // recruiter ID
  programmingLanguages!: string[]; // Array of programmingLanguage IDs
  technologies!: string[]; // Array of technology IDs
  employmentType!:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "freelance"
    | "temporary";
  experienceLevel!:
    | "entry"
    | "midle"
    | "senior"
    | "lead"
    | "intern"
    | "fresher"
    | "junior";
  applicationDeadline!: Date;
  benefits?: string[];
  numberOfVacancies?: number;
}

// DTO for updating a job
export class UpdateJobDTO {
  title?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  location?: string;
  salaryRange?: { min: number; max: number };
  company?: string;
  jobCategory?: string;
  recruiter_id?: string;
  programmingLanguages?: string[];
  technologies?: string[];
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "freelance"
    | "temporary";
  experienceLevel?:
    | "entry"
    | "midle"
    | "senior"
    | "lead"
    | "intern"
    | "fresher"
    | "junior";
  applicationDeadline?: Date;
  benefits?: string[];
  numberOfVacancies?: number;
}
