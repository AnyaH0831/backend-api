import nodemailer from "nodemailer";

export default async function handler(req, res) {
  
    res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Configure transporter using environment variables
    const transporter = nodemailer.createTransport({
        
        service: "gmail", // or your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Gmail App Password
        },
    });

    try {
        await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Contact Form: ${name}`,
        text: message,
        });
        res.status(200).json({ success: "Message sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send message." });
    }
}
