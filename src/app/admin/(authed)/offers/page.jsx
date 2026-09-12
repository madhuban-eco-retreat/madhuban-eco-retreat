import { loadAllOffers } from "@/lib/pricing/rate-card-db";
import { getRatesAndRules } from "@/lib/admin/rates";
import OffersClient from "./offers-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Offers · Madhuban Admin" };

export default async function OffersPage() {
  let offers = [];
  let roomRates = [];
  let loadError = null;

  try {
    // Room rates come along so the "applies to" picker lists real categories
    // rather than a hardcoded set that could drift from the rate card.
    const [o, rates] = await Promise.all([loadAllOffers(), getRatesAndRules()]);
    offers = o;
    roomRates = rates.roomRates;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load offers";
  }

  return <OffersClient initialOffers={offers} roomRates={roomRates} loadError={loadError} />;
}
