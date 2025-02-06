import mongoose from "mongoose";

const DBConnection = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in DB Connection:", error.message);
    } else {
      console.log("Unexpected error:", error);
    }
  }
}

export default DBConnection;
