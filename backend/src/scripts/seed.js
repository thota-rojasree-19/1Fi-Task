require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

function calculateEmi(price, tenureMonths, annualInterestRate) {
  if (annualInterestRate === 0) {
    return Math.round(price / tenureMonths);
  }
  const r = (annualInterestRate / 100) / 12;
  const n = tenureMonths;
  const emi = price * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

function generateEmiPlans(price) {
  return [
    {
      tenureMonths: 3,
      interestRate: 0,
      monthlyPayment: calculateEmi(price, 3, 0),
      cashback: 0
    },
    {
      tenureMonths: 6,
      interestRate: 0,
      monthlyPayment: calculateEmi(price, 6, 0),
      cashback: 0
    },
    {
      tenureMonths: 12,
      interestRate: 10.5,
      monthlyPayment: calculateEmi(price, 12, 10.5),
      cashback: 0
    }
  ];
}

// Prices are determined by storage. Color does not affect price.
// Images are determined by color (same image shared between storage tiers of same color).
const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    description: "The ultimate iPhone with a titanium design, A19 Pro chip, and advanced camera system.",
    variants: [
      {
        storage: "256GB", color: "Silver", finish: "Titanium",
        mrp: 134900, price: 127400,
        imageUrl: "/images/iphone-17-pro-silver.jpg",
        emiPlans: generateEmiPlans(127400)
      },
      {
        storage: "256GB", color: "Orange", finish: "Titanium",
        mrp: 134900, price: 127400,
        imageUrl: "/images/iphone-17-pro-orange.jpg",
        emiPlans: generateEmiPlans(127400)
      },
      {
        storage: "512GB", color: "Silver", finish: "Titanium",
        mrp: 154900, price: 147400,
        imageUrl: "/images/iphone-17-pro-silver.jpg",
        emiPlans: generateEmiPlans(147400)
      },
      {
        storage: "512GB", color: "Orange", finish: "Titanium",
        mrp: 154900, price: 147400,
        imageUrl: "/images/iphone-17-pro-orange.jpg",
        emiPlans: generateEmiPlans(147400)
      }
    ]
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    slug: "samsung-galaxy-s25-ultra",
    description: "The most advanced Galaxy ever with an all-new design and powerful AI features.",
    variants: [
      {
        storage: "256GB", color: "Titanium Black", finish: "Matte",
        mrp: 139900, price: 132900,
        imageUrl: "/images/samsung-s25-ultra-black.jpg",
        emiPlans: generateEmiPlans(132900)
      },
      {
        storage: "256GB", color: "Titanium Gray", finish: "Matte",
        mrp: 139900, price: 132900,
        imageUrl: "/images/samsung-s25-ultra-gray.jpg",
        emiPlans: generateEmiPlans(132900)
      },
      {
        storage: "512GB", color: "Titanium Black", finish: "Matte",
        mrp: 159900, price: 152900,
        imageUrl: "/images/samsung-s25-ultra-black.jpg",
        emiPlans: generateEmiPlans(152900)
      },
      {
        storage: "512GB", color: "Titanium Gray", finish: "Matte",
        mrp: 159900, price: 152900,
        imageUrl: "/images/samsung-s25-ultra-gray.jpg",
        emiPlans: generateEmiPlans(152900)
      }
    ]
  },
  {
    name: "Google Pixel 10 Pro",
    slug: "google-pixel-10-pro",
    description: "The smartest Pixel yet, featuring the Tensor G5 chip and professional-level cameras.",
    variants: [
      {
        storage: "256GB", color: "Obsidian", finish: "Glossy",
        mrp: 99999, price: 94999,
        imageUrl: "/images/pixel-10-pro-obsidian.jpg",
        emiPlans: generateEmiPlans(94999)
      },
      {
        storage: "256GB", color: "Hazel", finish: "Glossy",
        mrp: 99999, price: 94999,
        imageUrl: "/images/pixel-10-pro-hazel.jpg",
        emiPlans: generateEmiPlans(94999)
      },
      {
        storage: "512GB", color: "Obsidian", finish: "Glossy",
        mrp: 112999, price: 107999,
        imageUrl: "/images/pixel-10-pro-obsidian.jpg",
        emiPlans: generateEmiPlans(107999)
      },
      {
        storage: "512GB", color: "Hazel", finish: "Glossy",
        mrp: 112999, price: 107999,
        imageUrl: "/images/pixel-10-pro-hazel.jpg",
        emiPlans: generateEmiPlans(107999)
      }
    ]
  }
];

async function seedDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully.");

    console.log("Clearing existing products...");
    await Product.deleteMany({});

    console.log("Inserting seed data...");
    await Product.insertMany(products);

    const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0);
    console.log(`Successfully inserted ${products.length} products with ${totalVariants} total variants.`);

    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
