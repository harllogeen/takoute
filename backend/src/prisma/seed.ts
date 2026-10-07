import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chopnow.ng' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@chopnow.ng',
      phone: '08012345678',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '08087654321',
      password: customerPassword,
      role: 'CUSTOMER'
    }
  });
  console.log('✅ Test customer created:', customer.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Rice' },
      update: {},
      create: {
        name: 'Rice',
        description: 'All rice dishes',
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Chicken' },
      update: {},
      create: {
        name: 'Chicken',
        description: 'Grilled and fried chicken',
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Swallow' },
      update: {},
      create: {
        name: 'Swallow',
        description: 'Eba, Pounded Yam, and other Nigerian swallows',
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Soups' },
      update: {},
      create: {
        name: 'Soups',
        description: 'Nigerian soups',
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Drinks' },
      update: {},
      create: {
        name: 'Drinks',
        description: 'Soft drinks and beverages',
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { name: 'Snacks' },
      update: {},
      create: {
        name: 'Snacks',
        description: 'Small chops and snacks',
        isActive: true
      }
    })
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create food items
  const riceCategory = categories.find(c => c.name === 'Rice')!;
  const chickenCategory = categories.find(c => c.name === 'Chicken')!;
  const swallowCategory = categories.find(c => c.name === 'Swallow')!;
  const soupCategory = categories.find(c => c.name === 'Soups')!;
  const drinksCategory = categories.find(c => c.name === 'Drinks')!;
  const snacksCategory = categories.find(c => c.name === 'Snacks')!;

  const foods = [
    // Rice
    {
      name: 'Jollof Rice & Fish',
      description: 'Delicious Nigerian jollof rice with grilled fish',
      price: 4500,
      imageUrl: '/assets/images/jollof-rice.jpg',
      categoryId: riceCategory.id,
      isAvailable: true
    },
    {
      name: 'Ofada Rice Special',
      description: 'Traditional Nigerian Ofada rice served with spicy ayamase sauce',
      price: 4000,
      imageUrl: '/assets/images/ofada-rice-and-sauce.jpeg',
      categoryId: riceCategory.id,
      isAvailable: true
    },
    {
      name: 'Ofada Rice and Stew',
      description: 'Premium Ofada rice with assorted meat and ponmo',
      price: 5000,
      imageUrl: '/assets/images/offada-rice.jpg',
      categoryId: riceCategory.id,
      isAvailable: true
    },
    {
      name: 'Fried Rice',
      description: 'Colorful fried rice with vegetables',
      price: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      categoryId: riceCategory.id,
      isAvailable: true
    },
    {
      name: 'White Rice & Stew',
      description: 'Plain white rice served with red stew',
      price: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
      categoryId: riceCategory.id,
      isAvailable: true
    },

    // Chicken
    {
      name: 'Grilled Chicken (Full)',
      description: 'Whole grilled chicken seasoned to perfection',
      price: 6000,
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      categoryId: chickenCategory.id,
      isAvailable: true
    },
    {
      name: 'Grilled Chicken (Half)',
      description: 'Half grilled chicken',
      price: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=400',
      categoryId: chickenCategory.id,
      isAvailable: true
    },
    {
      name: 'Fried Chicken',
      description: 'Crispy fried chicken',
      price: 3000,
      imageUrl: '/assets/images/fried-chicken.jpg',
      categoryId: chickenCategory.id,
      isAvailable: true
    },
    {
      name: 'Chicken & Chips',
      description: 'Crispy fried chicken served with chips',
      price: 3800,
      imageUrl: '/assets/images/coconut-rice.jpg',
      categoryId: chickenCategory.id,
      isAvailable: true
    },
    // Swallow
    {
      name: 'Pounded Yam & Vegetable Soup',
      description: 'Nigerian swallow - smooth pounded yam served with vegetable soup',
      price: 4500,
      imageUrl: '/assets/images/pounded-yam-and-egusi.jpg',
      categoryId: swallowCategory.id,
      isAvailable: true
    },
    {
      name: 'Spaghetti',
      description: 'Delicious spaghetti cooked Nigerian style',
      price: 1500,
      imageUrl: '/assets/images/eba.jpg',
      categoryId: swallowCategory.id,
      isAvailable: true
    },
    {
      name: 'Fried Turkey',
      description: 'Crispy fried turkey seasoned to perfection',
      price: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400',
      categoryId: chickenCategory.id,
      isAvailable: true
    },
    // Soups
    {
      name: 'Egusi Soup',
      description: 'Rich egusi soup with assorted meat',
      price: 3500,
      imageUrl: '/assets/images/Egusi-Soup.jpg',
      categoryId: soupCategory.id,
      isAvailable: true
    },
    {
      name: 'Efo Riro',
      description: 'Vegetable soup with locust beans',
      price: 7000,
      imageUrl: '/assets/images/Efo-Riro1.jpg',
      categoryId: soupCategory.id,
      isAvailable: true
    },
    {
      name: 'Banga Soup',
      description: 'Palm nut soup',
      price: 3200,
      imageUrl: '/assets/images/Banga_Soup_Recipe_benczv.webp',
      categoryId: soupCategory.id,
      isAvailable: true
    },
    // Drinks
    {
      name: 'Coca Cola (Big)',
      description: 'Chilled Coca Cola soft drink - 60cl bottle',
      price: 600,
      imageUrl: '/assets/images/png-clipart-coca-cola-coca-cola.png',
      categoryId: drinksCategory.id,
      isAvailable: true
    },
    {
      name: 'Coca Cola (Small)',
      description: 'Chilled Coca Cola soft drink - 35cl bottle',
      price: 500,
      imageUrl: '/assets/images/Coke-Transparent.png',
      categoryId: drinksCategory.id,
      isAvailable: true
    },
    {
      name: 'Fanta (Big)',
      description: 'Chilled Fanta Orange soft drink - 60cl bottle',
      price: 600,
      imageUrl: '/assets/images/png-transparent-fanta-can.png',
      categoryId: drinksCategory.id,
      isAvailable: true
    },
    {
      name: 'Fanta (Small)',
      description: 'Chilled Fanta Orange soft drink - 35cl bottle',
      price: 500,
      imageUrl: '/assets/images/fanta_PNG30.png',
      categoryId: drinksCategory.id,
      isAvailable: true
    },
    {
      name: 'Sprite',
      description: 'Chilled Sprite lemon-lime drink',
      price: 500,
      imageUrl: '/assets/images/Sprite-24.png',
      categoryId: drinksCategory.id,
      isAvailable: true
    },
    {
      name: 'Bottled Water',
      description: 'Eva bottled water - refreshing drink',
      price: 300,
      imageUrl: '/assets/images/alles-water-4998513_1920.png',
      categoryId: drinksCategory.id,
      isAvailable: true
    },
    // Snacks
    {
      name: 'Small Chops',
      description: 'Assorted small chops (samosa, spring rolls, puff-puff)',
      price: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      categoryId: snacksCategory.id,
      isAvailable: true
    },
    {
      name: 'Meat Pie',
      description: 'Fresh meat pie',
      price: 800,
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
      categoryId: snacksCategory.id,
      isAvailable: true
    },
    {
      name: 'Puff Puff',
      description: 'Sweet puff puff (6 pieces)',
      price: 1000,
      imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400',
      categoryId: snacksCategory.id,
      isAvailable: true
    }
  ];

  for (const food of foods) {
    await prisma.foodItem.upsert({
      where: { 
        name_categoryId: {
          name: food.name,
          categoryId: food.categoryId
        }
      },
      update: {
        description: food.description,
        price: food.price,
        imageUrl: food.imageUrl,
        isAvailable: food.isAvailable
      },
      create: food
    });
  }
  console.log('✅ Food items created:', foods.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
