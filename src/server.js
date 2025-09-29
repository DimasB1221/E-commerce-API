import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import "dotenv/config";

// Connect to MongoDB
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);

// product routes
app.use("/api/products", productRoutes);

// cart routes
app.use("/api/cart", cartRoutes);

// order routes
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
