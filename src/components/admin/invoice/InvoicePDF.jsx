import path from "path";
import fs from "fs";
import { Document, Page, View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { amountToWords, fmtINR, HSN_ACCOMMODATION } from "@/lib/gst";
// Fonts are read off disk rather than fetched, so nothing here depends on the
// network or on an env var. Two families are required: latin for regular text,
// devanagari for ₹ (U+20B9), which the built-in Helvetica cannot render.
//
// next.config.mjs also pins ./public/fonts/** into this route's traced files.
// That is belt-and-braces rather than a fix: the tracer already follows these
// reads on its own today.
const FONTS_DIR = path.join(process.cwd(), "public", "fonts");
const toDataUri = (file) => `data:font/woff;base64,${fs.readFileSync(path.join(FONTS_DIR, file)).toString("base64")}`;

// Registration runs at module scope, so an unreadable font file used to throw
// on import and take the whole PDF route down with a 500 that named only the
// missing path. An invoice in Helvetica beats no invoice at all: fall back to
// the built-in face rather than blocking billing — see RUPEE for what that
// costs and how the amounts stay readable when it happens.
let FONT_STACK = ["Helvetica"];
/**
 * How to draw ₹, and what to draw instead when we cannot.
 *
 * Amounts were printing a stray glyph where the rupee sign belongs. U+20B9 is
 * absent from the latin subset in public/fonts and present only in the
 * devanagari one, and the built-in Helvetica cannot draw it at all: it is a
 * single-byte WinAnsi font, so the codepoint goes into the content stream as
 * the raw bytes 0x20 0xB9 and the viewer paints whatever those happen to mean.
 * That is the `*`. It appears exactly when font registration above has thrown —
 * a missing woff in the serverless bundle — which is also the case no amount of
 * font-stack juggling can rescue.
 *
 * So: when the faces did register, the symbol is drawn in its own Text naming
 * the devanagari family outright (see Rupee) rather than trusting the page-level
 * stack to fall back for one glyph. When they did not, the amounts say "Rs.",
 * which every font can draw. Either way nothing reaches the page that the
 * active font cannot render.
 */
let RUPEE = { fontFamily: null, symbol: "Rs." };
try {
    Font.register({
        family: "Noto Sans",
        fonts: [
            { src: toDataUri("noto-sans-latin-400-normal.woff"), fontWeight: 400 },
            { src: toDataUri("noto-sans-latin-700-normal.woff"), fontWeight: 700 },
        ],
    });
    Font.register({
        family: "Noto Sans Devanagari",
        fonts: [
            { src: toDataUri("noto-sans-devanagari-400-normal.woff"), fontWeight: 400 },
            { src: toDataUri("noto-sans-devanagari-700-normal.woff"), fontWeight: 700 },
        ],
    });
    FONT_STACK = ["Noto Sans", "Noto Sans Devanagari"];
    RUPEE = { fontFamily: "Noto Sans Devanagari", symbol: "₹" };
}
catch (err) {
    console.error("[invoice-pdf] font registration failed — falling back to Helvetica.", err);
}
const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? "";
const LOGO_URL = `${R2_BASE}/branding/logo/madhuban-mark-md.png`;
const C = {
    charcoal: "#2C2C2C",
    olive: "#3D4A2B",
    gold: "#C9A84C",
    lightGrey: "#F5F5F0",
    border: "#D9D4C8",
    white: "#FFFFFF",
    muted: "#767676",
};
const styles = StyleSheet.create({
    page: {
        fontFamily: FONT_STACK,
        fontSize: 9,
        color: C.charcoal,
        padding: 36,
        backgroundColor: C.white,
    },
    // Header
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    logo: { width: 48, height: 48, objectFit: "contain" },
    headerRight: { alignItems: "flex-end" },
    invoiceTitle: { fontSize: 16, fontWeight: 700, color: C.olive, letterSpacing: 1 },
    issuerBlock: { marginTop: 4 },
    issuerLegal: { fontSize: 8, color: C.muted, marginTop: 1 },
    issuerLine: { fontSize: 9, color: C.charcoal, marginTop: 1 },
    // Divider
    divider: { borderBottomWidth: 1, borderBottomColor: C.border, marginVertical: 8 },
    goldDivider: { borderBottomWidth: 2, borderBottomColor: C.gold, marginBottom: 10 },
    // Meta row (invoice no, date, place of supply)
    metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    metaBlock: { flex: 1 },
    metaLabel: { fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    metaValue: { fontSize: 9, fontWeight: 700, color: C.charcoal },
    metaValueNormal: { fontSize: 9, color: C.charcoal },
    // Bill-to
    sectionLabel: { fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
    billToName: { fontSize: 10, fontWeight: 700, color: C.charcoal, marginBottom: 2 },
    billToLine: { fontSize: 9, color: C.charcoal, marginBottom: 1 },
    // Table
    table: { marginTop: 12 },
    tableHeader: { flexDirection: "row", backgroundColor: C.olive, paddingVertical: 5, paddingHorizontal: 4 },
    tableHeaderCell: { fontSize: 8, fontWeight: 700, color: C.white },
    tableRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: C.border },
    tableRowAlt: { backgroundColor: C.lightGrey },
    colDesc: { flex: 4 },
    colHsn: { flex: 1, textAlign: "center" },
    colQty: { flex: 1, textAlign: "center" },
    colRate: { flex: 2, textAlign: "right" },
    colAmt: { flex: 2, textAlign: "right" },
    // Totals
    totalsSection: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
    totalsBlock: { width: 200 },
    totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
    totalsLabel: { fontSize: 9, color: C.charcoal },
    totalsValue: { fontSize: 9, color: C.charcoal, textAlign: "right" },
    totalsDivider: { borderBottomWidth: 1, borderBottomColor: C.border, marginVertical: 4 },
    grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, backgroundColor: C.olive, paddingHorizontal: 6, marginTop: 2 },
    grandTotalLabel: { fontSize: 10, fontWeight: 700, color: C.white },
    grandTotalValue: { fontSize: 10, fontWeight: 700, color: C.white },
    // Amount in words
    amountWords: { marginTop: 8, borderWidth: 1, borderColor: C.border, padding: 8, backgroundColor: C.lightGrey },
    amountWordsLabel: { fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    amountWordsText: { fontSize: 9, fontWeight: 700, color: C.charcoal },
    // Footer
    footerSection: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    qrBox: { width: 90, height: 90, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", backgroundColor: C.lightGrey },
    qrPlaceholderText: { fontSize: 7, color: C.muted, textAlign: "center", padding: 4 },
    signatureBlock: { alignItems: "flex-end", justifyContent: "flex-end" },
    signatureLine: { fontSize: 8, color: C.muted, marginBottom: 2 },
    signatureName: { fontSize: 9, fontWeight: 700, color: C.charcoal },
    // Footnote
    footnote: { marginTop: 12, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 6 },
    footnoteText: { fontSize: 7, color: C.muted, textAlign: "center" },
});
function fmtDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    });
}
/**
 * Invoices written before the SAC was narrowed stored the four-digit 9963,
 * which covers all of accommodation, food and beverage. Reprinting one should
 * show the specific accommodation heading rather than the group it sits in.
 */
function fmtHsn(hsn) {
    return !hsn || hsn === "9963" ? HSN_ACCOMMODATION : hsn;
}
/** The currency symbol alone, in whichever face can actually draw it. */
function Rupee() {
    return <Text style={RUPEE.fontFamily ? { fontFamily: RUPEE.fontFamily } : {}}>{RUPEE.symbol}</Text>;
}
/**
 * A rupee amount, with the symbol drawn separately from the digits.
 *
 * fmtINR already returns "₹1,00,000.00", so the symbol is stripped back off and
 * re-emitted through Rupee — the digits stay in the latin face where the Indian
 * grouping and the comma render correctly, and only the one glyph switches.
 * Negatives (discount lines) carry the sign ahead of the symbol.
 */
function Money({ value, style }) {
    const negative = value < 0;
    const digits = fmtINR(Math.abs(value)).replace("₹", "");
    return (<Text style={style}>
      {negative ? "-" : ""}
      <Rupee />
      {digits}
    </Text>);
}
export function InvoicePDF({ invoice }) {
    const lineItems = (Array.isArray(invoice.line_items) ? invoice.line_items : []);
    const invoiceDateStr = fmtDate(invoice.generated_at.slice(0, 10));
    // Discounts are carried as negative line items, because the invoices table
    // has no discount column. Summing the two signs apart lets the totals block
    // state the gross, the reduction and the taxable base separately — an
    // invoice that only showed the net would leave a guest unable to see the
    // 20% they were promised. Invoices written without a discount have no
    // negative lines, so these rows simply do not appear.
    const grossAmount = Math.round(lineItems.reduce((s, i) => s + Math.max(0, i.amount), 0) * 100) / 100;
    const discountAmount = Math.round(lineItems.reduce((s, i) => s + Math.min(0, i.amount), 0) * -100) / 100;
    return (<Document title={`Booking Confirmation ${invoice.invoice_number}`} author="Madhuban Eco Retreat" subject="GST Booking Confirmation">
      <Page size="A4" style={styles.page}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO_URL} style={styles.logo}/>
            <View style={styles.issuerBlock}>
              <Text style={[styles.issuerLine, { fontWeight: 700, fontSize: 11 }]}>
                {invoice.issuer_trade_name}
              </Text>
              <Text style={styles.issuerLegal}>{invoice.issuer_legal_name}</Text>
              <Text style={styles.issuerLine}>{invoice.issuer_address}</Text>
              <Text style={styles.issuerLine}>GSTIN: {invoice.issuer_gstin}</Text>
              <Text style={styles.issuerLine}>
                State: {invoice.issuer_state} (23)
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>BOOKING CONFIRMATION</Text>
          </View>
        </View>

        <View style={styles.goldDivider}/>

        {/* ── Invoice meta ────────────────────────────────────────────────── */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValueNormal}>{invoiceDateStr}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Place of Supply</Text>
            <Text style={styles.metaValueNormal}>
              {invoice.place_of_supply_state} ({invoice.place_of_supply_state_code})
            </Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Service Period</Text>
            <Text style={styles.metaValueNormal}>
              {fmtDate(invoice.service_period_from)} – {fmtDate(invoice.service_period_to)}
            </Text>
          </View>
        </View>

        <View style={styles.divider}/>

        {/* ── Bill To ─────────────────────────────────────────────────────── */}
        <View>
          <Text style={styles.sectionLabel}>Bill To</Text>
          <Text style={styles.billToName}>{invoice.bill_to_name}</Text>
          {invoice.bill_to_company_name && (<Text style={styles.billToLine}>{invoice.bill_to_company_name}</Text>)}
          {invoice.bill_to_address && (<Text style={styles.billToLine}>{invoice.bill_to_address}</Text>)}
          {invoice.bill_to_phone && (<Text style={styles.billToLine}>Ph: {invoice.bill_to_phone}</Text>)}
          {invoice.bill_to_email && (<Text style={styles.billToLine}>{invoice.bill_to_email}</Text>)}
          {invoice.bill_to_gstin && (<Text style={styles.billToLine}>GSTIN: {invoice.bill_to_gstin}</Text>)}
          {invoice.bill_to_state && (<Text style={styles.billToLine}>
              {invoice.is_inter_state ? "Inter-state" : "Intra-state"} supply
            </Text>)}
        </View>

        <View style={styles.divider}/>

        {/* ── Line items table ─────────────────────────────────────────────── */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colHsn]}>HSN</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate (<Rupee />)</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmt]}>Amount (<Rupee />)</Text>
          </View>
          {lineItems.map((item, i) => (<View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[{ fontSize: 9, color: item.amount < 0 ? C.olive : C.charcoal }, styles.colDesc]}>{item.description}</Text>
              <Text style={[{ fontSize: 9, color: C.charcoal }, styles.colHsn]}>{fmtHsn(item.hsn)}</Text>
              <Text style={[{ fontSize: 9, color: C.charcoal }, styles.colQty]}>{item.qty}</Text>
              <Text style={[{ fontSize: 9, color: item.amount < 0 ? C.olive : C.charcoal }, styles.colRate]}>
                {item.rate.toLocaleString("en-IN")}
              </Text>
              <Text style={[{ fontSize: 9, color: item.amount < 0 ? C.olive : C.charcoal }, styles.colAmt]}>
                {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
            </View>))}
        </View>

        {/* ── Totals ──────────────────────────────────────────────────────── */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBlock}>
            {discountAmount > 0 && (<>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Gross Amount</Text>
                  <Money value={grossAmount} style={styles.totalsValue}/>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, { color: C.olive }]}>Discount</Text>
                  <Money value={-discountAmount} style={[styles.totalsValue, { color: C.olive }]}/>
                </View>
              </>)}

            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Taxable Amount</Text>
              <Money value={invoice.taxable_amount} style={styles.totalsValue}/>
            </View>

            {!invoice.is_inter_state && invoice.cgst_rate != null && invoice.cgst_amount != null && (<>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>CGST @ {invoice.cgst_rate}%</Text>
                  <Money value={invoice.cgst_amount} style={styles.totalsValue}/>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>SGST @ {invoice.sgst_rate}%</Text>
                  <Money value={invoice.sgst_amount} style={styles.totalsValue}/>
                </View>
              </>)}

            {invoice.is_inter_state && invoice.igst_rate != null && invoice.igst_amount != null && (<View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>IGST @ {invoice.igst_rate}%</Text>
                <Money value={invoice.igst_amount} style={styles.totalsValue}/>
              </View>)}

            <View style={styles.totalsDivider}/>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL</Text>
              <Money value={invoice.total_amount} style={styles.grandTotalValue}/>
            </View>
          </View>
        </View>

        {/* ── Amount in words ──────────────────────────────────────────────── */}
        <View style={styles.amountWords}>
          <Text style={styles.amountWordsLabel}>Amount in Words</Text>
          <Text style={styles.amountWordsText}>{amountToWords(invoice.total_amount)}</Text>
        </View>

        {/* ── Footer: QR + Signature ───────────────────────────────────────── */}
        <View style={styles.footerSection}>
          <View>
            <Text style={[styles.metaLabel, { marginBottom: 4 }]}>Payment</Text>
            <View style={styles.qrBox}>
              <Text style={styles.qrPlaceholderText}>
                Payment QR will appear once UPI ID is configured in Settings
              </Text>
            </View>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLine}>For {invoice.issuer_trade_name}</Text>
            <View style={{ height: 28 }}/>
            <Text style={styles.signatureName}>Authorised Signatory</Text>
            <Text style={styles.signatureLine}>Madhuban Eco Retreat Management</Text>
          </View>
        </View>

        {/* ── Footnote ────────────────────────────────────────────────────── */}
        <View style={styles.footnote}>
          <Text style={styles.footnoteText}>
            This is a computer-generated document and does not require a physical signature.
          </Text>
          <Text style={[styles.footnoteText, { marginTop: 2 }]}>
            GSTIN: {invoice.issuer_gstin} | {invoice.issuer_address}
          </Text>
        </View>

      </Page>
    </Document>);
}
