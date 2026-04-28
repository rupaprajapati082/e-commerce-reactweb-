const express = require ('express');
const router = express.Router();
const userMiddleware = require('../../middlewares/user.middleware');
const roleMiddleware = require('../../middlewares/roles.middleware');
const productController = require('../../controllers/product.controller');
//create product
router.post("/add" , userMiddleware.authUser, roleMiddleware.allowRoles("admin" , "manager"),productController.CreateProduct,);

//get all products
router.get("/all" ,productController.GetAllProducts);

//get single product by id
 router.get("/:id",productController.GetSingleProduct);

//update product 
router.put("/:id", userMiddleware.authUser, roleMiddleware.allowRoles("admin,manager"),productController.UpdateProduct);

//delete product
router.delete("/:id", userMiddleware.authUser, roleMiddleware.allowRoles("admin"),productController.DeleteProduct);


module.exports = router;
