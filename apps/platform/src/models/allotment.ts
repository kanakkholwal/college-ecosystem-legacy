import mongoose, { Schema, Document } from "mongoose";

// 🏫 Students Schema
export interface IStudent extends Document {
    roll_no: string;
    name: string;
    batch: number;
    cgpi: number;
    allotted_room_id?: mongoose.Types.ObjectId;
    allotment_slot_id?: mongoose.Types.ObjectId;
    hostel_id: mongoose.Types.ObjectId;
}

const StudentSchema = new Schema<IStudent>({
    roll_no: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    batch: { type: Number, required: true },
    cgpi: { type: Number, required: true },
    allotted_room_id: { type: Schema.Types.ObjectId, ref: "HostelRoom" },
    allotment_slot_id: { type: Schema.Types.ObjectId, ref: "AllotmentSlot" },
    hostel_id: { type: Schema.Types.ObjectId, ref: "Hostel" },
});

export const StudentModel = mongoose.model<IStudent>("Student", StudentSchema);

// 🏠 Hostel Rooms Schema
export interface IHostelRoom extends Document {
    block: string;
    room_number: number;
    seater: number;
    occupied_seats: number;
    host_roll_no?: string;
    is_locked: boolean;
    hostel_id: mongoose.Types.ObjectId;
}

const HostelRoomSchema = new Schema<IHostelRoom>({
    block: { type: String, required: true },
    room_number: { type: Number, required: true },
    seater: { type: Number, required: true, min: 1, max: 7 },
    occupied_seats: { type: Number, default: 0 },
    host_roll_no: { type: String, ref: "Student" },
    is_locked: { type: Boolean, default: false },
    hostel_id: { type: Schema.Types.ObjectId, ref: "Hostel" },
});

export const HostelRoomModel = mongoose.model<IHostelRoom>("HostelRoom", HostelRoomSchema);

// 👥 Room Members Schema
export interface IRoomMember extends Document {
    student_roll_no: string;
    room_id: mongoose.Types.ObjectId;
    hosted_id?: string;
    hostel_id: mongoose.Types.ObjectId;
    joined_at: Date;
    last_updated: Date;
}

const RoomMemberSchema = new Schema<IRoomMember>({
    student_roll_no: { type: String, ref: "Student", required: true },
    room_id: { type: Schema.Types.ObjectId, ref: "HostelRoom", required: true },
    hosted_id: { type: String, ref: "Student" },
    hostel_id: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
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
    hostel_id: mongoose.Types.ObjectId;
}

const AllotmentSlotSchema = new Schema<IAllotmentSlot>({
    slot_number: { type: Number, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    is_active: { type: Boolean, default: false },
    allotment_date: { type: Date, required: true },
    hostel_id: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
});

export const AllotmentSlotModel = mongoose.model<IAllotmentSlot>("AllotmentSlot", AllotmentSlotSchema);
