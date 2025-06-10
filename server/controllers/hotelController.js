import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id; // Assumes `req.user` is set by auth middleware

    // Check if a hotel is already registered by this user
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.status(400).json({ success: false, message: "Hotel already registered" });
    }

    // Register new hotel
    await Hotel.create({ name, address, contact, city, owner });

    // Update user role to 'hotelowner'
    await User.findByIdAndUpdate(owner, { role: "hotelowner" });

    return res.json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
