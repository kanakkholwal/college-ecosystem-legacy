import mongoose, { Schema, type Document } from "mongoose";
import { ClubSchemaType, clubEventSchemaType, clubMemberSchemaType,clubProjectSchemaType } from "~/constants/clubs";

export type ClubTypeJson = ClubSchemaType & {
  _id: string;
};
export type ClubMemberTypeJson = clubMemberSchemaType & {
  userId: string;
  clubId: string;
  _id: string;
};
export type ClubEventTypeJson = clubEventSchemaType & {
  clubId: string;
  _id: string;
};
export type ClubProjectJson = clubProjectSchemaType & {
  clubId: string;
  _id: string;
};

export interface IClub extends Document, ClubSchemaType {}
export interface IClubMember extends Document, clubMemberSchemaType {
  userId: Schema.Types.ObjectId | null;
  clubId: Schema.Types.ObjectId;
}
export interface IClubEvent extends Document, clubEventSchemaType {
  clubId: Schema.Types.ObjectId;
}
export interface IClubProject extends Document, clubProjectSchemaType {
  clubId: Schema.Types.ObjectId;
}


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

const clubMemberSchema = new Schema<IClubMember>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    userId: { type: String, required: true },
    joinedDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },

    position: {
      type: String,
      default: "member",
    },

    connectedSocials: {
      github: { type: String, lowercase: true,default: null },
      linkedin: { type: String, lowercase: true, default: null },
      twitter: { type: String, lowercase: true, default: null },
      website: { type: String, lowercase: true, default: null },
      instagram: { type: String, lowercase: true, default: null },
    },
  },
  {
    timestamps:true,
  }
)

const clubEventSchema = new Schema<IClubEvent>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    poster: { type: String, required: true },
    tags: [{ type: String }],
  }
)

const clubProjectSchema = new Schema<IClubProject>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    url: { type: String, required: true },
    tags: [{ type: String }],
  }
)

export const ClubModel =  mongoose.models?.Club ||mongoose.model<IClub>("Club", clubSchema);
export const ClubMemberModel = mongoose.models?.ClubMember || mongoose.model<IClubMember>("ClubMember", clubMemberSchema);
export const ClubEventModel = mongoose.models?.ClubEvent || mongoose.model<IClubEvent>("ClubEvent",clubEventSchema);
export const ClubProjectModel = mongoose.models?.ClubProject || mongoose.model<IClubProject>("ClubProject", clubProjectSchema);
