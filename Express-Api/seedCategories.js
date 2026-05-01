const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model');
const Category = require('./models/category.model');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/rest-apis');
    console.log('Connected to DB');

    const products = await Product.find();
    const rawCategories = [...new Set(products.map(p => p.category))];
    
    const normalizedCategories = rawCategories.map(cat => {
      return (cat || 'Uncategorized').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    });

    const uniqueNormalized = [...new Set([...normalizedCategories, 'Cosmetic', 'Food', 'Electronic', 'Fashion', 'Dress', 'Top'])];

    for (const catName of uniqueNormalized) {
      const exists = await Category.findOne({ name: catName });
      if (!exists) {
        await Category.create({ 
          name: catName,
          description: `Strategic category for ${catName} gear.`,
          image: 'https://images.unsplash.com/photo-1581244276891-6677cf47c247?auto=format&fit=crop&q=80&w=300'
        });
        console.log(`Created category: ${catName}`);
      }
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
