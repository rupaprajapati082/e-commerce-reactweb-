const express = require("express");
const router = express.Router();
const paymentController = require("../../../controllers/payment.controller");
const { authUser } = require("../../../middlewares/user.middleware");

router.post("/create-checkout-session", authUser, paymentController.CreateCheckoutSession);

module.exports = router;
