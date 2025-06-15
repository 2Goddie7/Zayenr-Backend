import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

mongoose.set("strictQuery", true);

console.log("URI: ",process.env.MONGODB_URI_ATLAS);

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_ATLAS);
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
  }
};

export default connection;
