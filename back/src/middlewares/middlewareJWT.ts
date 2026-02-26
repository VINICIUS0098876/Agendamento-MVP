import Jwt from "jsonwebtoken";

const envSecret = process.env["JWT_SECRET"];
if (!envSecret) {
  throw new Error(
    "A variável de ambiente JWT_SECRET não está definida. Verifique seu arquivo .env",
  );
}
const JWT_SECRET: string = envSecret;

const JWT_EXPIRES_IN = "24h";

interface JwtPayloadWithUserId extends Jwt.JwtPayload {
  id_usuario: number;
}

export class TokenJwt {
  static generateToken(id_usuario: number): string {
    return Jwt.sign({ id_usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JwtPayloadWithUserId | null {
    try {
      const decoded = Jwt.verify(
        token,
        JWT_SECRET,
      ) as unknown as JwtPayloadWithUserId;

      if (typeof decoded === "object" && "id_usuario" in decoded) {
        return decoded;
      }

      return null;
    } catch (error: unknown) {
      console.error("Error verifying token:", error);
      return null;
    }
  }
}
