import { NextRequest, NextResponse } from "next/server";

// ─── Simple in-memory rate limiter ─────────────────────────────
// In production, use Redis (e.g. @upstash/ratelimit)
const requestMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 10;       // max requests
const WINDOW_MS = 60_000;    // per 60 seconds

function getRateLimitResult(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requestMap.get(ip);

  if (!entry || now > entry.resetAt) {
    requestMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

// ─── Route ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Get client IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit check
  const { allowed, remaining } = getRateLimitResult(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many analysis requests. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Content-type check
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid content type." },
      { status: 415 }
    );
  }

  // Request size limit (200MB)
  const contentLength = parseInt(req.headers.get("content-length") || "0");
  if (contentLength > 200 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File exceeds the 200 MB size limit." },
      { status: 413 }
    );
  }

  try {
    // In production: forward to ML backend
    // const mlApiUrl = process.env.ML_API_URL;
    // const mlApiKey = process.env.ML_API_KEY;
    // if (!mlApiUrl || !mlApiKey) { return NextResponse.json({ error: "Analysis service unavailable." }, { status: 503 }); }

    // Demo: return simulated results
    await new Promise((resolve) => setTimeout(resolve, 500)); // simulate processing

    const demoResult = {
      survey_id: `SN-${Date.now()}`,
      status: "complete",
      detections: [
        {
          id: "det_001",
          label: "Derelict fishing net",
          confidence: 0.94,
          severity: "high",
          geo: { lat: 13.0827, lon: 80.2707 },
          area_m2: 14.2,
          bounding_box: { x: 0.38, y: 0.18, w: 0.22, h: 0.24 },
        },
        {
          id: "det_002",
          label: "Metallic debris cluster",
          confidence: 0.87,
          severity: "high",
          geo: { lat: 13.0823, lon: 80.2711 },
          area_m2: 3.8,
          bounding_box: { x: 0.22, y: 0.52, w: 0.14, h: 0.18 },
        },
      ],
      processing_time_ms: 2514,
      coverage_km: 1.4,
      swath_width_m: 280,
    };

    return NextResponse.json(demoResult, {
      status: 200,
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    // Log technical details server-side; return generic message to client
    console.error("[/api/analyze] Error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Analysis failed. Please try again. If the problem persists, contact support." },
      { status: 500 }
    );
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
