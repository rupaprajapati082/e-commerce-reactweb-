const express = require("express");
const router = express.Router();
const categoryController = require("../../../controllers/category.controller");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminmiddleware = require("../../../middlewares/admin.middleware");

router.get("/all", categoryController.AllCategories);

router.post(
  "/add",
  usermiddleware.authUser,
  adminmiddleware.authAdmin,
  categoryController.CreateCategory
);

router.put(
  "/:id",
  usermiddleware.authUser,
  adminmiddleware.authAdmin,
  categoryController.UpdateCategory
);

router.delete(
  "/:id",
  usermiddleware.authUser,
  adminmiddleware.authAdmin,
  categoryController.DeleteCategory
);

module.exports = router;
