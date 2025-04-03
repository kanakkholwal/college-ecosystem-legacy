import mongoose, { type Document, Schema } from "mongoose";

export interface IResultScrapingLog extends Document {
  list_type: string;
  processable: number;
  processed: number;
  failed: number;
  success: number;
  skipped: number;
  data: {
    roll_no: string;
    branch: string;
  }[];
  status: string;
  successfulRollNos: string[];
  failedRollNos: string[];
  skippedRollNos: string[];
  taskId: string;
  start_time: Date;
  end_time: Date | null;
}

const ResultScrapingLogSchema = new Schema({
  processable: { type: Number, required: true, default: 0 },
  processed: { type: Number, required: true, default: 0 },
  failed: { type: Number, required: true, default: 0 },
  success: { type: Number, required: true, default: 0 },
  skipped: { type: Number, required: true, default: 0 },
  data: { type: Array, required: true, default: [] },
  status: { type: String, required: true },
  successfulRollNos: { type: [String], required: true, default: [] },
  failedRollNos: { type: [String], required: true, default: [] },
  skippedRollNos: { type: [String], required: true, default: [] },
  list_type: { type: String, required: true },
  taskId: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date, default: null },
});

export const ResultScrapingLog =
  mongoose.models.ResultScrapingLog ||
  mongoose.model<IResultScrapingLog>(
    "ResultScrapingLog",
    ResultScrapingLogSchema
  );
