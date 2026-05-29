import { Router } from "express";
import { db } from "@workspace/db";
import { newsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatNews(n: any) {
  return {
    id: n.id,
    slug: n.slug,
    titleFr: n.titleFr,
    titleEn: n.titleEn,
    excerptFr: n.excerptFr,
    excerptEn: n.excerptEn,
    bodyFr: n.bodyFr,
    bodyEn: n.bodyEn,
    featuredImage: n.featuredImage,
    category: n.category,
    author: n.author,
    tags: n.tags ?? [],
    status: n.status,
    publishedAt: n.publishedAt?.toISOString() ?? null,
    createdAt: n.createdAt?.toISOString(),
    updatedAt: n.updatedAt?.toISOString(),
  };
}

router.get("/news", async (req, res) => {
  try {
    const { category, limit = "20", offset = "0" } = req.query as any;
    let query = db.select().from(newsTable).$dynamic();
    const conditions = [eq(newsTable.status, "published")];
    if (category) conditions.push(eq(newsTable.category, category));
    const articles = await query
      .where(and(...conditions))
      .orderBy(desc(newsTable.publishedAt))
      .limit(Number(limit))
      .offset(Number(offset));
    res.json(articles.map(formatNews));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news/all", requireAuth, async (req, res) => {
  try {
    const { status, category } = req.query as any;
    const conditions: any[] = [];
    if (status) conditions.push(eq(newsTable.status, status));
    if (category) conditions.push(eq(newsTable.category, category));
    const articles = conditions.length
      ? await db.select().from(newsTable).where(and(...conditions)).orderBy(desc(newsTable.createdAt))
      : await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
    res.json(articles.map(formatNews));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news/recent", async (req, res) => {
  try {
    const articles = await db.select().from(newsTable)
      .where(eq(newsTable.status, "published"))
      .orderBy(desc(newsTable.publishedAt))
      .limit(3);
    res.json(articles.map(formatNews));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news/:slug", async (req, res) => {
  try {
    const [article] = await db.select().from(newsTable).where(eq(newsTable.slug, req.params.slug));
    if (!article) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatNews(article));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/news", requireAuth, async (req, res) => {
  try {
    const baseSlug = slugify(req.body.titleFr || "article");
    const slug = `${baseSlug}-${Date.now()}`;
    const [article] = await db.insert(newsTable).values({
      slug,
      titleFr: req.body.titleFr,
      titleEn: req.body.titleEn ?? null,
      excerptFr: req.body.excerptFr,
      excerptEn: req.body.excerptEn ?? null,
      bodyFr: req.body.bodyFr,
      bodyEn: req.body.bodyEn ?? null,
      featuredImage: req.body.featuredImage ?? null,
      category: req.body.category ?? null,
      author: req.body.author,
      tags: req.body.tags ?? [],
      status: req.body.status ?? "draft",
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : null,
    }).returning();
    res.status(201).json(formatNews(article));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/news/:id/update", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["titleFr","titleEn","excerptFr","excerptEn","bodyFr","bodyEn","featuredImage","category","author","tags","status"];
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    if (req.body.publishedAt !== undefined) updates.publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt) : null;
    updates.updatedAt = new Date();
    const [updated] = await db.update(newsTable).set(updates).where(eq(newsTable.id, req.params.id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatNews(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/news/:id/delete", requireAuth, async (req, res) => {
  try {
    await db.delete(newsTable).where(eq(newsTable.id, req.params.id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
