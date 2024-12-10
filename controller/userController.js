import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Use the appropriate email service (e.g., Gmail, Outlook)
  auth: {
    user: "firasmahjoub57@gmail.com", // Your email address
    pass: "mnstqrrsfuxvjgpg", // Your email password or app password
  },
});

// Utility function to create JWT token
let x=123
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register User with Email Verification
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email exists in the database
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ message: "Email already exists" });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      isVerified: false, // User is not verified initially
      verificationToken,
    });

    const user = await newUser.save();

    // Send Verification Email
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: "firasmahjoub57@gmail.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h1>Welcome to Our Platform!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for registering on our platform. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error sending email:", err);
      } else {
        console.log("Verification email sent successfully:", info.response);
      }
    });

    res.json({ success: true, message: "Registration successful. Please verify your email." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error registering user" });
  }
};

// Login User and Check for Email Verification
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred" });
  }
};

export { loginUser, registerUser };
