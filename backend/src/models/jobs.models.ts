import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ITFilterItem {
  name: string;
  code: string;
}

export interface IJob extends Document {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  location: ITFilterItem[];
  salaryRange: { min: number; max: number };
  company: mongoose.Schema.Types.ObjectId;
  jobCategory: mongoose.Schema.Types.ObjectId;
  recruiter: mongoose.Schema.Types.ObjectId;
  employmentPosions: ITFilterItem[];
  technologies: ITFilterItem[];
  employmentType: ITFilterItem[];
  experienceLevel: ITFilterItem[];
  postedDate: Date;
  updatedDate: Date;
  applicationDeadline: Date;
  status: "pending" | "accepted" | "rejected" | "canncel";
  numberOfVacancies: number;
  isUrgent: boolean;
}

const jobSchema = new Schema<IJob>({
  title: { type: String },

  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  description: { type: String },
  responsibilities: { type: [String] },
  requirements: { type: [String] },
  skills: { type: [String] },
  location: {
    type: [
      {
        _id: false,
        name: { type: String },
        code: { type: String },
      },
    ],
    default: [],
  },
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCategory",
  },
  technologies: {
    type: [
      {
        _id: false,
        name: { type: String }, // Technology name
        code: { type: String },
      },
    ],
    default: [],
  },
  employmentType: {
    type: [
      {
        _id: false,
        name: { type: String }, // Technology name
        code: { type: String }, // Technology code
      },
    ],
    default: [],
  },
  experienceLevel: {
    type: [
      {
        _id: false,
        name: { type: String }, // Technology name
        code: { type: String }, // Technology code
      },
    ],
    default: [],
  },
  employmentPosions: {
    type: [
      {
        _id: false,
        name: { type: String }, // Technology name
        code: { type: String }, // Technology code
      },
    ],
    default: [],
  },

  postedDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  applicationDeadline: { type: Date },
  benefits: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "canncel"],
    default: "pending",
  },
  numberOfVacancies: { type: Number, default: 1 },
  isUrgent: { type: Boolean, default: false },
});

// Add pagination plugin
jobSchema.plugin(mongoosePaginate);
const Job = mongoose.model<IJob>("Job", jobSchema);
export default Job;
