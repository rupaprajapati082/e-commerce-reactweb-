const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist = async ({userId, item}) =>{
    let wishlist = await wishlistModel.findOne({userId});

    if(!wishlist) {
        wishlist = new wishlistModel({userId, productIds: []});
    }

    // Convert to string for comparison to avoid duplicate ObjectIds
    const exists = wishlist.productIds.some(id => id.toString() === item.toString());
    
    if (!exists) {
        wishlist.productIds.push(item);
    }
    
    return await wishlist.save();
}

// get wishlist
module.exports.GetWishlist = async ({userId}) => {
    return await wishlistModel.findOne({userId}).populate('productIds');
}

// remove from wishlist
module.exports.RemoveFromWishlist = async ({userId, item}) => {
    let wishlist = await wishlistModel.findOne({userId});
    if (wishlist) {
        wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== item.toString());
        return await wishlist.save();
    }
    return null;
}