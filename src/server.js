import connectDB from "./config/db.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import "dotenv/config";

// Connect to MongoDB
connectDB();
const app = express();

app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);

// product routes
app.use("/api/products", productRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
