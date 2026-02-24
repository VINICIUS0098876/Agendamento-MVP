import type { Request, Response, NextFunction } from "express";
import { TokenJwt } from "./middlewareJWT.js";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const autHeader = req.headers["authorization"];

  if (!autHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = autHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const decoded = TokenJwt.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.userId = decoded.id_usuario;
  next();
}
