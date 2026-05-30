import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const _jwtSecretEnv = process.env.JWT_SECRET;
if (!_jwtSecretEnv && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable must be set in production.");
}
const JWT_SECRET = _jwtSecretEnv ?? "esh-dev-secret-not-for-production";

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminPayload;
    (req as any).admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export { JWT_SECRET };
