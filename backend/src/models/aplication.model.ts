import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface IApplication extends Document {
  job_id: mongoose.Types.ObjectId;
  job_seeker_id: mongoose.Types.ObjectId;
  cover_letter: string;
  resume: string;
  job_reviewer_id: mongoose.Types.ObjectId;
  application_status: string;
  interview_date: Date;
  offer_details: string;
  applied_at: Date;
}

const ApplicationSchema: Schema = new Schema({
  job_id: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  job_seeker_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "JobSeeker",
  },
  cover_letter: { type: String, required: true },
  resume: { type: String, required: true },
  job_reviewer_id: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  application_status: {
    type: String,
    enum: ["reviewed", "pending", "accepted", "offered", "rejected"],
    default: "pending",
  },
  interview_date: { type: Date },
  offer_details: { type: String },
  applied_at: { type: Date, default: Date.now },
});

// Add pagination plugin
ApplicationSchema.plugin(mongoosePaginate);

const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);

export default Application;
