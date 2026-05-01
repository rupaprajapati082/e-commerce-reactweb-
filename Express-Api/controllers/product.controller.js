const productService = require("../services/product.service");
const productModel = require("../models/product.model");

// add new products
module.exports.CreateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct,
      sku,
      brand,
      category,
      sizes,
    } = req.body;

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => {
        const base64Image = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${base64Image}`;
      });
    } else if (req.body.images) {
      // Fallback to images from body if no files uploaded (e.g. if sending URLs)
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const isExist = await productModel.findOne({ sku: sku });

    if (isExist) {
      return res.status(400).json({ message: "Product Already Registered" });
    }

    const normalizedCategory = category ? category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : category;

    const product = await productService.createProduct({
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct: isNewProduct === 'true' || isNewProduct === true, // handle string from form-data
      sku,
      images,
      brand,
      category: normalizedCategory,
      sizes,
    });

    return res.status(200).json({ msg: "Product Added Successfully", product });
  } catch (error) {
    console.error("Error in CreateProduct:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// all products
module.exports.GetAllProducts = async (req, res) => {
  try {
    const products = await productService.AllProduct();

    if (!products) {
      return res.status(404).json({ message: "Products Not Found !!" });
    }

    return res.status(200).json({ message: "Fetch All Products:", products });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// single product
module.exports.GetSingleProduct = async (req, res) => {
  try {
    const product = await productService.singleProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found !!" });
    }

    return res.status(200).json({ message: "Product Found !!", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// update product
module.exports.UpdateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const {
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct,
      sku,
      brand,
      category,
      sizes,
    } = req.body;

    // Handle uploaded images if any
    let images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => {
        const base64Image = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${base64Image}`;
      });
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const normalizedCategory = category ? category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : category;

    const updatedProduct = await productService.updateProduct({
      productId,
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct: isNewProduct !== undefined ? (isNewProduct === 'true' || isNewProduct === true) : undefined,
      sku,
      images,
      brand,
      category: normalizedCategory,
      sizes,
    });

    return res
      .status(200)
      .json({ message: "Product Updated Successfully", updatedProduct });
  } catch (error) {
    console.error("Error in UpdateProduct:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// delete product
module.exports.DeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Not Found !!" });
    }

    return res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
