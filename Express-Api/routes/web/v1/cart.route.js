const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const cartController = require("../../../controllers/cart.controller");

// add items
router.post("/add", userMiddleware.authUser, cartController.AddToCart);

// get all items
router.get("/all", userMiddleware.authUser, cartController.GetCart);

// remove single item from cart (DELETE by param)
router.delete("/product/:id", userMiddleware.authUser, cartController.RemoveItem);

// remove single item from cart (POST by body) - used by frontend Cart.jsx
router.post("/remove", userMiddleware.authUser, cartController.RemoveItemByBody);

module.exports = router;
