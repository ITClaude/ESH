import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const downloadsTable = pgTable("downloads", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  category: text("category").notNull(),
  audience: text("audience").array(),
  publishDate: text("publish_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDownloadSchema = createInsertSchema(downloadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloadsTable.$inferSelect;
