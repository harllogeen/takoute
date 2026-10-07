const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🖼️  Checking Swallow item images...\n');
  
  const swallowCategory = await prisma.category.findFirst({
    where: { name: 'Swallow' }
  });
  
  if (swallowCategory) {
    const swallows = await prisma.foodItem.findMany({
      where: { categoryId: swallowCategory.id },
      select: {
        name: true,
        imageUrl: true
      }
    });
    
    swallows.forEach(item => {
      console.log(`📸 ${item.name}`);
      console.log(`   Image: ${item.imageUrl}`);
      console.log('');
    });
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
