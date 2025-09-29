import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// createOrder

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Ambil cart user + populate produk biar bisa akses harga
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "price name"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    // 2. Siapkan data order
    const products = cart.products.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalPrice = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const orderData = {
      user: cart.user,
      products,
      totalPrice,
      status: "pending",
    };

    // 3. Simpan order
    const order = await Order.create(orderData);

    // 4. Kosongkan cart
    cart.products = [];
    await cart.save();

    // 5. Return response
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId }).populate(
      "products.product",
      "name price"
    );

    if (!orders) {
      return res.status(404).json({ message: "Orders not found" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    order.status = status;
    await order.save();
    return res
      .status(200)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
