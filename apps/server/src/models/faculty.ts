import mongoose, { Schema, type Document } from 'mongoose';

interface FacultyType extends Document {
    name: string;
    email: string;
    department: string;
}

const facultySchema = new Schema<FacultyType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true }
});

const Faculty =
    mongoose.models?.Faculty || mongoose.model<FacultyType>("Faculty", facultySchema);

export default Faculty;