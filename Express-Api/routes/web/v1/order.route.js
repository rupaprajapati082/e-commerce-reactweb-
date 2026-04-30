const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const orderController = require("../../../controllers/order.controller");

// create order (from cart)
router.post("/add", userMiddleware.authUser, orderController.CreateOrder);

// get all orders - history (both routes for compatibility)
router.get("/all", userMiddleware.authUser, orderController.GetOrder);
router.get("/user-orders", userMiddleware.authUser, orderController.GetOrder);

// update order status (admin)
router.put("/status/:id", userMiddleware.authUser, orderController.UpdateOrderStatus);

module.exports = router;