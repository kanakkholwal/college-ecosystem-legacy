// app/api/db-status/route.ts

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { db } from '~/db/connect';

const MONGODB_URI = process.env.MONGODB_URI!;
const POSTGRES_URL = process.env.POSTGRES_URL!;

// -- MongoDB Connection Utility --
let cachedMongo: typeof mongoose | null = null;

async function checkMongoConnection(): Promise<'connected' | string> {
  try {
    if (!cachedMongo) {
      mongoose.set('strictQuery', true);
      await mongoose.connect(MONGODB_URI);
      cachedMongo = mongoose;
    }
    const state = cachedMongo.connection.readyState;
    // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
    return state === 1 ? 'connected' : `state:${state}`;
  } catch (err: any) {
    return err.message;
  }
}


async function checkPostgresConnection(): Promise<'connected' | string> {
  try {
    
    // simple query to verify connectivity
    await db.query.accounts.findFirst({

    })
    return 'connected';
  } catch (err: any) {
    return err.message;
  }
}

export async function GET() {
  const [mongoStatus, pgStatus] = await Promise.all([
    checkMongoConnection(),
    checkPostgresConnection(),
  ]);

  const payload = {
    mongodb: mongoStatus === 'connected' ? 'connected' : `error: ${mongoStatus}`,
    postgres: pgStatus === 'connected' ? 'connected' : `error: ${pgStatus}`,
  };

  return NextResponse.json(payload);
}
