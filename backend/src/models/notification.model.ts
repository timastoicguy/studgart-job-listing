import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
interface INotification extends Document {
  userId: string;
  type:
    | "job_application_success"
    | "profile_viewed"
    | "application_status"
    | "nothing";
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "job_application_success",
        "profile_viewed",
        "application_status",
        "nothing",
      ],
      required: true,
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NotificationSchema.plugin(mongoosePaginate);
export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
