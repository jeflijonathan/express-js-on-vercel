import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sizes = await prisma.containerSize.findMany();
    console.log('Current ContainerSizes:', JSON.stringify(sizes, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
