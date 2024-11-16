// models/DiamondConversion.ts
import mongoose, { Schema, Document } from "mongoose";

interface IDiamondConversion extends Document {
  type: number;
  currency: string; // Loại tiền tệ, ví dụ: VND, USD
  rate: number; // Tỷ lệ quy đổi (ví dụ: 10.000 VND = 1 kim cương)
}

const diamondConversionSchema = new Schema<IDiamondConversion>({
  type: { type: Number, default: 1, unique: true },
  currency: { type: String, default: "VND" },
  rate: { type: Number, default: 10000 }, // 10,000 VND = 1 kim cương
});

export const DiamondConversion = mongoose.model<IDiamondConversion>(
  "DiamondConversion",
  diamondConversionSchema
);
