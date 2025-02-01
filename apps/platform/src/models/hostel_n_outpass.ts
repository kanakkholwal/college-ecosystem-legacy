import mongoose, { type Document, Schema } from "mongoose";
import ResultModel from "./result";

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
export interface HostelTypeWithStudents
  extends Omit<RawHostelType, "students"> {
  _id: string;
  students: IHostelStudentType[];
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

export interface rawHostelStudentType {
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

export type HostelStudentType = Omit<rawHostelStudentType, "hostelId"> & {
  hostelId: Pick<IHostelType, "_id" | "name" | "slug" | "gender">;
  _id: string;
};
// | rawHostelStudentType & { _id: string;}

export interface IHostelStudentType extends Document, rawHostelStudentType {}
// HostelStudent Schema & Model
const HostelStudentSchema = new Schema(
  {
    rollNumber: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    position: { type: String, default: "none" },
    userId: { type: String, default: null },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", default: null },
    roomNumber: { type: String, required: true, default: "UNKNOWN" },
    phoneNumber: { type: String, default: null },
    banned: { type: Boolean, default: false },
    bannedTill: { type: Date },
    bannedReason: { type: String },
  },
  { timestamps: true }
);

export interface rawOutPassType {
  student: string;
  roomNumber: string;
  address: string;
  reason: "outing" | "medical" | "home" | "market" | "other";
  expectedOutTime: Date;
  expectedInTime: Date;
  actualOutTime: Date | null;
  actualInTime: Date | null;
  status: "pending" | "approved" | "rejected" | "in_use" | "processed";
  validTill: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IOutPassType extends Document, rawOutPassType {}

export type OutPassType = Omit<rawOutPassType, "student" | "hostel"> & {
  student: Pick<IHostelStudentType, "_id" | "name" | "email" | "rollNumber">;
  hostel: Pick<IHostelType, "_id" | "name" | "slug" | "gender">;
  _id: string;
};

// Out_pass Schema
const OutPassSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "HostelStudent",
      required: true,
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
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
    validTill: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "in_use", "processed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// 🟢 Pre-remove hook to clean up students if hostel is deleted
HostelSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await HostelStudentModel.updateMany(
      { hostelId: this._id },
      { hostelId: null }
    );
    next();
  }
);

// 🔴 Post-save hook for logging
HostelSchema.post("save", (doc) => {
  console.log(`✅ Hostel Created/Updated: ${doc.name}`);
});

// 🔵 Indexes for performance
HostelStudentSchema.index({ email: 1, hostelId: 1 }, { unique: true });
HostelStudentSchema.index({ rollNumber: 1 }, { unique: true });

// 🟢 Pre-save hook: Ensure gender consistency with hostel
// HostelStudentSchema.pre("save", async function (next) {
//   const hostel = await HostelModel.findById(this.hostelId);
//   if (!hostel) {
//     return next(new Error("Hostel does not exist"));
//   }

//   if (this.gender !== hostel.gender) {
//     return next(new Error("Student gender does not match hostel gender"));
//   }

//   next();
// });

// 🔴 Post-save hook: Auto-update ResultModel gender if missing
HostelStudentSchema.post("save", async (doc) => {
  await ResultModel.updateOne(
    { rollNo: doc.rollNumber, gender: "not_specified" },
    { $set: { gender: doc.gender } }
  );
});
// 🔄 Instance Method: Change room number
HostelStudentSchema.methods.changeRoom = async function (newRoom: string) {
  this.roomNumber = newRoom;
  return await this.save();
};
// 🏠 Static Method: Get students by hostel
HostelStudentSchema.statics.getStudentsByHostel = async function (
  hostelId: string
): Promise<IHostelStudentType[]> {
  return await this.find({ hostelId }).lean();
};
// 🔄 Static Method: Transfer students between hostels
HostelStudentSchema.statics.transferStudents = async function (
  studentEmails: string[],
  newHostelId: string
) {
  const newHostel = await HostelModel.findById(newHostelId);
  if (!newHostel) {
    throw new Error("New hostel not found");
  }

  // Update students only if the gender matches
  const updated = await this.updateMany(
    { email: { $in: studentEmails }, gender: newHostel.gender },
    { $set: { hostelId: newHostelId, roomNumber: "UNKNOWN" } }
  );

  if (updated.matchedCount === 0) {
    throw new Error("No students matched the transfer criteria");
  }

  return {
    success: true,
    message: `${updated.modifiedCount} students transferred successfully`,
  };
};

export const HostelStudentModel =
  mongoose.models?.HostelStudent ||
  mongoose.model<IHostelStudentType>("HostelStudent", HostelStudentSchema);

export const HostelModel =
  mongoose.models?.Hostel ||
  mongoose.model<IHostelType>("Hostel", HostelSchema);

export const OutPassModel =
  mongoose.models?.OutPass ||
  mongoose.model<IOutPassType>("OutPass", OutPassSchema);
