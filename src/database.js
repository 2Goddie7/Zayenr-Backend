import moongose from "mongoose";

moongose.set("strictQuery", true);

console.log(process.env.MONGODB_URI_ATLAS);

const connection = async () => {
  try {
    await moongose.connect(process.env.MONGODB_URI_ATLAS);
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
  }
};

export default connection;
