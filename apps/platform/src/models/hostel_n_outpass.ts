import mongoose, { type Document, Schema } from "mongoose";

export interface RawHostelType {
  name: string;
  slug: string;
  gender: "male" | "female" | "guest_hostel";
  administrators: {
    name: string;
    email: string;
    role: "warden" | "mmca" | "assistant_warden";
    userId: string;
  }[];
  students: string[];
  warden: {
    name: string;
    email: string;
    userId: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
export interface HostelType extends RawHostelType {
  _id: string;
}
export interface IHostelType extends Document, RawHostelType {}

// Hostel Schema & Model
const HostelSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    gender: {
      type: String,
      enum: ["male", "female", "guest_hostel"],
      required: true,
    },
    administrators: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: {
          type: String,
          enum: ["warden", "mmca", "assistant_warden"],
          required: true,
        },
        userId: { type: String, default: null },
      },
    ],
    warden: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      userId: { type: String, default: null },
    },
    students: {
      type: [{ type: Schema.Types.ObjectId, ref: "HostelStudent" }],
      default: [],
    },
  },
  { timestamps: true }
);

export const HostelModel =
  mongoose.models?.Hostel ||
  mongoose.model<IHostelType>("Hostel", HostelSchema);

export interface IHostelStudentType extends Document {
  rollNumber: string;
  userId: string;
  name: string;
  email: string;
  gender: "male" | "female";
  position: string;
  hostelId: string | null;
  roomNumber: string;
  phoneNumber?: string | null;
  banned: boolean;
  bannedTill?: Date;
  bannedReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

// HostelStudent Schema & Model
const HostelStudentSchema = new Schema(
  {
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    gender: { type: String, required: true, enum: ["male", "female"] },
    position: { type: String, default: "none" },
    userId: { type: String, default: null },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", default: null },
    roomNumber: { type: String, required: true },
    phoneNumber: { type: String, default: null , unique: true},
    banned: { type: Boolean, default: false },
    bannedTill: { type: Date },
    bannedReason: { type: String },
  },
  { timestamps: true }
);

export const HostelStudentModel =
  mongoose.models?.HostelStudent ||
  mongoose.model<IHostelStudentType>("HostelStudent", HostelStudentSchema);

export interface IOutPassType extends Document {
  student: string;
  roomNumber: string;
  address: string;
  reason: "outing" | "medical" | "home" | "market" | "other";
  expectedOutTime: Date;
  expectedInTime: Date;
  actualOutTime: Date;
  actualInTime: Date;
  status: "pending" | "approved" | "rejected";
  validTill: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Out_pass Schema & Model
const OutPassSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "HostelStudent",
      required: true,
    },
    roomNumber: { type: String, required: true },
    address: { type: String, required: true },
    reason: {
      type: String,
      required: true,
      enum: ["outing", "medical", "home", "market", "other"],
    },
    expectedInTime: { type: Date, required: true },
    expectedOutTime: { type: Date, required: true },
    actualInTime: { type: Date, default: null },
    actualOutTime: { type: Date, default: null },
    validTill: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const OutPassModel =
  mongoose.models?.OutPass ||
  mongoose.model<IOutPassType>("OutPass", OutPassSchema);
