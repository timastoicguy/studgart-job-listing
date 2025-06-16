// models/JobLevel.ts
import { Schema, model } from "mongoose";

const jobLevelSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  priority: { type: Number, default: 1 },
});

export const JobLevel = model("JobLevel", jobLevelSchema);
