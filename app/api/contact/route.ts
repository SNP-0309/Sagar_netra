import { NextRequest, NextResponse } from "next/server";

// ─── Rate limiter ───────────────────────────────────────────────
const contactMap = new Map<string, { count: number; resetAt: number }>();
const CONTACT_RATE_LIMIT = 3;   // max 3 contact submissions
const CONTACT_WINDOW_MS = 3600_000; // per hour

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactMap.get(ip);

  if (!entry || now > entry.resetAt) {
    contactMap.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return true;
  }

  if (entry.count >= CONTACT_RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Sanitize helper (basic — use DOMPurify server-side lib in production) ──
function sanitizeString(input: string, maxLength: number): string {
  return String(input)
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // prevent basic HTML injection
    .trim();
}

// ─── Route ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkContactRateLimit(ip)) {
    return NextResponse.json(
      { error: "You have submitted too many contact requests. Please try again in an hour." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── Field extraction & validation ──────────────────────────
  const name = sanitizeString(String(body.name ?? ""), 100);
  const email = sanitizeString(String(body.email ?? ""), 254);
  const message = sanitizeString(String(body.message ?? ""), 2000);

  // Honeypot check (bot protection — hidden field that humans leave empty)
  if (body.website) {
    // Silently drop bot submissions
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const errors: Record<string, string> = {};

  if (!name || name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message || message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  if (message.length > 2000) {
    errors.message = "Message must not exceed 2000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // ── Send email (production: use nodemailer / Resend / SendGrid) ──
  try {
    // const emailService = getEmailService();
    // await emailService.send({ from: email, name, message });
    console.info("[contact] Submission from:", email, "Name:", name);

    return NextResponse.json(
      { success: true, message: "Your message has been received. We will respond within 2 business days." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/contact] Send error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "Failed to send your message. Please try emailing us directly at hello@sagarnetra.in." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
