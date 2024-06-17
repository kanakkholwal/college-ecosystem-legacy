import mongoose, { Document, Schema } from 'mongoose';

interface IDepartment extends Document {
    name: string;
    hod: string;
    location: string;
}

const departmentSchema = new Schema<IDepartment>({
    name: String,
    hod: String,
    location: String,
});

const Department = mongoose.models.Department ||mongoose.model<IDepartment>('Department', departmentSchema);

export default Department;
