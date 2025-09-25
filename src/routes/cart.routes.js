import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { getCart } from "../controllers/cart.controller.js";
import { updateCart } from "../controllers/cart.controller.js";
import { removeCart } from "../controllers/cart.controller.js";
const router = express.Router();

// Add to cart

router.post("/", protect, addToCart);
router.get("/", getCart);
router.put("/", protect, updateCart);
router.delete("/:id", protect, removeCart);

export default router;
