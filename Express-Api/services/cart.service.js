const cartModel = require("../models/cart.model");

// add item to cart
module.exports.addToCart = async ({ userId, item, overwrite }) => {
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    cart = new cartModel({ userId, items: [item] });
  } else {
    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === item.productId.toString()
    );

    if (existingItemIndex >= 0) {
      if (overwrite) {
        cart.items[existingItemIndex].quantity = item.quantity;
      } else {
        cart.items[existingItemIndex].quantity += item.quantity;
      }
    } else {
      cart.items.push(item);
    }
  }

  return await cart.save();
};

// get Cart
module.exports.GetCart = async (userId) => {
  const cart = await cartModel.findOne({ userId }).populate("items.productId");
  if (cart && cart.items) {
    // Safety check: Filter out any items where the productId is null (deleted from DB)
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId);
    if (cart.items.length !== originalLength) {
      await cart.save(); // Cleanup the cart in DB
    }
  }
  return cart;
};

// delete single product from cart
module.exports.RemoveSingleProduct = async ({ userId, productId }) => {
  // find login user cart
  let cart = await cartModel.findOne({ userId });

  if (!cart) throw new Error("Cart Not Found !!");

  // find index number of product based on productId
  const itemIndex = cart.items.findIndex(
    (i) => i.productId.equals(productId),
    // i --> that give items array
  );

  console.log(itemIndex);

  if (itemIndex < 0) {
    console.log(itemIndex, productId);
    throw new Error("Item not Found");
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();
};
