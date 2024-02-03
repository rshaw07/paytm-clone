const express = require("express");
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const { JWT_SECRET } = require("../config");
const userRouter = express.Router();

const userSchema = zod.object({
    username: zod.string().email().min(3).max(30),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
    password: zod.string().min(6)
})

const singinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateSchema = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional()
})

userRouter.post("/signup", async function(req, res){
    const parsedUser = req.body;
    const verifiedUser = userSchema.safeParse(parsedUser);
    if(!verifiedUser.success){
        res.status(411).json({
            msg: "Something is wrong with your inputs"
        });
        return;
    }
    const existingUser = await User.findOne({
        username: parsedUser.username
    });

    if(existingUser){
        res.status(411).json({
            msg: "Email already exists"
        });
        return;
    }

    const user = await User.create({
        username: parsedUser.username,
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        password: parsedUser.password
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({userId: userId}, JWT_SECRET);
    res.status(200).json({
        message: "User created successfully",
        token: token
    });
});

userRouter.post("/signin", async function(req, res){
    const parsedUser = req.body;
    const verifiedUser = singinSchema.safeParse(parsedUser);
    if(!verifiedUser.success){
        res.status(411).json({
            msg: "Something is wrong with your inputs"
        });
        return;
    }    

    const user = await User.findOne({
        username: parsedUser.username,
        password: parsedUser.password
    })
    if(!user){
        res.status(411).json({
            message: "Error while logging in"
        })
        return;
    };

    const token = jwt.sign({userId: user._id}, JWT_SECRET);
    res.status(200).json({
        token: token
    }); 
});

userRouter.put("/", authMiddleware, async function(req, res){
    const parsedUser = req.body;
    const updatedUser = updateSchema.safeParse(parsedUser);

    if(!updatedUser.success){
        res.status(411).json({
            message: "Error while updating information"
        });
        return;
    }

    await User.updateOne({ _id: req.userId },
            parsedUser
    );

    res.status(200).json({
        message: "Updated successfully"
    })
});

userRouter.get("/bulk", authMiddleware, async function(req, res){
    let filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: { "$regex": filter, '$options': 'i'}
        },{
            lastName: { "$regex": filter, '$options': 'i'}
        }
        ]
    })

    const currentUser = await User.findOne({_id: req.userId});

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        })),
        currentUser
    })
})

module.exports = { userRouter };