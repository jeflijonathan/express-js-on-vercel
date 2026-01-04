import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting update of ContainerSize "ALL" to "ALLLCL"...');

    const containerSize = await prisma.containerSize.findFirst({
        where: { name: 'ALL' },
    });

    if (containerSize) {
        await prisma.containerSize.update({
            where: { id: containerSize.id },
            data: { name: 'ALLLCL' },
        });
        console.log(`Successfully updated ContainerSize ID ${containerSize.id} from "ALL" to "ALLLCL".`);
    } else {
        console.log('No ContainerSize with name "ALL" found.');

        const existingAllLcl = await prisma.containerSize.findFirst({
            where: { name: 'ALLLCL' },
        });

        if (existingAllLcl) {
            console.log('ContainerSize "ALLLCL" already exists.');
        }
    }
}

main()
    .catch((e) => {
        console.error('Error during update:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
