import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  
  // Is it private (just for them) or published to Global Reels?
  isGlobal: { type: Boolean, default: false },
  
  // Social metrics
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users who liked it
  
}, { timestamps: true });

export default mongoose.model("Reel", reelSchema);