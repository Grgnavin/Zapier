import express from 'express';

const app = express();

app.post("/hooks/catch/:userid/:zapid", (req, res) => {
    const userId = req.params.userid;
    const zapId = req.params.zapid;

    //store new trigger in a db

    //push it into the queue(like rabbitmq or kafka)

})

