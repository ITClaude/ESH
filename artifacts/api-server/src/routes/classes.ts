import { Router } from "express";
import { db } from "@workspace/db";
import { classesTable, staffTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

async function formatClass(c: any) {
  let teacherName = null;
  let assistantName = null;
  if (c.teacherId) {
    const [t] = await db.select({ fullName: staffTable.fullName }).from(staffTable).where(eq(staffTable.id, c.teacherId));
    teacherName = t?.fullName ?? null;
  }
  if (c.assistantId) {
    const [a] = await db.select({ fullName: staffTable.fullName }).from(staffTable).where(eq(staffTable.id, c.assistantId));
    assistantName = a?.fullName ?? null;
  }
  return {
    id: c.id,
    classCode: c.classCode,
    division: c.division,
    teacherId: c.teacherId,
    teacherName,
    assistantId: c.assistantId,
    assistantName,
    descFr: c.descFr,
    descEn: c.descEn,
    photoUrl: c.photoUrl,
    studentCount: c.studentCount,
    timetableUrl: c.timetableUrl,
    showOnWebsite: c.showOnWebsite,
    createdAt: c.createdAt?.toISOString(),
    updatedAt: c.updatedAt?.toISOString(),
  };
}

router.get("/classes", async (req, res) => {
  try {
    const { division } = req.query as any;
    const conditions: any[] = [eq(classesTable.showOnWebsite, true)];
    if (division) conditions.push(eq(classesTable.division, division));
    const classes = await db.select().from(classesTable).where(and(...conditions)).orderBy(asc(classesTable.classCode));
    res.json(await Promise.all(classes.map(formatClass)));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/classes/:id", async (req, res) => {
  try {
    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, req.params.id));
    if (!cls) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await formatClass(cls));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/classes", requireAuth, async (req, res) => {
  try {
    const [cls] = await db.insert(classesTable).values({
      classCode: req.body.classCode,
      division: req.body.division,
      teacherId: req.body.teacherId ?? null,
      assistantId: req.body.assistantId ?? null,
      descFr: req.body.descFr ?? null,
      descEn: req.body.descEn ?? null,
      photoUrl: req.body.photoUrl ?? null,
      studentCount: req.body.studentCount ?? 0,
      timetableUrl: req.body.timetableUrl ?? null,
      showOnWebsite: req.body.showOnWebsite ?? true,
    }).returning();
    res.status(201).json(await formatClass(cls));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/classes/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["classCode","division","teacherId","assistantId","descFr","descEn","photoUrl","studentCount","timetableUrl","showOnWebsite"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    updates.updatedAt = new Date();
    const [updated] = await db.update(classesTable).set(updates).where(eq(classesTable.id, req.params["id"] as string)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await formatClass(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
