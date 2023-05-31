import {
    Router
} from "express";
const router = Router();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    body,
    validationResult
} from 'express-validator';

// models
import User from "../database/models/User.js";
import RefreshToken from "../database/models/RefreshToken.js";
import Authentication from "../database/models/Auth.js";



router.delete("/logout", async (req, res) => {

    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        res.status(400).send("Refresh token not found");
        return;
    }

    try {
        const tokenDeleted = await RefreshToken.deleteOne({
            token: refreshToken
        });


        if (tokenDeleted.deletedCount > 0) {

            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.status(200).send("Successfully logged out.");

        } else {
            res.status(404).send("Token not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});



router.post("/signup",

    [
        body('firstName').notEmpty().trim().escape().withMessage('First name is required and must be a string'),
        body('lastName').notEmpty().trim().escape().withMessage('Last name is required and must be a string'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').isLength({
            min: 6
        }).withMessage('Password must be at least 8 characters long')
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const emailExists = await User.findOne({
            email: email
        });

        if (emailExists) {
            return res.status(400).send({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
        });

        const authData = new Authentication({
            user: user._id,
            password: hashedPassword
        })

        try {
            await user.save();
            await authData.save();
            res.status(200).send({
                message: "User created successfully"
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    });


router.post("/login",

    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').isLength({
            min: 6
        }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            password
        } = req.body;

        try {
            const user = await User.findOne({
                    email: email
                })
                .populate({
                    path: 'challenges.challenge',
                    populate: {
                        path: 'createdBy',
                        select: 'firstName lastName'
                    }
                });

            if (!user) {
                return res.status(400).send("Invalid email or password!");
            }

            const authData = await Authentication.findOne({
                user: user._id
            });
            if (!authData) {
                return res.status(400).send("Authentication data not found!");
            }

            const isPasswordCorrect = await bcrypt.compare(password, authData.password);
            if (!isPasswordCorrect) {
                res.status(400).send("Invalid email or password!");
            } else {
                const accessToken = generateAccessToken({
                    id: user._id
                });
                const refreshToken = jwt.sign({
                    id: user._id
                }, process.env.REFRESH_TOKEN_SECRET);

                await RefreshToken.create({
                    token: refreshToken,
                    user: user._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: true
                });

                res.status(200).json(user);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    });

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
}



export default router;