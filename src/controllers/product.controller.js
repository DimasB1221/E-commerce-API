// getAllProducts
import Products from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering parameters
    const { category, minPrice, maxPrice, search, sortBy, order } = req.query;

    // Build filter object
    const filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    // Get total count for pagination info
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch products with filters, pagination, and sorting
    const products = await Products.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Response with pagination metadata
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// getProductById
export const getProductById = async (req, res, next) => {
  try {
    const productId = await Products.findById(req.params.id);
    if (!productId) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(productId);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// createProduct - admin only
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, stock } = req.body;

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const productExist = await Products.findOne({ name });
    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }

    let imageUrl = null;
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce-products",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newProduct = await Products.create({
      name,
      price,
      description,
      category,
      stock,
      images: imageUrl || "default.jpg",
    });

    res.status(201).json(newProduct);
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
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
