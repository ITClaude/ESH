import { Router } from "express";
import { db } from "@workspace/db";
import {
  slidesTable, newsTable, eventsTable, galleryAlbumsTable,
  staffTable, classesTable, downloadsTable, contactMessagesTable, activityLogTable,
  siteSettingsTable,
} from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

async function getStats() {
  const [studentsRow] = await db.select({ v: siteSettingsTable.value }).from(siteSettingsTable).where(eq(siteSettingsTable.key, "totalStudentsDisplay"));
  const totalStudents = parseInt(studentsRow?.v ?? "290");

  const [{ count: totalClasses }] = await db.select({ count: sql<number>`count(*)` }).from(classesTable);
  const [{ count: totalStaff }] = await db.select({ count: sql<number>`count(*)` }).from(staffTable).where(eq(staffTable.isActive, true));
  const [{ count: totalNews }] = await db.select({ count: sql<number>`count(*)` }).from(newsTable);
  const [{ count: totalEvents }] = await db.select({ count: sql<number>`count(*)` }).from(eventsTable);
  const [{ count: totalAlbums }] = await db.select({ count: sql<number>`count(*)` }).from(galleryAlbumsTable);
  const [{ count: pendingMessages }] = await db.select({ count: sql<number>`count(*)` }).from(contactMessagesTable).where(eq(contactMessagesTable.isRead, false));
  const [{ count: totalDownloads }] = await db.select({ count: sql<number>`count(*)` }).from(downloadsTable).where(eq(downloadsTable.isActive, true));

  return {
    totalStudents,
    totalClasses: Number(totalClasses),
    totalStaff: Number(totalStaff),
    totalNews: Number(totalNews),
    totalEvents: Number(totalEvents),
    totalAlbums: Number(totalAlbums),
    pendingMessages: Number(pendingMessages),
    totalDownloads: Number(totalDownloads),
  };
}

router.get("/dashboard/stats", requireAuth, async (req, res) => {
  try {
    res.json(await getStats());
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/overview", requireAuth, async (req, res) => {
  try {
    const stats = await getStats();

    const recentNews = await db.select().from(newsTable)
      .where(eq(newsTable.status, "published"))
      .orderBy(desc(newsTable.publishedAt))
      .limit(3);

    const upcomingEvents = await db.select().from(eventsTable)
      .where(eq(eventsTable.status, "upcoming"))
      .orderBy(eventsTable.startDatetime)
      .limit(5);

    const recentActivity = await db.select().from(activityLogTable)
      .orderBy(desc(activityLogTable.createdAt))
      .limit(10);

    res.json({
      stats,
      recentNews: recentNews.map((n: any) => ({
        id: n.id, slug: n.slug, titleFr: n.titleFr, titleEn: n.titleEn,
        excerptFr: n.excerptFr, excerptEn: n.excerptEn, featuredImage: n.featuredImage,
        category: n.category, author: n.author, status: n.status,
        publishedAt: n.publishedAt?.toISOString() ?? null,
        createdAt: n.createdAt?.toISOString(), updatedAt: n.updatedAt?.toISOString(),
        bodyFr: n.bodyFr, bodyEn: n.bodyEn, tags: n.tags ?? [],
      })),
      upcomingEvents: upcomingEvents.map((e: any) => ({
        id: e.id, titleFr: e.titleFr, titleEn: e.titleEn,
        eventType: e.eventType, startDatetime: e.startDatetime?.toISOString(),
        endDatetime: e.endDatetime?.toISOString() ?? null,
        locationFr: e.locationFr, locationEn: e.locationEn,
        descriptionFr: e.descriptionFr, descriptionEn: e.descriptionEn,
        featuredImage: e.featuredImage, audience: e.audience ?? [],
        status: e.status, showOnHomepage: e.showOnHomepage,
        createdAt: e.createdAt?.toISOString(), updatedAt: e.updatedAt?.toISOString(),
      })),
      recentActivity: recentActivity.map((a: any) => ({
        id: a.id, adminId: a.adminId, adminName: a.adminName,
        action: a.action, entityType: a.entityType, entityId: a.entityId,
        description: a.description, createdAt: a.createdAt?.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
