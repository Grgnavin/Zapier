import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function Main() {
    while (1) {
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where: {},
            take: 10
        });

        pendingRows.forEach(r => {
            
        })
    }
}

Main();