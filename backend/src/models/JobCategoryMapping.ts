import mongoose, { Schema, Document } from "mongoose";

interface IJobCategoryMapping extends Document {
  job_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
}

const JobCategoryMappingSchema: Schema = new Schema({
  job_id: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "JobCategory",
    required: true,
  },
});

const JobCategoryMapping = mongoose.model<IJobCategoryMapping>(
  "JobCategoryMapping",
  JobCategoryMappingSchema
);
export default JobCategoryMapping;
