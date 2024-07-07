import mongoose, { Document, Schema } from 'mongoose';

export type FileType = {
    name: string;
    path: string;
    contentType: string;
    uploadedAt: Date;
    uploadedBy: string;
    publicUrl: string;
    metadata: object;
}


export interface FileWithID  extends FileType {}

export interface IFile extends Document<FileType>{}


const FileSchema: Schema = new Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    contentType: { type: String, required: true },
    uploadedAt: { type: Date, required: true, default: Date.now },
    uploadedBy: { type: String, required: true },
    publicUrl: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, required: true },
},{ timestamps: true });

const FileModel =  mongoose.models.Files || mongoose.model<IFile>('File', FileSchema);
export default FileModel;
