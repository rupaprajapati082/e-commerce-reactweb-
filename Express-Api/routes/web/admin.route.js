const express = require('express');
let router = express.Router();
let userMiddleware = require('../../middlewares/user.middleware');
let adminMiddleware = require('../../middlewares/admin.middleware');
let adminController = require('../../controllers/admin.controller');


//GET ALL USER
//router --->service -->controller ==>call another into router
router.get("/all" ,userMiddleware.authUser,adminMiddleware.authAdmin, adminController.AllUser);



//DELETE SINGLE USER
router.delete("/user/:id" ,userMiddleware.authUser,adminMiddleware.authAdmin,adminController.DeleteUser);


//CHANGE ROLE - CREATE MANAGER
router.put("/user/:id/role" ,userMiddleware.authUser,adminMiddleware.authAdmin,adminController.UpdateUserRole);
module.exports = router;