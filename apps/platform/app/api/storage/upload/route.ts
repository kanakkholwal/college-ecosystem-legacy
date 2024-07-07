import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'src/lib/auth';
import admin from 'src/lib/firebaseAdmin';

import dbConnect from 'src/lib/dbConnect';
import FileModel from 'src/models/file';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const data = await req.formData()

        console.log(data);

        const file = data.get('file') as File;
        if (!file) {
            return new NextResponse('No file uploaded', { status: 400 });
        }
        const name = data.get('name') ? data.get('name') as string : file.name;
        const path = data.get('path') as string;

        const uploadedAt = new Date().toISOString();
        const uploadedBy = session.user._id;
        

        const bucket = admin.storage().bucket(`gs://` + process.env.FIREBASE_STORAGE_BUCKET);

        // Read the file content as a buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileRef = bucket.file(path);
        await fileRef.save(buffer, {
            metadata: {
                contentType: file.type,
                metadata: {
                    name,
                    uploadedAt,
                    uploadedBy,
                },
            },
        });

        // Get the file metadata after upload
        const [metadata] = await fileRef.getMetadata();

        // Make the file public
        await fileRef.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${path}`;

        console.log('File uploaded successfully:', publicUrl);
        await dbConnect();
        const newFile = new FileModel({
            name,
            path,
            contentType: file.type,
            uploadedAt,
            uploadedBy,
            publicUrl,
            metadata,
        });
        await newFile.save();


        return NextResponse.json({ message: 'File uploaded successfully', file: newFile});
    } catch (error) {
        console.error('Error uploading file:', error);
        return new NextResponse('Error uploading file', { status: 500 });
    }
}
