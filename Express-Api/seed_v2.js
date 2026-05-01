const mongoose = require('mongoose');
const Product = require('./models/product.model');
require('dotenv').config();

const products = [
  // ── FOOD CATEGORY (5 Items) ──
  {
    name: "Pure Organic Mountain Honey",
    description: "100% pure, raw, and unfiltered honey harvested from wild mountain flowers. Rich in antioxidants and natural enzymes.",
    stock: 120,
    price: 45000,
    discount: 5,
    sku: "FOOD-HNY-001",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"],
    brand: "NatureGold",
    category: "Food",
    sizes: ["250g", "500g", "1kg"]
  },
  {
    name: "Artisan Italian Fusilli Pasta",
    description: "Authentic bronze-die extruded pasta made from 100% durum wheat semolina. Perfect texture for holding sauces.",
    stock: 200,
    price: 35000,
    discount: 0,
    sku: "FOOD-PST-002",
    images: ["https://images.unsplash.com/photo-1551462147-3a88236b4470?auto=format&fit=crop&q=80&w=800"],
    brand: "VeraItalia",
    category: "Food",
    sizes: ["500g"]
  },
  {
    name: "Cold Pressed Extra Virgin Olive Oil",
    description: "First cold-pressed olive oil from hand-picked Mediterranean olives. Low acidity and fruity aroma.",
    stock: 85,
    price: 125000,
    discount: 10,
    sku: "FOOD-OIL-003",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800"],
    brand: "TerraVerde",
    category: "Food",
    sizes: ["250ml", "500ml", "1L"]
  },
  {
    name: "Single Origin Arabica Coffee Beans",
    description: "Medium roast coffee beans with notes of caramel and hazelnut. Ethically sourced from Ethiopian highlands.",
    stock: 150,
    price: 89000,
    discount: 15,
    sku: "FOOD-CFE-004",
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"],
    brand: "RoastMaster",
    category: "Food",
    sizes: ["250g", "500g"]
  },
  {
    name: "Premium 70% Dark Chocolate Bar",
    description: "Rich and smooth dark chocolate made from fine flavor cocoa beans. Vegan and gluten-free.",
    stock: 300,
    price: 25000,
    discount: 0,
    sku: "FOOD-CHOC-005",
    images: ["https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800"],
    brand: "CocoaElite",
    category: "Food",
    sizes: ["100g"]
  },

  // ── KIDS TOY CATEGORY (5 Items) ──
  {
    name: "Classic Wooden Building Blocks Set",
    description: "50-piece solid wood block set in various shapes and colors. Encourages creativity and fine motor skills.",
    stock: 40,
    price: 249000,
    discount: 20,
    sku: "TOY-BLK-001",
    images: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800"],
    brand: "KiddoBuild",
    category: "Kids Toy",
    sizes: ["Standard"]
  },
  {
    name: "High-Speed Remote Control Racing Car",
    description: "2.4GHz RC car with 4-wheel drive and shock absorbers. Can reach speeds up to 15km/h.",
    stock: 25,
    price: 399000,
    discount: 10,
    sku: "TOY-CAR-002",
    images: ["https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800"],
    brand: "NitroX",
    category: "Kids Toy",
    sizes: ["1:18 Scale"]
  },
  {
    name: "Ultra-Soft Plush Teddy Bear",
    description: "Handcrafted teddy bear made from premium hypoallergenic materials. The perfect companion for kids.",
    stock: 60,
    price: 159000,
    discount: 5,
    sku: "TOY-PLSH-003",
    images: ["https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=800"],
    brand: "SoftSnuggles",
    category: "Kids Toy",
    sizes: ["Large (40cm)"]
  },
  {
    name: "Educational Magnetic Puzzle Set",
    description: "Interactive magnetic puzzle with alphabet and animal shapes. Helps in early cognitive development.",
    stock: 100,
    price: 129000,
    discount: 0,
    sku: "TOY-PZL-004",
    images: ["https://images.unsplash.com/photo-1515488442805-959679ee04f1?auto=format&fit=crop&q=80&w=800"],
    brand: "SmartKids",
    category: "Kids Toy",
    sizes: ["Standard"]
  },
  {
    name: "Modern Play Kitchen Set",
    description: "Wooden play kitchen with working knobs, sink, and storage compartments. Includes 10 cooking accessories.",
    stock: 15,
    price: 899000,
    discount: 15,
    sku: "TOY-KTCH-005",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800"],
    brand: "MiniChef",
    category: "Kids Toy",
    sizes: ["Deluxe"]
  }
];

const seedDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/rest-apis';
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB for seeding v2...');
    
    const existingSkus = await Product.find({}, 'sku');
    const existingSkuSet = new Set(existingSkus.map(p => p.sku));
    
    const newProducts = products.filter(p => !existingSkuSet.has(p.sku));
    
    if (newProducts.length > 0) {
      await Product.insertMany(newProducts);
      console.log(`${newProducts.length} new products (Food & Kids Toy) seeded successfully!`);
    } else {
      console.log('All new category products already exist in the database.');
    }
    
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
