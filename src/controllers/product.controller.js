// getAllProducts
import Products from "../models/Product.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getProductById
export const getProductById = async (req, res, next) => {
  try {
    const productId = await Products.findById(req.params.id);
    if (!productId) {
      const err = new Error("Product not found");
      throw err;
    }
    res.status(200).json(productId);
    next();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// createProduct - admin only
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, stock, images } = req.body;
    if (!name || !price || !description || !category || !stock || !images) {
      const err = new Error("All fields are required");
      throw err;
    }
    const newProduct = await Products.create({
      name,
      price,
      description,
      category,
      stock,
      images,
    });
    res.status(201).json(newProduct);
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// updateProduct - admin only
export const updateProduct = async (req, res, next) => {
  try {
    const productId = await Products.findByIdAndUpdate(req.params.id);
    if (!productId) {
      const err = new Error("Product not found");
      throw err;
    }
    const { name, price, description, category, stock, images } = req.body;
    productId.name = name || productId.name;
    productId.price = price || productId.price;
    productId.description = description || productId.description;
    productId.category = category || productId.category;
    productId.stock = stock || productId.stock;
    productId.images = images || productId.images;

    await productId.save();
    res.status(200).json(productId);
    next();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// deleteProduct - admin only
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = await Products.findByIdAndDelete(req.params.id);
    if (!productId) {
      const err = new Error("Product not found");
      throw err;
    }
    res.status(200).json({ message: "Product deleted successfully" });
    next();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
