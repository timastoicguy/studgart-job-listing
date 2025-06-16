import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface IJobCategory extends Document {
  name: string;
  description: string;
  parent_category_id?: mongoose.Types.ObjectId;
}

const JobCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parent_category_id: { type: Schema.Types.ObjectId, ref: "JobCategory" },
});

JobCategorySchema.plugin(mongoosePaginate);

const JobCategory = mongoose.model<IJobCategory>(
  "JobCategory",
  JobCategorySchema
);
export default JobCategory;
