import { Router } from "express";
import { db } from "@workspace/db";
import { galleryAlbumsTable, galleryItemsTable } from "@workspace/db";
import { eq, desc, and, asc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function formatAlbum(a: any, itemCount = 0) {
  return {
    id: a.id,
    nameFr: a.nameFr,
    nameEn: a.nameEn,
    coverImage: a.coverImage,
    descriptionFr: a.descriptionFr,
    descriptionEn: a.descriptionEn,
    category: a.category,
    eventDate: a.eventDate,
    isVisible: a.isVisible,
    itemCount,
    createdAt: a.createdAt?.toISOString(),
    updatedAt: a.updatedAt?.toISOString(),
  };
}

function formatItem(i: any) {
  return {
    id: i.id,
    albumId: i.albumId,
    mediaUrl: i.mediaUrl,
    mediaType: i.mediaType,
    captionFr: i.captionFr,
    captionEn: i.captionEn,
    altText: i.altText,
    orderIndex: i.orderIndex,
    createdAt: i.createdAt?.toISOString(),
  };
}

router.get("/gallery/albums", async (req, res) => {
  try {
    const { category } = req.query as any;
    const conditions: any[] = [eq(galleryAlbumsTable.isVisible, true)];
    if (category) conditions.push(eq(galleryAlbumsTable.category, category));
    const albums = await db.select().from(galleryAlbumsTable).where(and(...conditions)).orderBy(desc(galleryAlbumsTable.eventDate));
    const withCounts = await Promise.all(albums.map(async (a) => {
      const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(galleryItemsTable).where(eq(galleryItemsTable.albumId, a.id));
      return formatAlbum(a, Number(count));
    }));
    res.json(withCounts);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/gallery/albums/all", requireAuth, async (req, res) => {
  try {
    const albums = await db.select().from(galleryAlbumsTable).orderBy(desc(galleryAlbumsTable.eventDate));
    const withCounts = await Promise.all(albums.map(async (a) => {
      const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(galleryItemsTable).where(eq(galleryItemsTable.albumId, a.id));
      return formatAlbum(a, Number(count));
    }));
    res.json(withCounts);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/gallery/preview", async (req, res) => {
  try {
    const items = await db.select().from(galleryItemsTable).orderBy(desc(galleryItemsTable.createdAt)).limit(6);
    res.json(items.map(formatItem));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/gallery/albums/:id", async (req, res) => {
  try {
    const [album] = await db.select().from(galleryAlbumsTable).where(eq(galleryAlbumsTable.id, req.params.id));
    if (!album) { res.status(404).json({ error: "Not found" }); return; }
    const items = await db.select().from(galleryItemsTable).where(eq(galleryItemsTable.albumId, album.id)).orderBy(asc(galleryItemsTable.orderIndex));
    res.json({ ...formatAlbum(album, items.length), items: items.map(formatItem) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery/albums", requireAuth, async (req, res) => {
  try {
    const [album] = await db.insert(galleryAlbumsTable).values({
      nameFr: req.body.nameFr,
      nameEn: req.body.nameEn ?? null,
      coverImage: req.body.coverImage ?? null,
      descriptionFr: req.body.descriptionFr ?? null,
      descriptionEn: req.body.descriptionEn ?? null,
      category: req.body.category,
      eventDate: req.body.eventDate,
      isVisible: req.body.isVisible ?? true,
    }).returning();
    res.status(201).json(formatAlbum(album));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/gallery/albums/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["nameFr","nameEn","coverImage","descriptionFr","descriptionEn","category","eventDate","isVisible"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    updates.updatedAt = new Date();
    const [updated] = await db.update(galleryAlbumsTable).set(updates).where(eq(galleryAlbumsTable.id, req.params["id"] as string)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatAlbum(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/albums/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(galleryAlbumsTable).where(eq(galleryAlbumsTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery/albums/:albumId/items", requireAuth, async (req, res) => {
  try {
    const [item] = await db.insert(galleryItemsTable).values({
      albumId: req.params["albumId"] as string,
      mediaUrl: req.body.mediaUrl,
      mediaType: req.body.mediaType ?? "photo",
      captionFr: req.body.captionFr ?? null,
      captionEn: req.body.captionEn ?? null,
      altText: req.body.altText ?? null,
      orderIndex: req.body.orderIndex ?? 0,
    }).returning();
    res.status(201).json(formatItem(item));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/gallery/items/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["mediaUrl","captionFr","captionEn","altText","orderIndex"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    const [updated] = await db.update(galleryItemsTable).set(updates).where(eq(galleryItemsTable.id, req.params["id"] as string)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatItem(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/items/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(galleryItemsTable).where(eq(galleryItemsTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
