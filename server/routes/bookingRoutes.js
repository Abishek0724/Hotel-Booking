import express from "express";
import {checkAvailabilityApi, createBooking, getHotelBookings, getUserBookings} from '../controllers/bookinController.js'
import { protect } from "../middleware/authMiddleware.js";


const bookingRouter= express.Router();
bookingRouter.post('/check-availability',checkAvailabilityApi);
bookingRouter.post('/book',protect,createBooking);
bookingRouter.get('/user',protect,getUserBookings);
bookingRouter.get('/hotel', protect,getHotelBookings);

export default bookingRouter;
