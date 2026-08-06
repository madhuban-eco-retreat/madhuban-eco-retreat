import { NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { InvoicePDF } from "@/components/admin/invoice/InvoicePDF";
import { assertAdmin } from "@/lib/admin/auth";
export async function GET(_req, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();
    if (error || !data) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    const invoice = data;
    const pdfStream = await renderToStream(React.createElement(InvoicePDF, { invoice }));
    const fileName = invoice.invoice_number.replace(/\//g, "-");
    const webStream = new ReadableStream({
        start(controller) {
            pdfStream.on("data", (chunk) => controller.enqueue(chunk));
            pdfStream.on("end", () => controller.close());
            pdfStream.on("error", (err) => controller.error(err));
        },
    });
    return new Response(webStream, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        },
    });
}
