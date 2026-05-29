import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const classesTable = pgTable("classes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  classCode: text("class_code").notNull().unique(),
  division: text("division").notNull(),
  teacherId: text("teacher_id"),
  assistantId: text("assistant_id"),
  descFr: text("desc_fr"),
  descEn: text("desc_en"),
  photoUrl: text("photo_url"),
  studentCount: integer("student_count").notNull().default(0),
  timetableUrl: text("timetable_url"),
  showOnWebsite: boolean("show_on_website").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClassSchema = createInsertSchema(classesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertClass = z.infer<typeof insertClassSchema>;
export type SchoolClass = typeof classesTable.$inferSelect;
