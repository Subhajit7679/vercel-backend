const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
console.log("ENV EMAIL_USER:", process.env.EMAIL_USER);
console.log("ENV EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");


const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Contact API endpoint
app.post("/contact", async (req, res) => {
  const { name, email, description } = req.body;   // 👈 FIXED
  console.log("📩 Request received:", req.body);

  if (!name || !email || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Setup email transporter (using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // from .env
        pass: process.env.EMAIL_PASS    // 16-digit App Password
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: "sarojmaity888@gmail.com",   // ✅ your receiving email
      subject: `Portfolio Contact - ${name}`,
      text: `From: ${name} (${email})\n\n${description}`,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
