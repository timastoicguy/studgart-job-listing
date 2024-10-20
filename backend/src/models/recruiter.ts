import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IUser } from "./User";
import { ICompany } from "./Company";

export interface IRecruiter extends Document {
  user_id: mongoose.Types.ObjectId;
  company_id: mongoose.Types.ObjectId;
  status: string;
  created_at: Date;
  user: IUser;
  company: ICompany;
}

const recruiterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  status: {
    type: String,
    enum: ["lock", "unlock", "pending"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

// Add pagination plugin
recruiterSchema.plugin(mongoosePaginate);

export const Recruiter = mongoose.model("Recruiter", recruiterSchema);
