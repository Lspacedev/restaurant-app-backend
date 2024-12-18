import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});
const Review = mongoose.model("Review", reviewSchema);
export default Review;
