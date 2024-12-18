import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: Array, required: true },
  about: { type: String, required: true },
  phone: { type: Number, required: true },
  days: { type: String },
  hours: { type: String },
  menu: [String],
  tags: [String],
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now() },
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
