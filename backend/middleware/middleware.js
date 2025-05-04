import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
export const protect = async (req, res, next) => {
  try {
    const token = req?.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message || "Internal Server Error" });
  }
};
export const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden - Admins only" });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message || "Internal Server Error" });
  }
};
