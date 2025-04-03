import mongoose, { Schema, type Document } from "mongoose";

// 🏫 HostelStudents Schema
export interface IHostelStudent extends Document {
    rollNo: string;
    name: string;
    batch: number;
    cgpi: number;
    allotted_room_id?: mongoose.Types.ObjectId;
    allotment_slot_id?: mongoose.Types.ObjectId;
    hostel: mongoose.Types.ObjectId;
}

// 🏠 Hostel Rooms Schema
export interface IHostelRoom extends Document {
    block: string;
    room_number: number;
    seater: number;
    occupied_seats: number;
    host_rollNo?: string;
    is_locked: boolean;
    hostel: mongoose.Types.ObjectId;
}

const HostelRoomSchema = new Schema<IHostelRoom>({
    block: { type: String, required: true },
    room_number: { type: Number, required: true },
    seater: { type: Number, required: true, min: 1, max: 7 },
    occupied_seats: { type: Number, default: 0 },
    host_rollNo: { type: String, ref: "HostelStudent" },
    is_locked: { type: Boolean, default: false },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
});

export const HostelRoomModel = mongoose.model<IHostelRoom>("HostelRoom", HostelRoomSchema);

// 👥 Room Members Schema
export interface IRoomMember extends Document {
    student_rollNo: string;
    room_id: mongoose.Types.ObjectId;
    hosted_id?: string;
    hostel: mongoose.Types.ObjectId;
    joined_at: Date;
    last_updated: Date;
}

const RoomMemberSchema = new Schema<IRoomMember>({
    student_rollNo: { type: String, ref: "HostelStudent", required: true },
    room_id: { type: Schema.Types.ObjectId, ref: "HostelRoom", required: true },
    hosted_id: { type: String, ref: "HostelStudent" },
    hostel: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    joined_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
});

export const RoomMemberModel = mongoose.model<IRoomMember>("RoomMember", RoomMemberSchema);

// ⏳ Allotment Slots Schema
export interface IAllotmentSlot extends Document {
    slot_number: number;
    start_time: Date;
    end_time: Date;
    is_active: boolean;
    allotment_date: Date;
    hostel: mongoose.Types.ObjectId;
}

const AllotmentSlotSchema = new Schema<IAllotmentSlot>({
    slot_number: { type: Number, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    is_active: { type: Boolean, default: false },
    allotment_date: { type: Date, required: true },
    hostel: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
});

export const AllotmentSlotModel = mongoose.model<IAllotmentSlot>("AllotmentSlot", AllotmentSlotSchema);
