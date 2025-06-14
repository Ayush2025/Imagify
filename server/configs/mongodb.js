import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("Missing MONGODB_URI env var");

export default async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
}
