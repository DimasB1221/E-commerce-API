import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin0nly } from "../middleware/authMiddleware.js";

const router = express.Router();

// register user
router.post("/register", register);

// login user / admin
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

router.get("/admin", admin0nly, protect);

export default router;
