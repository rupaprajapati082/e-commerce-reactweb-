const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware")
const orderController = require("../../../controllers/order.controller")

// create order
router.post("/add", userMiddleware.authUser, orderController.CreateOrder)

// get order - show history or recent order
router.get("/all", userMiddleware.authUser, orderController.GetOrder)



// remove Items for Order



// Cancel Order




module.exports = router;