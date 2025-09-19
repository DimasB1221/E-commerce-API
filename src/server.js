import connectDB from "./config/db.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import "dotenv/config";

// Connect to MongoDB
connectDB();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
