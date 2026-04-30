const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }
  ],
});

module.exports = mongoose.model("wishlist", WishlistSchema);