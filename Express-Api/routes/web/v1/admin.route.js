const express = require("express");
const router = express.Router();
const middleware = require("../../../middlewares/admin.middleware");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
const orderController = require("../../../controllers/order.controller");
const { body } = require("express-validator");

// show all users
// login user --> check user is Admin? --> show all users
router.get(
  "/all/user",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllUser,
);

// Delete User
router.delete(
  "/user/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.deleteUser,
);

// update role -- create manager
// router -- service -- controller -- call into router
router.put(
  "/user/:id/role",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.updateUserRole,
);

// Get all orders for admin
router.get(
  "/orders",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.getAllOrders,
);

// Update order status
router.put(
  "/order-status/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  orderController.UpdateOrderStatus
);

module.exports = router;
