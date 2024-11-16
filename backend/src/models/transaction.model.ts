// models/Transaction.ts
import mongoose, { Schema, Document } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  amount: number; // Số tiền người dùng đã nạp
  diamonds: number; // Số kim cương quy đổi
  status: PaymentStatus; // Trạng thái giao dịch
  paymentMethod: string; // Phương thức thanh toán (chuyển khoản, VNPay, MoMo, ...)
  createdAt: Date;
  urlImage?: string;
}

const transactionSchema = new Schema<ITransaction>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  diamonds: { type: Number, required: true },
  status: { type: String, enum: PaymentStatus, default: PaymentStatus.PENDING },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  urlImage: { type: String },
});

transactionSchema.plugin(mongoosePaginate);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
