// product creation
// product read single and all
// product update
// product delete

const express = require("express");
const userMiddleware = require("../../../middlewares/user.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");
const productController = require("../../../controllers/product.controller");
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// create product
router.post(
  "/add",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  upload.array('images', 5),
  productController.CreateProduct,
);
// authUser ==> check user login or not? ==> if login then --> req.user (give you back)
// authAdmin ==> req.user ==> check role ==> Admin or not? --> jump to next router

// all product
router.get(
  "/all",
  productController.GetAllProducts,
);

// single product
router.get(
  "/:id",
  userMiddleware.authUser,
  productController.GetSingleProduct,
);

// update product
router.put(
  "/:id",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  upload.array('images', 5),
  productController.UpdateProduct,
);

// delete product
router.delete(
  "/:id",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  productController.DeleteProduct,
);

module.exports = router;
