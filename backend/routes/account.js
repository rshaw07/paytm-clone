const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async function(req, res){
    const account = await Account.findOne({userId: req.userId});
    res.status(200).json({
        balance: account.balance
    })
});

accountRouter.post("/transfer", authMiddleware, async function(req,res){
    try{const receiver = req.body;
    const foundReceiver = await Account.findOne({userId: receiver.to});
    if(!foundReceiver){
        res.status(400).json({
            message: "Invalid account"
        });
        return;
    }
    const sender = await Account.findOne({userId: req.userId});
    if(sender.balance<receiver.amount){
        res.status(400).json({
            message: "Insufficient balance"
        });
        return;
    }
    await Account.updateOne({
        userId: req.userId
    },{
        $inc: {
            balance: -receiver.amount
        }
    });

    await Account.updateOne({
        userId: receiver.to
    },{
        $inc: {
            balance: receiver.amount
        }
    });

    res.json({
        message: "Transfer successful"
    })}catch{
        res.json({msg: "error"});
    }
})
module.exports = { accountRouter };