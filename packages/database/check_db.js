const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.CORE_DATABASE_URL
    }
  }
});

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log("Found products:", products.length);
    if (products.length > 0) {
      console.log("Sample product images:", products[0].image);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
