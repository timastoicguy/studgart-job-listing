// models/Location.ts
import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  name: { type: String, required: true }, // Example: Ho Chi Minh
  code: { type: String, required: true, unique: true }, // Example: 'HCM' for Ho Chi Minh
  priority: { type: Number, default: 1 }, // Display priority
});

export const Location = model("Location", locationSchema);
