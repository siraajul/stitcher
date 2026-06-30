import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Seeding catalogs and dresses...');
  
  // Catalog 1001 with 5 dresses
  const cat1 = await prisma.catalog.upsert({
    where: { catalogNumber: '1001' },
    update: {},
    create: {
      catalogNumber: '1001',
      dresses: {
        create: [
          { name: 'Roan Green', stockMeters: 50 },
          { name: 'Roan Blue', stockMeters: 20.5 },
          { name: 'Loan Special', stockMeters: 10 },
          { name: 'Silk Pattern A', stockMeters: 100 },
          { name: 'Silk Pattern B', stockMeters: 0 },
        ]
      }
    }
  });

  // Catalog 420 with 3 dresses
  const cat2 = await prisma.catalog.upsert({
    where: { catalogNumber: '420' },
    update: {},
    create: {
      catalogNumber: '420',
      dresses: {
        create: [
          { name: 'Cotton Red', stockMeters: 15 },
          { name: 'Cotton Blue', stockMeters: 30 },
          { name: 'Chiffon White', stockMeters: 5 },
        ]
      }
    }
  });

  // Catalog 908 with 2 dresses
  const cat3 = await prisma.catalog.upsert({
    where: { catalogNumber: '908' },
    update: {},
    create: {
      catalogNumber: '908',
      dresses: {
        create: [
          { name: 'Premium Velvet', stockMeters: 40 },
          { name: 'Linen Basic', stockMeters: 25 },
        ]
      }
    }
  });

  console.log('Seeded successfully!');
  console.log({ cat1, cat2, cat3 });
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
