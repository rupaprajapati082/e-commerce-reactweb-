const categoryService = require("../services/category.service");

module.exports.CreateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await categoryService.createCategory({ name, description, image });
    res.status(200).json({ message: "Category Added", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.AllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.UpdateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ message: "Category Updated", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.DeleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ message: "Category Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
