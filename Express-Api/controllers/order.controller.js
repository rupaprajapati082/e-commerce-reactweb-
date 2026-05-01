const orderService = require("../services/order.service");
const cartModel = require("../models/cart.model");
const userModel = require("../models/user.model");

// create order from cart
module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Use _id directly for reliable ObjectId matching
    const { shippingDetails, paymentMethod } = req.body;
    
    // Add paymentMethod to shippingDetails object for the service
    const shippingWithPayment = { ...shippingDetails, paymentMethod };

    // Fetch the user's cart with populated product data
    const cart = await cartModel.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        message: "Your cart is empty. Please add items to your cart before placing an order." 
      });
    }

    // Build items array from cart with safety filtering
    const items = cart.items
      .filter(item => item.productId) // Skip items where product was deleted
      .map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

    const order = await orderService.CreateOrder({ userId, items, shippingDetails: shippingWithPayment });

    // Sync user profile with shipping details if profile is empty
    const user = await userModel.findById(userId);
    if (user) {
      let needsUpdate = false;
      if (!user.phone && shippingDetails.phone) { user.phone = shippingDetails.phone; needsUpdate = true; }
      if (!user.address && shippingDetails.address) { 
        user.address = `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}`; 
        needsUpdate = true; 
      }
      if (needsUpdate) await user.save();
    }

    // Clear the cart after successful order
    cart.items = [];
    await cart.save();

    return res
      .status(200)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    console.error("CreateOrder Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// get order history
module.exports.GetOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderService.GetOrder(userId);

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found", orders: [] });
    }

    return res
      .status(200)
      .json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// update order status (admin)
module.exports.UpdateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await orderService.UpdateOrderStatus(orderId, status);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
