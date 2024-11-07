import mongoose, { Schema, Document } from "mongoose";

interface IExperience {
  id: number;
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  workSummery: string;
}

interface IEducation {
  id: number;
  universityName: string;
  startDate: string;
  endDate: string;
  degree: string;
  major: string;
  description: string;
}

interface ISkill {
  id: number;
  name: string;
  rating: number;
}

export interface IResume extends Document {
  title: string;
  resumeId: string;
  userEmail: string;
  userName: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
  summery: string;
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
}

const ResumeSchema: Schema = new Schema({
  title: { type: String, default: "" },
  resumeId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  userName: { type: String, default: "" },
  firstName: { type: String },
  lastName: { type: String },
  jobTitle: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  themeColor: { type: String },
  summery: { type: String },
  experience: [{ type: Object }],
  education: [{ type: Object }],
  skills: [{ type: Object }],
});

export default mongoose.model<IResume>("Resume", ResumeSchema);
