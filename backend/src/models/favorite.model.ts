// models/Favorite.js
import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IFavorite extends Document {
  job_id: mongoose.Schema.Types.ObjectId;
  job_seeker_id: mongoose.Schema.Types.ObjectId;
  status: "saved" | "unsaved";
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  job_seeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSeeker",
    required: true,
  },
  status: {
    type: String,
    enum: ["saved", "unsaved"],
    default: "saved",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field automatically before saving
favoriteSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

favoriteSchema.plugin(mongoosePaginate);
const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;
