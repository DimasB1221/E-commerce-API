import Cart from "../models/Cart.js";

// add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    // cek apakah user sudah mempunyai cart
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
      await cart.save();
      return res.status(201).json(cart);
      //   cek apakah user sudah mempunyai product di cart
    } else {
      const itemIndex = await cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (itemIndex > -1) {
        // product sudah ada di cart maka update quantity
        cart.products[itemIndex].quantity += quantity;
      } else {
        //  product belum ada di cart maka tambahkan product baru
        cart.products.push({ product: productId, quantity });
      }
      await cart.save();
      return res.status(200).json(cart);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "products.product",
      "name price"
    );
    if (!cart) {
      const error = new Error("Cart not found");
      throw error;
    }
    return res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// updateCart
export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // product already exists in cart, update quantity
      cart.products[itemIndex].quantity += quantity;
    } else {
      // product doesn't exist in cart, add new product
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Remove item from cart
export const removeCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const quantityToRemove = req.body.quantity;

    const cart = await Cart.findOneAndUpdate({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === req.params.id
    );

    if (itemIndex > -1) {
      // product already exists in cart, update quantity
      cart.products[itemIndex].quantity -= quantityToRemove;
    }

    if (cart.products.length === 0) {
      // Jika keranjang kosong, hapus keranjang
      await Cart.findOneAndDelete({ user: userId });
      return res.status(200).json({ message: "Cart deleted successfully" });
    }

    await cart.save();

    return res
      .status(200)
      .json({ message: "Product deleted successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
