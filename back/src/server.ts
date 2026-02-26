import "dotenv/config";
import Express from "express";
import cors from "cors";
import router from "./routes.js";

const app = Express();
const PORT = process.env["PORT"] ?? 3000;

app.use(cors());
app.use(Express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${String(PORT)}`);
});
