module.exports.authAdmin = (req, res, next) =>{
   const user = req.user;

   // check user or user role (case-insensitive)
   if(!user || user.role?.toLowerCase() !== "admin"){
     return res.status(403).json({message: "Access Denied !"})
   }

   next();
}