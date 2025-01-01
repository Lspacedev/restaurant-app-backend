import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  userId: { type: String, required: true },
  day: { type: String, required: true },
  hour: { type: String, required: true },
  guest: { type: Number, required: true },
  status: { type: String, default: "pending", required: true },

  createdAt: { type: Date, default: Date.now() },
});
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
