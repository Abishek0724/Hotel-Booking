import User from "../models/User.js";

// Middleware to check authentication
export const protect = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const { userId } = req.auth;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};
