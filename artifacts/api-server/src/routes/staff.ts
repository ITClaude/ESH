import { Router } from "express";
import { db } from "@workspace/db";
import { staffTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function formatStaff(s: any) {
  return {
    id: s.id,
    fullName: s.fullName,
    roleFr: s.roleFr,
    roleEn: s.roleEn,
    department: s.department,
    photoUrl: s.photoUrl,
    bioFr: s.bioFr,
    bioEn: s.bioEn,
    email: s.email,
    qualifications: s.qualifications,
    classesTaught: s.classesTaught ?? [],
    orderIndex: s.orderIndex,
    isActive: s.isActive,
    createdAt: s.createdAt?.toISOString(),
    updatedAt: s.updatedAt?.toISOString(),
  };
}

router.get("/staff", async (req, res) => {
  try {
    const { department } = req.query as any;
    const conditions: any[] = [eq(staffTable.isActive, true)];
    if (department) conditions.push(eq(staffTable.department, department));
    const staff = await db.select().from(staffTable).where(and(...conditions)).orderBy(asc(staffTable.orderIndex));
    res.json(staff.map(formatStaff));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/staff/all", requireAuth, async (req, res) => {
  try {
    const staff = await db.select().from(staffTable).orderBy(asc(staffTable.orderIndex));
    res.json(staff.map(formatStaff));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/staff", requireAuth, async (req, res) => {
  try {
    const [member] = await db.insert(staffTable).values({
      fullName: req.body.fullName,
      roleFr: req.body.roleFr,
      roleEn: req.body.roleEn ?? null,
      department: req.body.department,
      photoUrl: req.body.photoUrl ?? null,
      bioFr: req.body.bioFr ?? null,
      bioEn: req.body.bioEn ?? null,
      email: req.body.email ?? null,
      qualifications: req.body.qualifications ?? null,
      classesTaught: req.body.classesTaught ?? [],
      orderIndex: req.body.orderIndex ?? 0,
      isActive: req.body.isActive ?? true,
    }).returning();
    res.status(201).json(formatStaff(member));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/staff/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    const fields = ["fullName","roleFr","roleEn","department","photoUrl","bioFr","bioEn","email","qualifications","classesTaught","orderIndex","isActive"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    updates.updatedAt = new Date();
    const [updated] = await db.update(staffTable).set(updates).where(eq(staffTable.id, req.params["id"] as string)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatStaff(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/staff/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(staffTable).where(eq(staffTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
