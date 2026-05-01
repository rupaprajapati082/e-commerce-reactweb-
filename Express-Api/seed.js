const mongoose = require('mongoose');
const Product = require('./models/product.model');
require('dotenv').config();

const products = [
  {
    name: "Professional Cordless Drill - X200",
    description: "High-performance cordless drill with 20V Max lithium-ion battery, 2-speed transmission, and LED light for dark workspaces.",
    stock: 50,
    price: 129.99,
    discount: 10,
    sku: "DRILL-X200-01",
    images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800"],
    brand: "PowerMaster",
    category: "Power Tools"
  },
  {
    name: "Heavy Duty Impact Wrench",
    description: "Industrial grade impact wrench with 700 ft-lbs of max torque and brushless motor for extended tool life.",
    stock: 30,
    price: 189.50,
    discount: 5,
    sku: "IW-HD-700",
    images: ["https://images.unsplash.com/photo-1530124560676-44b2911f4078?auto=format&fit=crop&q=80&w=800"],
    brand: "IronBuild",
    category: "Power Tools"
  },
  {
    name: "Precision Screwdriver Set (32 Piece)",
    description: "Chrome vanadium steel precision screwdriver set for electronics, watches, and delicate repairs.",
    stock: 100,
    price: 24.99,
    discount: 0,
    sku: "PS-32P-PRO",
    images: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800"],
    brand: "MicroTech",
    category: "Hand Tools"
  },
  {
    name: "Digital Laser Measure 100m",
    description: "Advanced laser distance meter with ±1.5mm accuracy, area/volume calculation, and backlit LCD display.",
    stock: 45,
    price: 79.00,
    discount: 15,
    sku: "LM-100D-ADV",
    images: ["https://images.unsplash.com/photo-1581244276891-6677cf47c247?auto=format&fit=crop&q=80&w=800"],
    brand: "OptiScan",
    category: "Measuring Tools"
  },
  {
    name: "Auto-Darkening Welding Helmet",
    description: "Professional welding helmet with true color technology, variable shade 5-13, and large viewing area.",
    stock: 25,
    price: 115.00,
    discount: 20,
    sku: "WH-AD-TC",
    images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"],
    brand: "SafeWeld",
    category: "Protective Gear"
  },
  {
    name: "6-Piece Wood Chisel Set",
    description: "Classic wood carving chisels with ergonomic walnut handles and high-carbon steel blades.",
    stock: 60,
    price: 45.99,
    discount: 0,
    sku: "WC-6P-WAL",
    images: ["https://images.unsplash.com/photo-1586864387417-f5424482b73b?auto=format&fit=crop&q=80&w=800"],
    brand: "WoodCraft",
    category: "Hand Tools"
  },
  {
    name: "Portable Air Compressor 6 Gallon",
    description: "Oil-free pancake air compressor with 150 max PSI and quick recovery time for pneumatic tools.",
    stock: 15,
    price: 199.99,
    discount: 10,
    sku: "AC-6G-PAN",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800"],
    brand: "AeroForce",
    category: "Workshop Equipment"
  },
  {
    name: "Magnetic Spirit Level 120cm",
    description: "High-accuracy aluminum spirit level with shock-proof vials and magnetic base for hands-free steel work.",
    stock: 80,
    price: 34.50,
    discount: 5,
    sku: "SL-120M-ALU",
    images: ["https://images.unsplash.com/photo-1534394046222-b543d463773b?auto=format&fit=crop&q=80&w=800"],
    brand: "LevelUp",
    category: "Measuring Tools"
  },
  {
    name: "Cut-Resistant Work Gloves (Level 5)",
    description: "Nitrile-coated HPPE fiber gloves providing maximum protection and superior grip in oily conditions.",
    stock: 200,
    price: 18.99,
    discount: 0,
    sku: "WG-CR5-NIT",
    images: ["https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=800"],
    brand: "ShieldPro",
    category: "Protective Gear"
  },
  {
    name: "Adjustable Bench Vise 6-Inch",
    description: "Heavy-duty cast iron bench vise with 360-degree swivel base and 6-inch jaw width for workshop stability.",
    stock: 20,
    price: 89.99,
    discount: 0,
    sku: "BV-6I-CI",
    images: ["https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800"],
    brand: "IronBuild",
    category: "Workshop Equipment"
  },
  {
    name: "Angle Grinder 4-1/2 Inch",
    description: "Powerful 11-Amp motor angle grinder with paddle switch and tool-free guard adjustment.",
    stock: 40,
    price: 69.99,
    discount: 10,
    sku: "AG-45I-11A",
    images: ["https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800"],
    brand: "PowerMaster",
    category: "Power Tools"
  },
  {
    name: "10-Piece Combination Wrench Set",
    description: "Metric chrome vanadium wrenches with 12-point box end and 15-degree offset for tight spaces.",
    stock: 55,
    price: 42.00,
    discount: 0,
    sku: "CW-10P-MET",
    images: ["https://images.unsplash.com/photo-1586864387417-f5424482b73b?auto=format&fit=crop&q=80&w=800"],
    brand: "FixIt",
    category: "Hand Tools"
  },
  {
    name: "Non-Contact Voltage Tester",
    description: "Dual range AC voltage detector (12V-1000V) with visual and audible alarms and built-in flashlight.",
    stock: 120,
    price: 19.50,
    discount: 0,
    sku: "VT-NC-DR",
    images: ["https://images.unsplash.com/photo-1581244276891-6677cf47c247?auto=format&fit=crop&q=80&w=800"],
    brand: "VoltGuard",
    category: "Measuring Tools"
  },
  {
    name: "Steel-Toe Safety Boots",
    description: "Waterproof leather work boots with ASTM-certified steel toe and slip-resistant rubber outsole.",
    stock: 35,
    price: 145.00,
    discount: 10,
    sku: "SB-ST-WP",
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=800"],
    brand: "ToughWalk",
    category: "Protective Gear"
  },
  {
    name: "Workbench with Integrated Storage",
    description: "Sturdy bamboo top workbench with 4 locking drawers and heavy-duty casters for mobility.",
    stock: 10,
    price: 499.00,
    discount: 5,
    sku: "WB-IS-BAM",
    images: ["https://images.unsplash.com/photo-1530124560676-44b2911f4078?auto=format&fit=crop&q=80&w=800"],
    brand: "WorkshopPro",
    category: "Workshop Equipment"
  },
  {
    name: "Oscillating Multi-Tool Kit",
    description: "Versatile tool for cutting, sanding, and scraping with 20V battery and quick-change accessory system.",
    stock: 25,
    price: 159.99,
    discount: 15,
    sku: "OMT-20V-K",
    images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800"],
    brand: "PowerMaster",
    category: "Power Tools"
  },
  {
    name: "Claw Hammer with Fiberglass Handle",
    description: "Balanced 16oz rip claw hammer with non-slip fiberglass handle for maximum shock absorption.",
    stock: 90,
    price: 15.99,
    discount: 0,
    sku: "CH-16F-RIP",
    images: ["https://images.unsplash.com/photo-1586864387417-f5424482b73b?auto=format&fit=crop&q=80&w=800"],
    brand: "FixIt",
    category: "Hand Tools"
  },
  {
    name: "Digital Multimeter (Auto-Ranging)",
    description: "Professional grade multimeter measuring AC/DC voltage, current, resistance, and capacitance.",
    stock: 65,
    price: 54.99,
    discount: 0,
    sku: "DM-AR-PRO",
    images: ["https://images.unsplash.com/photo-1581244276891-6677cf47c247?auto=format&fit=crop&q=80&w=800"],
    brand: "VoltGuard",
    category: "Measuring Tools"
  },
  {
    name: "Hearing Protection Earmuffs (SNR 34dB)",
    description: "High-decibel noise reduction earmuffs with comfortable padding and adjustable headband.",
    stock: 75,
    price: 28.50,
    discount: 0,
    sku: "HP-EM-34",
    images: ["https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=800"],
    brand: "ShieldPro",
    category: "Protective Gear"
  },
  {
    name: "Magnetic Tool Organizer Bar (3-Pack)",
    description: "Three 18-inch heavy-duty magnetic strips for organized tool storage on walls or cabinets.",
    stock: 50,
    price: 39.99,
    discount: 10,
    sku: "MTO-18-3P",
    images: ["https://images.unsplash.com/photo-1530124560676-44b2911f4078?auto=format&fit=crop&q=80&w=800"],
    brand: "WorkshopPro",
    category: "Workshop Equipment"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB for seeding...');
    
    // Check for existing products to avoid duplication of SKUs if run multiple times
    const existingSkus = await Product.find({}, 'sku');
    const existingSkuSet = new Set(existingSkus.map(p => p.sku));
    
    const newProducts = products.filter(p => !existingSkuSet.has(p.sku));
    
    if (newProducts.length > 0) {
      await Product.insertMany(newProducts);
      console.log(`${newProducts.length} new products seeded successfully!`);
    } else {
      console.log('All seed products already exist in the database.');
    }
    
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
