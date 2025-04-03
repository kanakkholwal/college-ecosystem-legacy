// import dbConnect from "~/lib/dbConnect";
// import { StudentModel, HostelRoomModel, RoomMemberModel, AllotmentSlotModel } from "~/models/allotment";
// import mongoose from "mongoose";

// // Helper function to allocate a student to a room based on CGPI
// type AllocateStudentParams = {
//     rollNo: string;
//     hostelId: string;
// };

// export async function allocateStudentToRoom({ rollNo, hostelId }: AllocateStudentParams) {
//     await dbConnect();
    
//     const student = await StudentModel.findOne({ roll_no: rollNo, hostel_id: hostelId });
//     if (!student) throw new Error("Student not found");

//     const availableRoom = await HostelRoomModel.findOne({
//         hostel_id: hostelId,
//         occupied_seats: { $lt: "$seater" },
//         is_locked: false,
//     }).sort({ occupied_seats: 1 });

//     if (!availableRoom) throw new Error("No available rooms");
    
//     student.allotted_room_id = availableRoom._id as mongoose.Types.ObjectId;
//     availableRoom.occupied_seats += 1;
    
//     await student.save();
//     await availableRoom.save();
    
//     return { student, room: availableRoom };
// }

// // Helper function to lock a room once fully occupied
// export async function lockRoomIfFull(roomId: string) {
//     await dbConnect();
    
//     const room = await HostelRoomModel.findById(roomId);
//     if (!room) throw new Error("Room not found");
    
//     if (room.occupied_seats >= room.seater) {
//         room.is_locked = true;
//         await room.save();
//     }
// }

// // Helper function to assign allotment slot to a student
// type AssignSlotParams = {
//     rollNo: string;
//     slotId: string;
// };

// export async function assignAllotmentSlot({ rollNo, slotId }: AssignSlotParams) {
//     await dbConnect();
    
//     const student = await StudentModel.findOne({ roll_no: rollNo });
//     if (!student) throw new Error("Student not found");
    
//     student.allotment_slot_id = new mongoose.Types.ObjectId(slotId);
//     await student.save();
// }