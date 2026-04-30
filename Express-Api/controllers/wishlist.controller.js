const wishlistService = require("../services/wishlist.service");

// add item to wishlist
module.exports.AddToWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const {item} = req.body;

        // Check if already in wishlist to provide better feedback
        const existingWishlist = await wishlistService.GetWishlist({userId});
        const isDuplicate = existingWishlist && existingWishlist.productIds.some(p => p._id.toString() === item.toString());

        if (isDuplicate) {
            return res.status(200).json({message: "Product is already in your wishlist! ❤️"});
        }

        const wishlist = await wishlistService.AddToWishlist({userId, item});

        if(!wishlist){
            return res.status(404).json({message: "Product Not Found !!"})
        }

        return res.status(200).json({message: "Added to wishlist! ❤️", wishlist})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// get wishlist
module.exports.GetWishlist = async(req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await wishlistService.GetWishlist({userId});
        
        // Filter out any nulls that might occur if products were deleted or schema was mismatched
        const products = wishlist ? wishlist.productIds.filter(p => p !== null) : [];

        return res.status(200).json({
            message: "Wishlist Found", 
            products: products
        });
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// remove from wishlist
module.exports.RemoveFromWishlist = async(req, res) => {
    try {
        const userId = req.user.id;
        const {item} = req.body;
        
        await wishlistService.RemoveFromWishlist({userId, item});
        return res.status(200).json({message: "Item removed from wishlist"});
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}