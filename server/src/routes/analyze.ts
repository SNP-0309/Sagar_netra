import { Router } from "express";
import multer from "multer";

const router = Router();
const MAX_FILE_BYTES = 200 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/tiff"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
});

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Choose a sonar file before starting analysis." });
  }

  if (!ALLOWED_TYPES.has(file.mimetype)) {
    return res.status(415).json({ error: "Upload a PNG, JPEG, or TIFF raster image." });
  }

  const mlApiUrl = process.env.ML_API_URL?.trim() || "http://127.0.0.1:8000";
  const form = new FormData();
  const bytes = new Uint8Array(file.buffer);
  form.append("file", new Blob([bytes], { type: file.mimetype }), file.originalname);

  try {
    const response = await fetch(`${mlApiUrl.replace(/\/$/, "")}/analyze`, {
      method: "POST",
      headers: process.env.ML_API_KEY
        ? { Authorization: `Bearer ${process.env.ML_API_KEY}` }
        : undefined,
      body: form,
      signal: AbortSignal.timeout(60_000),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status >= 500 ? 502 : response.status).json({
        error: payload?.detail || payload?.error || "The analysis service rejected this file.",
      });
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error("[server] ML service error", error);
    return res.status(502).json({ error: "The analysis service is unavailable. Start the ML service and try again." });
  }
});

export default router;
