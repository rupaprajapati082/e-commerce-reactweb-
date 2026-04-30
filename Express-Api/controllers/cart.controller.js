const cartModel = require("../models/cart.model");
const cartService = require("../services/cart.service");

// Add To Cart
module.exports.AddToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, overwrite } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const cart = await cartModel.findOne({ userId });
    
    // Let the service handle existing products (it increments the quantity)

    const updatedCart = await cartService.addToCart({ 
      userId, 
      item: { productId, quantity: quantity || 1 },
      overwrite
    });

    return res.status(200).json({ 
      message: overwrite ? "Cart updated successfully" : "Item added to cart successfully", 
      cart: updatedCart 
    });
  } catch (error) {
    console.error("AddToCart Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get Cart
module.exports.GetCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await cartService.GetCart(userId);

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }

    return res
      .status(200)
      .json({ message: "Cart Data Fetch Successfully", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// remove single item from cart
module.exports.RemoveItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    await cartService.RemoveSingleProduct({ userId, productId });

    return res
      .status(200)
      .json({ message: "Remove Item from Cart Sucessfully " });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};// remove single item from cart (by body - used by frontend)
module.exports.RemoveItemByBody = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    await cartService.RemoveSingleProduct({ userId, productId });

    return res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
