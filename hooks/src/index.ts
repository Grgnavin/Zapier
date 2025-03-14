import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//this endpoint is used to catch the trigger from the webhook
app.post("/hooks/catch/:userid/:zapid",async (req, res) => {
    const userId = req.params.userid;
    const zapId = req.params.zapid;
    const body = req.body;

    //store new trigger in a db
    await prisma.$transaction(async (tx) => {
        const zapRun = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body,
            }
        });
        await tx.zapRunOutbox.create({
            data: {
                zapRunId: zapRun.id,
            }
        });
    });
    //push it into the queue(like rabbitmq or kafka)
    res.status(200).json({
        message: "Trigger received"
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
