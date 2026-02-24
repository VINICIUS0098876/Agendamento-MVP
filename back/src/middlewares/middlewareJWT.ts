import  Jwt  from "jsonwebtoken";

const secretKey = process.env["Sistema de Autenticação"]!;
const expiresIn = "24h";

interface JwtPayloadWithUserId extends Jwt.JwtPayload {
    id_usuario: number;
}

export class TokenJwt{
    static generateToken(id_usuario: number): string {
        return Jwt.sign({ id_usuario }, secretKey, { expiresIn });
    }

    static verifyToken(token: string): JwtPayloadWithUserId | null {
        try {
            const decoded = Jwt.verify(token, secretKey) as JwtPayloadWithUserId;
            
            if(typeof decoded === "object" && "id_usuario" in decoded) {
                return decoded as JwtPayloadWithUserId;
            }

            return null;

        } catch (error) {
            console.error("Error verifying token:", error);
            return null;
        }
    }
}


