import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const result = await prisma.catalog.findUnique({
      where: { catalogNumber: '1001' }
    });
    console.log('Result:', result);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
