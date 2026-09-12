import { getRatesAndRules } from "@/lib/admin/rates";
import RatesClient from "./rates-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Rates & Rules · Madhuban Admin" };

export default async function RatesPage() {
  // Loaded on the server so the form opens populated rather than flashing empty
  // and then filling in — these are numbers staff read before they edit.
  let data;
  try {
    data = await getRatesAndRules();
  } catch (err) {
    data = {
      loadError: err instanceof Error ? err.message : "Could not load rates",
      migrationPending: false,
      roomRates: [],
      seasons: [],
      gstRules: null,
      occupancyRules: null,
      longStayRules: null,
      defaults: null,
    };
  }

  return <RatesClient initial={data} />;
}
