import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  // 'direct' for 1-on-1 friends, 'group' for study groups
  type: { type: String, enum: ["direct", "group"], default: "direct" },
  
  // The name of the group (if it's a group chat)
  groupName: { type: String, default: "" },
  
  // The users involved in this chat
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  // The actual messages
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      senderName: { type: String },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);