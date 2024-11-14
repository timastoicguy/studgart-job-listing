import { Schema, model } from "mongoose";

const mainTechnologySchema = new Schema({
  name: { type: String, required: true }, // Example: React, Node.js, Python, etc.
  code: { type: String, required: true, unique: true }, // Example: 'REACT' for React, 'NODE' for Node.js
  priority: { type: Number, default: 1 }, // Display priority
});

export const MainTechnology = model("MainTechnology", mainTechnologySchema);
