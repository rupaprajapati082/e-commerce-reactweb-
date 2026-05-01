const productModel = require("../models/product.model");

// create product
module.exports.createProduct = async ({
  name,
  description,
  stock,
  price,
  discount,
  isNewProduct,
  sku,
  images,
  brand,
  category,
  sizes,
}) => {
  if (
    !name ||
    !description ||
    stock === undefined ||
    price === undefined ||
    !sku ||
    !images ||
    !brand ||
    !category
  ) {
    throw new Error("All Fields Are Required !! (name, description, stock, price, sku, images, brand, category)");
  }

  let product = await productModel.create({
    name,
    description,
    stock,
    price,
    discount,
    isNewProduct,
    sku,
    images,
    brand,
    category,
    sizes,
  });

  return product;
};

// get single product
module.exports.singleProduct = async (id) => {
  const product = await productModel.findOne({ _id: id });

  return product;
};

// all product
module.exports.AllProduct = async () => {
  return await productModel.find();
};

// update product
module.exports.updateProduct = async ({
  productId,
  ...updateData
}) => {
  // Filter out undefined values to prevent overwriting with null
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: productId },
    { $set: updateData },
    { new: true },
  );

  if (!updatedProduct) {
    throw new Error("Product not Found");
  }

  return updatedProduct;
};

// delete product
module.exports.deleteProduct = async (id) => {
  return await productModel.findOneAndDelete({ _id: id });
};
