import mongoose from "mongoose";

// Connect to MongoDB
const conn = await mongoose.createConnection(process.env.MONGO_URI).asPromise();
conn.readyState;
