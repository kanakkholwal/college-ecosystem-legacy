import mongoose, { Schema, model, Document } from "mongoose";

export interface IWhisper extends Document {
  userId: string; // Optional if anonymous
  isAnonymous: boolean;
  content: string;
  labels: {
    hateSpeech: boolean;
    nsfw: boolean;
    toxic: boolean;
    normal: boolean;
  };
  status: "pending" | "approved" | "rejected"; // For moderation flow
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const WhisperSchema = new Schema<IWhisper>(
  {
    userId: { type: String,  required: true},
    isAnonymous: { type: Boolean, default: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },

    labels: {
      hateSpeech: { type: Boolean, default: false },
      nsfw: { type: Boolean, default: false },
      toxic: { type: Boolean, default: false },
      normal: { type: Boolean, default: true },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const WhisperModel = mongoose.models?.Whisper || model<IWhisper>("Whisper", WhisperSchema);
