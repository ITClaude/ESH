import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryAlbumsTable = pgTable("gallery_albums", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en"),
  coverImage: text("cover_image"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  category: text("category").notNull(),
  eventDate: text("event_date").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const galleryItemsTable = pgTable("gallery_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  albumId: text("album_id").notNull().references(() => galleryAlbumsTable.id, { onDelete: "cascade" }),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull().default("photo"),
  captionFr: text("caption_fr"),
  captionEn: text("caption_en"),
  altText: text("alt_text"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAlbumSchema = createInsertSchema(galleryAlbumsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGalleryItemSchema = createInsertSchema(galleryItemsTable).omit({ id: true, createdAt: true });
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryAlbum = typeof galleryAlbumsTable.$inferSelect;
export type GalleryItem = typeof galleryItemsTable.$inferSelect;
