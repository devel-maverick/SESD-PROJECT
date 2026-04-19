import { PrismaClient, Category, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

function mapCategory(dummyCategory: string): Category {
  const c = dummyCategory.toLowerCase();
  if (c.includes('smartphone') || c.includes('laptop') || c.includes('lighting') || c.includes('motorcycle') || c.includes('vehicle')) {
    return Category.Electronics;
  }
  if (c.includes('grocer') || c.includes('food')) {
    return Category.Grocery;
  }
  if (c.includes('shoe') || c.includes('sneaker')) {
    return Category.Shoes;
  }
  if (c.includes('furniture') || c.includes('home-decoration')) {
    return Category.Furniture;
  }
  if (c.includes('beauty') || c.includes('fragrance') || c.includes('skin') || c.includes('dress') || c.includes('top') || c.includes('mens') || c.includes('womens')) {
    return Category.Fashion;
  }
  return Category.Books; // Default fallback Category
}

async function fetchRealDummyProducts() {
  const res = await fetch('https://dummyjson.com/products?limit=200');
  const data: any = await res.json();
  const products = [];

  for (const item of data.products) {
    // Store all images as a JSON array string so the frontend can build a real gallery
    // Format: JSON.stringify([thumbnail, img1, img2, ...])
    const allImages = [item.thumbnail, ...(item.images || [])].filter(Boolean);
    const uniqueImages = [...new Set(allImages)]; // deduplicate

    products.push({
      name: item.title,
      description: item.description,
      price: Math.round(item.price * 82),
      category: mapCategory(item.category),
      stock: item.stock || 50,
      image: JSON.stringify(uniqueImages), // stored as JSON array string
    });
  }
  return products;
}

async function seed() {
  try {
    console.log('✅ Connected to Postgres database');

    // Clean up existing data in correct order (due to foreign keys)
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('🗑  Cleared old data');

    const adminPass = await bcrypt.hash('admin123', 12);
    const userPass  = await bcrypt.hash('user1234', 12);

    await prisma.user.createMany({
      data: [
        { name: 'Admin User', email: 'admin@quickcart.com', password: adminPass, role: Role.admin },
        { name: 'Demo User',  email: 'user@quickcart.com',  password: userPass,  role: Role.user  },
      ],
    });

    console.log('👤 Admin → admin@quickcart.com / admin123');
    console.log('👤 User  → user@quickcart.com  / user1234');

    console.log('Fetching precisely mapped items from DummyJSON...');
    const APIProducts = await fetchRealDummyProducts();

    await prisma.product.createMany({
      data: APIProducts,
    });
    console.log(`📦 Seeded ${APIProducts.length} hyper-realistic products with EXACT original thumbnails`);

    console.log('\n🎉 Seed complete! Start the app with: npm run deploy');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
