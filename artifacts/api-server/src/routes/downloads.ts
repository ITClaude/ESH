import { Router } from "express";
import { db } from "@workspace/db";
import { downloadsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function formatDownload(d: any) {
  return {
    id: d.id,
    titleFr: d.titleFr,
    titleEn: d.titleEn,
    fileUrl: d.fileUrl,
    fileType: d.fileType,
    category: d.category,
    audience: d.audience ?? [],
    publishDate: d.publishDate,
    isActive: d.isActive,
    createdAt: d.createdAt?.toISOString(),
    updatedAt: d.updatedAt?.toISOString(),
  };
}

router.get("/downloads", async (req, res) => {
  try {
    const { category, audience } = req.query as any;
    const conditions: any[] = [eq(downloadsTable.isActive, true)];
    if (category) conditions.push(eq(downloadsTable.category, category));
    const items = await db.select().from(downloadsTable).where(and(...conditions)).orderBy(desc(downloadsTable.publishDate));
    res.json(items.map(formatDownload));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/downloads/all", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(downloadsTable).orderBy(desc(downloadsTable.publishDate));
    res.json(items.map(formatDownload));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/downloads", requireAuth, async (req, res) => {
  try {
    const [item] = await db.insert(downloadsTable).values({
      titleFr: req.body.titleFr,
      titleEn: req.body.titleEn ?? null,
      fileUrl: req.body.fileUrl,
      fileType: req.body.fileType ?? null,
      category: req.body.category,
      audience: req.body.audience ?? ["all"],
      publishDate: req.body.publishDate,
      isActive: req.body.isActive ?? true,
    }).returning();
    res.status(201).json(formatDownload(item));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/downloads/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["titleFr","titleEn","fileUrl","fileType","category","audience","publishDate","isActive"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    updates.updatedAt = new Date();
    const [updated] = await db.update(downloadsTable).set(updates).where(eq(downloadsTable.id, req.params.id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatDownload(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/downloads/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(downloadsTable).where(eq(downloadsTable.id, req.params.id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
