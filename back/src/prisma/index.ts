import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env["DATABASE_URL"]!);
const prisma = new PrismaClient({ adapter });

export default prisma;