import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function formatMessage(m: any) {
  return {
    id: m.id,
    senderName: m.senderName,
    senderEmail: m.senderEmail,
    subject: m.subject,
    message: m.message,
    isRead: m.isRead,
    repliedAt: m.repliedAt?.toISOString() ?? null,
    createdAt: m.createdAt?.toISOString(),
  };
}

router.post("/contact", async (req, res) => {
  try {
    const [msg] = await db.insert(contactMessagesTable).values({
      senderName: req.body.senderName,
      senderEmail: req.body.senderEmail,
      subject: req.body.subject ?? null,
      message: req.body.message,
      isRead: false,
    }).returning();
    res.status(201).json(formatMessage(msg));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contact/messages", requireAuth, async (req, res) => {
  try {
    const { status } = req.query as any;
    let messages;
    if (status === "unread") {
      messages = await db.select().from(contactMessagesTable).where(eq(contactMessagesTable.isRead, false)).orderBy(desc(contactMessagesTable.createdAt));
    } else if (status === "read") {
      messages = await db.select().from(contactMessagesTable).where(eq(contactMessagesTable.isRead, true)).orderBy(desc(contactMessagesTable.createdAt));
    } else {
      messages = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
    }
    res.json(messages.map(formatMessage));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/contact/messages/:id", requireAuth, async (req, res) => {
  try {
    const updates: Record<string, any> = {};
    if (req.body.isRead !== undefined) updates.isRead = req.body.isRead;
    if (req.body.repliedAt !== undefined) updates.repliedAt = req.body.repliedAt ? new Date(req.body.repliedAt) : null;
    const [updated] = await db.update(contactMessagesTable).set(updates).where(eq(contactMessagesTable.id, req.params["id"] as string)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatMessage(updated));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/contact/messages/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
