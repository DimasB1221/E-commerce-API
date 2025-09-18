import mongoose from "mongoose";
import autoIncrement from ("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    orders: { type: [mongoose.Schema.Types.ObjectId], ref: "Order" },
    cart: { type: [mongoose.Schema.Types.ObjectId], ref: "Product" },
  },
  { timestamps: true }
);
userSchema.plugin(autoIncrement, {inc_field: "_id"});
export const Users = mongoose.model("User", userSchema);
