import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ICompany extends Document {
  user_id: mongoose.Types.ObjectId;
  company_size: string;
  profile_summary: string;
  company_history: string;
  company_name: string;
  company_description: string;
  company_website: string;
  company_logo: string;
  contact_email: string;
  contact_phone: string;
  company_address: string;
  industry: string;
  established_year: number;
  social_links: object;
  tax_number: string;
}

const CompanySchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company_size: { type: String },
  profile_summary: { type: String },
  company_history: { type: String },
  company_name: { type: String, required: true },
  company_description: { type: String },
  company_website: { type: String },
  company_logo: { type: String },
  contact_email: { type: String },
  contact_phone: { type: String },
  company_address: { type: String },
  industry: { type: String },
  established_year: { type: Number },
  social_links: { type: Schema.Types.Mixed },
  tax_number: { type: String },
});

// Tích hợp phân trang
CompanySchema.plugin(mongoosePaginate);

const Company = mongoose.model<ICompany>("Company", CompanySchema);
export default Company;
