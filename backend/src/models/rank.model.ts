// models/Rank.ts
import mongoose, { Schema, Document } from "mongoose";

interface IRank extends Document {
  name: string;
  minDiamonds: number; // Số kim cương tối thiểu để đạt hạng này
  minTotalSpent: number;
  bonusMultiplier: number;
}

const rankSchema = new Schema<IRank>({
  name: { type: String, required: true, unique: true },
  minDiamonds: { type: Number, required: true },
  minTotalSpent: { type: Number, required: true },
  bonusMultiplier: { type: Number, required: true, default: 0 },
});

const Rank = mongoose.model<IRank>("Rank", rankSchema);
export default Rank;
