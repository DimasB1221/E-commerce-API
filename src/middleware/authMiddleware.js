import jwt from "jsonwebtoken";
import "dotenv/config";
import { Users } from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(404).json({ message: "Token not found" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  try {
    // jwt.verify tidak support promise secara native, jadi bungkus dengan Promise
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const admin0nly = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const userExist = await Users.findOne({ email, name });
    if (!userExist || role !== "admin") {
      const error = new Error("You are not an admin");
      throw error;
    }
    res.json({ message: "You are an admin" });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
  next();
};
