import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IUser extends Document {
  username?: string;
  passwordHash: string;
  email: string;
  phone?: string;
  fullName?: string;
  role: "job_seeker" | "recruiter" | "admin" | "company";
  profilePicture?: string;
  address?: string;
  bio?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  googleId?: string;
  balance?: number; // Số dư hiện tại (kim cương)
  rank?: string; // Hạng (Sắt, Đồng, Bạc, Vàng, Kim Cương)
  diamonds?: number; // Số kim cương hiện tại
  totalSpent?: number; // Tổng số tiền đã chi
  transactions?: mongoose.Types.ObjectId[];
  freeDiamonds: number;
}

const userSchema = new Schema<IUser>({
  username: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  fullName: { type: String },
  role: {
    type: String,
    enum: ["job_seeker", "recruiter", "admin", "company"],
    default: "job_seeker",
  },
  profilePicture: { type: String, default: "" }, // Default to an empty string or a placeholder URL
  address: { type: String },
  bio: { type: String, default: "" }, // Default to an empty string
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  googleId: { type: String },
  balance: { type: Number, default: 0 },
  rank: { type: String, default: "Sắt" },
  diamonds: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  freeDiamonds: { type: Number, default: 2 },
});

// Middleware to update the `updatedAt` field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
