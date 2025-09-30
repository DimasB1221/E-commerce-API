import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { getCart } from "../controllers/cart.controller.js";
import { updateCart } from "../controllers/cart.controller.js";
import { removeCart } from "../controllers/cart.controller.js";
import { admin0nly } from "../middleware/authMiddleware.js";
const router = express.Router();

// Add to cart

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCart);
router.delete("/:id", protect, admin0nly, removeCart);

export default router;
