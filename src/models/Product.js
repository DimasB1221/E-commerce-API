import mongoose from "mongoose";
import connectDB from "../config/db.js";
import "dotenv/config";
import AutoIncrementFactory from "mongoose-sequence";
const AutoIncrement = AutoIncrementFactory(mongoose);
const productSchema = new mongoose.Schema(
  {
    _id: Number,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);
productSchema.plugin(AutoIncrement, { id: "product_seq", inc_field: "_id" });
export default mongoose.model("Product", productSchema);
