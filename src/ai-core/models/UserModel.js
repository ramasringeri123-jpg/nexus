import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Links to their Firebase login UID
  firebaseUid: { type: String, required: true, unique: true }, 
  
  username: { type: String, unique: true },
  displayName: { type: String },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, default: "" },
  
  // Social & Premium
  isPremium: { type: Boolean, default: false },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of friends
  
  // Time Tracking (Stored in minutes)
  totalMinutesStudied: { type: Number, default: 0 },
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);