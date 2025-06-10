import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from "cloudinary";
import Room from "../models/Room.js";
//api tocreate new room to hotel
export const createRoom=async(req,res)=>{
    try {
        const{roomType,pricePerNight, amenties}=req.body;
        const hotel=await Hotel.findone({owner:req.auth.userId})
        if (!hotel) return res.json({success: false,message:"No Hotel found"});

        //upload to cloudinary
        const uploadImages=req.files.map(async (file) => {
            const response= await cloudinary.upload(file.path);
            return response.secure_url
        })
        const images= await Promise.all(uploadImages);
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(ammenities),
            images,
        })
        res.json({success:true,message:"Room Created Succesfully"})
    
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//api toget all rooms
export const getRooms=async(req,res)=>{
try {
  const rooms=  await Room.find({isAvailabel: true}).populate({
    path:'hotel',
    populate:{
        path:'owner',
        select:'image'
    }
  }).sort({createdAt:-1})
  res.json({success:true,rooms});
} catch (error) {
    res.json({success:false,message:error.message});
}
}
//api toget all rooms specific hotel
export const getOwnerRooms=async(req,res)=>{
    try {
        const hotelData=await Hotel.findOne({owner: req.auth.userId})
        const rooms=await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
         res.json({success:true,rooms});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
//api to toogle availabiltyof a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        if (!roomData) return res.json({ success: false, message: "Room not found" });
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room Availability Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}