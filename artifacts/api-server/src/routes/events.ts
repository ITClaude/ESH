import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db";
import { eq, desc, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function formatEvent(e: any) {
  return {
    id: e.id,
    titleFr: e.titleFr,
    titleEn: e.titleEn,
    eventType: e.eventType,
    startDatetime: e.startDatetime?.toISOString(),
    endDatetime: e.endDatetime?.toISOString() ?? null,
    locationFr: e.locationFr,
    locationEn: e.locationEn,
    descriptionFr: e.descriptionFr,
    descriptionEn: e.descriptionEn,
    featuredImage: e.featuredImage,
    audience: e.audience ?? [],
    status: e.status,
    showOnHomepage: e.showOnHomepage,
    createdAt: e.createdAt?.toISOString(),
    updatedAt: e.updatedAt?.toISOString(),
  };
}

router.get("/events", async (req, res) => {
  try {
    const { status, limit = "20" } = req.query as any;
    const conditions: any[] = [];
    if (status) conditions.push(eq(eventsTable.status, status));
    const events = conditions.length
      ? await db.select().from(eventsTable).where(and(...conditions)).orderBy(asc(eventsTable.startDatetime)).limit(Number(limit))
      : await db.select().from(eventsTable).orderBy(asc(eventsTable.startDatetime)).limit(Number(limit));
    res.json(events.map(formatEvent));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/all", requireAuth, async (req, res) => {
  try {
    const events = await db.select().from(eventsTable).orderBy(asc(eventsTable.startDatetime));
    res.json(events.map(formatEvent));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/homepage", async (req, res) => {
  try {
    const events = await db.select().from(eventsTable)
      .where(and(eq(eventsTable.showOnHomepage, true), eq(eventsTable.status, "upcoming")))
      .orderBy(asc(eventsTable.startDatetime))
      .limit(5);
    res.json(events.map(formatEvent));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, req.params.id));
    if (!event) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatEvent(event));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events", requireAuth, async (req, res) => {
  try {
    const [event] = await db.insert(eventsTable).values({
      titleFr: req.body.titleFr,
      titleEn: req.body.titleEn ?? null,
      eventType: req.body.eventType,
      startDatetime: new Date(req.body.startDatetime),
      endDatetime: req.body.endDatetime ? new Date(req.body.endDatetime) : null,
      locationFr: req.body.locationFr,
      locationEn: req.body.locationEn ?? null,
      descriptionFr: req.body.descriptionFr ?? null,
      descriptionEn: req.body.descriptionEn ?? null,
      featuredImage: req.body.featuredImage ?? null,
      audience: req.body.audience ?? [],
      status: req.body.status ?? "upcoming",
      showOnHomepage: req.body.showOnHomepage ?? false,
    }).returning();
    res.status(201).json(formatEvent(event));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/events/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["titleFr","titleEn","eventType","locationFr","locationEn","descriptionFr","descriptionEn","featuredImage","audience","status","showOnHomepage"];
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    if (req.body.startDatetime !== undefined) updates.startDatetime = new Date(req.body.startDatetime);
    if (req.body.endDatetime !== undefined) updates.endDatetime = req.body.endDatetime ? new Date(req.body.endDatetime) : null;
    updates.updatedAt = new Date();
    const [updated] = await db.update(eventsTable).set(updates).where(eq(eventsTable.id, req.params.id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatEvent(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/events/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, req.params.id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
