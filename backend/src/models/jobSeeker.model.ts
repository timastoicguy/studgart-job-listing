import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IJobSeeker extends Document {
  user: IUser;
  user_id: mongoose.Types.ObjectId; // Assuming user_id references the User model
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

const jobSeekerSchema = new Schema<IJobSeeker>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  resume: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  skills: { type: [String], required: true },
  linkedin_profile: { type: String, maxlength: 100 },
  portfolio_url: { type: String },
  desired_salary: { type: String },
  availability: { type: String },
  languages: { type: [String] },
  certifications: { type: [String] },
  created_at: { type: Date, default: Date.now },
});

// Add pagination plugin
jobSeekerSchema.plugin(mongoosePaginate);

export default mongoose.model<IJobSeeker>("JobSeeker", jobSeekerSchema);
