import mongoose, { Schema, type Document } from "mongoose";
import { ClubSchemaType } from "~/constants/clubs";

export type ClubTypeJson = ClubSchemaType & {
  _id: string;
};

export interface IClub extends Document, ClubSchemaType {}


const clubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },

    type: { type: String, enum: ["public", "private"], default: "public" },
    club_type: { type: String, enum: ["society", "club"], default: "club" },
    operationAs: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "offline",
    },
    operationSpan: {
      type: String,
      enum: ["semester", "year"],
      default: "semester",
    },
    category: { type: String, required: true },

    members: [{ type: String, required: true }],
    tags: [{ type: String }],

    isVerified: { type: Boolean, default: false },
    clubEmail: { type: String, lowercase: true, unique: true, required: true },
    isClubEmailVerified: { type: Boolean, default: false },

    subDomain: { type: String, required: true ,unique: true},
    customDomain: { type: String },

    theme: {
      primaryColor: { type: String, },
      secondaryColor: { type: String,  },
      territoryColor: { type: String, },
      backgroundColor: { type: String, },
      textColor: { type: String, },
    },

    president:{
        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        phoneNumber: { type: String },
    }
  },
  {
    timestamps:true,
  }
);


export const ClubModel =  mongoose.models?.Club ||mongoose.model<IClub>("Club", clubSchema);
