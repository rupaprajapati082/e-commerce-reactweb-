const categoryModel = require("../models/category.model");

module.exports.createCategory = async ({ name, description, image }) => {
  if (!name) throw new Error("Category Name is Required");
  return await categoryModel.create({ name, description, image });
};

module.exports.getAllCategories = async () => {
  return await categoryModel.find().sort({ createdAt: -1 });
};

module.exports.updateCategory = async (id, data) => {
  return await categoryModel.findByIdAndUpdate(id, data, { new: true });
};

module.exports.deleteCategory = async (id) => {
  return await categoryModel.findByIdAndDelete(id);
};
