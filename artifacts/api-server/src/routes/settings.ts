import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function formatSetting(s: any) {
  return {
    id: s.id,
    key: s.key,
    value: s.value,
    updatedAt: s.updatedAt?.toISOString(),
  };
}

router.get("/settings", async (req, res) => {
  try {
    const settings = await db.select().from(siteSettingsTable).orderBy(siteSettingsTable.key);
    res.json(settings.map(formatSetting));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/settings/map", async (req, res) => {
  try {
    const settings = await db.select().from(siteSettingsTable);
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    res.json(map);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings/:key", requireAuth, async (req, res) => {
  try {
    const key = req.params["key"] as string;
    const { value } = req.body;
    const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
    let result;
    if (existing.length > 0) {
      [result] = await db.update(siteSettingsTable).set({ value, updatedAt: new Date() }).where(eq(siteSettingsTable.key, key)).returning();
    } else {
      [result] = await db.insert(siteSettingsTable).values({ key, value }).returning();
    }
    res.json(formatSetting(result));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/settings/bulk", requireAuth, async (req, res) => {
  try {
    const { settings } = req.body as { settings: { key: string; value: string }[] };
    for (const { key, value } of settings) {
      const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
      if (existing.length > 0) {
        await db.update(siteSettingsTable).set({ value, updatedAt: new Date() }).where(eq(siteSettingsTable.key, key));
      } else {
        await db.insert(siteSettingsTable).values({ key, value });
      }
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
