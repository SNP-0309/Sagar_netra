import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import analyzeRouter from "./routes/analyze.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api/analyze",
  rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false }),
  analyzeRouter,
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "sagarnetra-server" });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error && typeof error === "object" && "code" in error && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File exceeds the 200 MB size limit." });
  }
  console.error("[server] Unhandled error", error);
  return res.status(500).json({ error: "The server could not complete the request." });
});

app.listen(port, () => {
  console.log(`SagarNetra API listening on http://127.0.0.1:${port}`);
});
