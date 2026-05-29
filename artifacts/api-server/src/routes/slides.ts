import { Router } from "express";
import { db } from "@workspace/db";
import { slidesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/slides", async (req, res) => {
  try {
    const slides = await db
      .select()
      .from(slidesTable)
      .where(eq(slidesTable.isActive, true))
      .orderBy(asc(slidesTable.orderIndex));
    res.json(slides.map(formatSlide));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/slides/all", requireAuth, async (req, res) => {
  try {
    const slides = await db.select().from(slidesTable).orderBy(asc(slidesTable.orderIndex));
    res.json(slides.map(formatSlide));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/slides", requireAuth, async (req, res) => {
  try {
    const [slide] = await db.insert(slidesTable).values({
      imageUrl: req.body.imageUrl,
      headingFr: req.body.headingFr,
      headingEn: req.body.headingEn ?? null,
      subtextFr: req.body.subtextFr ?? null,
      subtextEn: req.body.subtextEn ?? null,
      cta1Text: req.body.cta1Text ?? null,
      cta1Url: req.body.cta1Url ?? null,
      cta2Text: req.body.cta2Text ?? null,
      cta2Url: req.body.cta2Url ?? null,
      orderIndex: req.body.orderIndex ?? 0,
      isActive: req.body.isActive ?? true,
    }).returning();
    res.status(201).json(formatSlide(slide));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/slides/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates: Record<string, any> = {};
    const fields = ["imageUrl","headingFr","headingEn","subtextFr","subtextEn","cta1Text","cta1Url","cta2Text","cta2Url","orderIndex","isActive"];
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    updates.updatedAt = new Date();
    const [updated] = await db.update(slidesTable).set(updates).where(eq(slidesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatSlide(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/slides/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(slidesTable).where(eq(slidesTable.id, req.params.id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatSlide(s: any) {
  return {
    id: s.id,
    imageUrl: s.imageUrl,
    headingFr: s.headingFr,
    headingEn: s.headingEn,
    subtextFr: s.subtextFr,
    subtextEn: s.subtextEn,
    cta1Text: s.cta1Text,
    cta1Url: s.cta1Url,
    cta2Text: s.cta2Text,
    cta2Url: s.cta2Url,
    orderIndex: s.orderIndex,
    isActive: s.isActive,
    createdAt: s.createdAt?.toISOString(),
    updatedAt: s.updatedAt?.toISOString(),
  };
}

export default router;
