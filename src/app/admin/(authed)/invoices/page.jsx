import { createAdminClient } from "@/lib/supabase/admin";
import { InvoicesClient } from "./invoices-client";
import { GstSummary } from "./gst-summary";
export const metadata = { title: "Invoices — Madhuban Admin" };
export default async function InvoicesPage() {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("invoices")
        .select("*, bookings!booking_id(booking_ref)")
        .order("generated_at", { ascending: false });
    const invoices = (data ?? []).map(({ bookings: bk, ...rest }) => ({
        ...rest,
        booking_ref: bk?.booking_ref ?? "",
    }));
    return (<div className="space-y-10">
      <h1 className="font-display text-2xl font-medium text-charcoal">Invoices</h1>
      <InvoicesClient invoices={invoices}/>
      <GstSummary invoices={invoices}/>
    </div>);
}
