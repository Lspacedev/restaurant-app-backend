import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  notifications: { type: Array, default: [String] },
  createdAt: { type: Date, default: Date.now() },
});
const User = mongoose.model("User", userSchema);
export default User;
