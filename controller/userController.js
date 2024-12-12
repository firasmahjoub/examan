import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

// Hardcoded server URL
const SERVER_URL = "http://localhost:4000";

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "firasmahjoub57@gmail.com",
    pass: "mnstqrrsfuxvjgpg", // Use app password for Gmail
  },
});

// JWT Secret (Replace with your secret key)
const JWT_SECRET = "your-very-secure-static-secret-key";

// Generate JWT Token
const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ message: "Email already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    // Construct the verification link
    const verificationLink = `${SERVER_URL}/api/user/verify-email/${verificationToken}`;
    console.log("Generated Verification Link:", verificationLink);

    // Send Verification Email
    const mailOptions = {
      from: "firasmahjoub57@gmail.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h1>Welcome to Our Platform!</h1>
        <p>Hi ${name},</p>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}" target="_blank">${verificationLink}</a>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Verification email sent successfully:", info.response);
      }
    });

    res.json({ success: true, message: "Registration successful. Please verify your email." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// Verify User Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    if (!token) {
      return res.status(400).send(`
        <h1>Email Verification</h1>
        <p style="color: red;">Invalid or missing token.</p>
      `);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.email) {
      return res.status(400).send(`
        <h1>Email Verification</h1>
        <p style="color: red;">Invalid token payload.</p>
      `);
    }

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send(`
        <h1>Email Verification</h1>
        <p style="color: red;">User not found.</p>
      `);
    }

    if (user.isVerified) {
      return res.send(`
        <h1>Email Verification</h1>
        <p style="color: green;">Your email is already verified.</p>
      `);
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send(`
      <h1>Email Verification</h1>
      <p style="color: green;">Your email has been successfully verified. You can now log in.</p>
    `);
  } catch (error) {
    console.error("Verification Error:", error.message);
    res.status(400).send(`
      <h1>Email Verification</h1>
      <p style="color: red;">Invalid or expired token. Please try registering again or contact support.</p>
    `);
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = createToken(user._id);
    console.log("Generated Token:", token); // Debugging the generated token
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
};

export { loginUser, registerUser, verifyEmail };
