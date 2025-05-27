// models/JobType.ts
import { Schema, model } from "mongoose";

const jobTypeSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  priority: { type: Number, default: 1 },



  
});

export const JobType = model("JobType", jobTypeSchema);
