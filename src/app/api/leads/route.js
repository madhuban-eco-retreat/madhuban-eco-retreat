import { NextResponse } from "next/server";
import { appendLead } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanPhone(raw) {
  if (typeof raw !== "string") return "";
  return raw.replace(/[^\d+]/g, "");
}

function generateLeadId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = cleanPhone(body.phone);
  const digits = phone.replace(/\D/g, "");

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 },
    );
  }
  if (digits.length < 10) {
    return NextResponse.json(
      { success: false, error: "Valid phone is required" },
      { status: 400 },
    );
  }

  const xff = request.headers.get("x-forwarded-for") || "";
  const ipAddress = xff.split(",")[0]?.trim() || "";

  const leadId = generateLeadId();

  try {
    await appendLead({
      timestamp: new Date().toISOString(),
      name,
      phone,
      package: body.package || "",
      stayType: body.stayType || "",
      checkin: body.checkin || "",
      guests: body.guests || "",
      estimate: body.estimate || "",
      utmSource: body.utmSource || "",
      utmMedium: body.utmMedium || "",
      utmCampaign: body.utmCampaign || "",
      utmTerm: body.utmTerm || "",
      utmContent: body.utmContent || "",
      gclid: body.gclid || "",
      wbraid: body.wbraid || "",
      gbraid: body.gbraid || "",
      landingPage: body.landingPage || "",
      userAgent: body.userAgent || "",
      ipAddress,
      status: "new",
    });
  } catch (err) {
    console.error("[LEAD CAPTURE]", err);
    return NextResponse.json(
      { success: false, error: "Could not save lead" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, leadId });
}
