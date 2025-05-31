import {
    pgTable,
    text,
    timestamp
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const events = pgTable("global_events", {
    id: text("id").primaryKey().generatedAlwaysAs(nanoid(32)).notNull(),
    name: text("name").notNull(),
    description: text("description"), 
    time: timestamp("time").notNull(),
    created_by: text("created_by").notNull(), // User ID of the event creator

    start_date: timestamp("start_date").notNull(),
    end_date: timestamp("end_date").notNull(),
    color: text("color"), // Optional color for event
    

    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

