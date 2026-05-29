import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const slidesTable = pgTable("slides", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  imageUrl: text("image_url").notNull(),
  headingFr: text("heading_fr").notNull(),
  headingEn: text("heading_en"),
  subtextFr: text("subtext_fr"),
  subtextEn: text("subtext_en"),
  cta1Text: text("cta1_text"),
  cta1Url: text("cta1_url"),
  cta2Text: text("cta2_text"),
  cta2Url: text("cta2_url"),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSlideSchema = createInsertSchema(slidesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSlide = z.infer<typeof insertSlideSchema>;
export type Slide = typeof slidesTable.$inferSelect;
