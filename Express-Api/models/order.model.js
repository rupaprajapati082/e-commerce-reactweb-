const mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    { 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, 
      quantity: Number, 
      price: Number, 
      total: Number 
    },
  ],
  totalbill: {
    type: Number,
  },
  shippingDetails: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    zip: String,
    phone: String
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("order", OrderSchema);
