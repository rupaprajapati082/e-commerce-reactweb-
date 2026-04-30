const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");

// create order
module.exports.CreateOrder = async ({ userId, items, shippingDetails }) => {
  let totalAmount = 0;
  let orderItems = [];

  for (let item of items) {
    const product = await productModel.findOne({ _id: item.productId });

    if (!product) throw new Error(`Product ${item.productId} Not Found`);
    
    // Inventory Check
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    const itemsTotal = product.price * item.quantity;
    totalAmount += itemsTotal;

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
      total: itemsTotal,
    });

    // Inventory Service: Deduct Stock on purchase
    product.stock -= item.quantity;
    await product.save();
  }

  return await orderModel.create({
    userId,
    items: orderItems,
    totalbill: totalAmount,
    shippingDetails,
    paymentMethod: shippingDetails.paymentMethod || 'COD',
    status: "pending"
  });
};

// get order history
module.exports.GetOrder = async (userId) => {
  return await orderModel.find({ userId })
    .populate("items.productId")
    .sort({ createdAt: -1 });
};

// update order status
module.exports.UpdateOrderStatus = async (orderId, status) => {
  return await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate("items.productId");
};