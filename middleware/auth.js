import jwt from "jsonwebtoken";

const JWT_SECRET = "your-very-secure-static-secret-key"; // Consider using an environment variable for security

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    // Ensure token follows "Bearer <token>" format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Invalid token format. Use 'Bearer <token>'" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info (e.g., userId) to the request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
