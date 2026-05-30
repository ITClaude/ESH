import { Router } from "express";
import { db } from "@workspace/db";
import { adminUsersTable, activityLogTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { requireAuth, signToken } from "../middlewares/auth";

const router = Router();

function formatUser(u: any) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    lastLogin: u.lastLogin?.toISOString() ?? null,
    isActive: u.isActive,
    createdAt: u.createdAt?.toISOString(),
  };
}

function formatActivity(a: any) {
  return {
    id: a.id,
    adminId: a.adminId,
    adminName: a.adminName,
    action: a.action,
    entityType: a.entityType,
    entityId: a.entityId,
    description: a.description,
    createdAt: a.createdAt?.toISOString(),
  };
}

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email));
    if (!user || !user.isActive) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    await db.update(adminUsersTable).set({ lastLogin: new Date() }).where(eq(adminUsersTable.id, user.id));
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/logout", requireAuth, async (req, res) => {
  res.json({ success: true });
});

router.get("/admin/me", requireAuth, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, admin.id));
    if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
    res.json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users", requireAuth, async (req, res) => {
  try {
    const users = await db.select().from(adminUsersTable).orderBy(adminUsersTable.createdAt);
    res.json(users.map(formatUser));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users", requireAuth, async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const [user] = await db.insert(adminUsersTable).values({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      role: req.body.role ?? "editor",
      isActive: true,
    }).returning();
    res.status(201).json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/users/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.role !== undefined) updates.role = req.body.role;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
    if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, 12);
    const [updated] = await db.update(adminUsersTable).set(updates).where(eq(adminUsersTable.id, req.params["id"] as string)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatUser(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(adminUsersTable).where(eq(adminUsersTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/activity", requireAuth, async (req, res) => {
  try {
    const { limit = "20" } = req.query as any;
    const logs = await db.select().from(activityLogTable).orderBy(desc(activityLogTable.createdAt)).limit(Number(limit));
    res.json(logs.map(formatActivity));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
