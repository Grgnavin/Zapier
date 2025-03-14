"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
//this endpoint is used to catch the trigger from the webhook
app.post("/hooks/catch/:userid/:zapid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userid;
    const zapId = req.params.zapid;
    const body = req.body;
    //store new trigger in a db
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zapRun = yield tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body,
            }
        });
        yield tx.zapRunOutbox.create({
            data: {
                zapRunId: zapRun.id,
            }
        });
    }));
    //push it into the queue(like rabbitmq or kafka)
    res.status(200).json({
        message: "Trigger received"
    });
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
