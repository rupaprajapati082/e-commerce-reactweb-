module.exports.allowRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user || roles.includes(req.user.role)){
            throw new Error("Access denied !!!");
        }
        next();
    };
};