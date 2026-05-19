import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MongoDB URI missing. Set MONGO_URI or MONGODB_URI.");
  }

  const conn = await mongoose.connect(mongoURI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
