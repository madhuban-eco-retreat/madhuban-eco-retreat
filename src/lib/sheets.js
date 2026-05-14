import "server-only";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function buildAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error("Missing Google service account credentials");
  }
  return new JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });
}

async function getSheet() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("Missing GOOGLE_SHEET_ID");
  const doc = new GoogleSpreadsheet(sheetId, buildAuth());
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

export async function appendLead(lead) {
  const sheet = await getSheet();
  await sheet.addRow({
    Timestamp: lead.timestamp,
    Name: lead.name,
    Phone: lead.phone,
    Package: lead.package,
    StayType: lead.stayType,
    Checkin: lead.checkin,
    Guests: lead.guests,
    Estimate: lead.estimate,
    UtmSource: lead.utmSource,
    UtmMedium: lead.utmMedium,
    UtmCampaign: lead.utmCampaign,
    UtmTerm: lead.utmTerm,
    UtmContent: lead.utmContent,
    Gclid: lead.gclid,
    LandingPage: lead.landingPage,
    UserAgent: lead.userAgent,
    IpAddress: lead.ipAddress,
    Status: lead.status || "new",
  });
}
