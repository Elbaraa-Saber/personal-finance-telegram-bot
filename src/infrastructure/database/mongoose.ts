import mongoose from "mongoose";
import { config } from "../../config/env";

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(config.mongoUri);

  console.log("✅ Connected to MongoDB");
}