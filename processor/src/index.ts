import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events";
const prisma = new PrismaClient();

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"]
})



async function Main() {
    const producer = kafka.producer();
    await producer.connect();
    while (1) {
        try {
            const pendingRows = await prisma.zapRunOutbox.findMany({
                where: {},
                take: 10
            });
    
            if (pendingRows.length > 0) {
                producer.send({
                    topic: TOPIC_NAME,
                    messages: pendingRows.map(row => {
                        return {
                            value: row.zapRunId.toString()
                        }
                    })
                })
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            await prisma.zapRunOutbox.deleteMany({
                where: {
                    id: {
                        in: pendingRows.map(row => row.id)
                    }
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
}

Main().catch(console.error);