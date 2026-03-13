import mongoose from "mongoose";

const connectDB = async () =>{
  try {
      const promise = await mongoose.connect(process.env.MONGOURI, {
          dbName: process.env.APP_NAME
      });
      console.log(`\nConnected to MongoDB! MONGODB_URI: ${promise.connections[0]?._connectionString || process.env.MONGOURI}`);
      return promise
  } catch (error) {
        console.error("MongoDB connection ERROR: ", error);
        process.exit(1)
  }
}

export default connectDB
