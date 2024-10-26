// models/JobPosition.ts
import { Schema, model } from "mongoose";

const jobPositionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  priority: { type: Number, default: 1 },
});

export const JobPosition = model("JobPosition", jobPositionSchema);
