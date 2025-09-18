import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const authHeader = await req.headers.authorization;
  if (!authHeader) {
    res.status(404).json({ message: "Token not found" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const admin0nly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You are not an admin" });
  }
};
