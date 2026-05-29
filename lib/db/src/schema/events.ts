import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en"),
  eventType: text("event_type").notNull(),
  startDatetime: timestamp("start_datetime").notNull(),
  endDatetime: timestamp("end_datetime"),
  locationFr: text("location_fr").notNull(),
  locationEn: text("location_en"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  featuredImage: text("featured_image"),
  audience: text("audience").array(),
  status: text("status").notNull().default("upcoming"),
  showOnHomepage: boolean("show_on_homepage").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
