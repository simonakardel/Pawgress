import { Router } from "express";
import { refreshTokenMiddleware } from "../middleware/refreshToken.js";
import {
  body,
  validationResult
} from 'express-validator';

const router = Router();

import nodemailer from "nodemailer";
router.use(refreshTokenMiddleware);


router.post("/contact",

  [
    body("subject").isString().escape().withMessage("Subject must be a string"),
    body("message").isString().escape().withMessage("Message must be a string"),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, message } = req.body;
    const userFirstName = req.user.firstName;
    const userLastName = req.user.lastName;
    const userEmail = req.user.email;


    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.eu",
        port: 465,
        secure: true, 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.APP_PASSWORD
        },
    });
  

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      replyTo: userEmail,
      subject: `${subject} from ${userFirstName} ${userLastName}`,
      text: message,
    };


    try {
      await transporter.sendMail(mailOptions);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

export default router;