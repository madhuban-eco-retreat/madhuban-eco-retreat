"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

/**
 * "Download Booking Confirmation" for the guest.
 *
 * Rendered in the browser rather than through an API route on purpose: the
 * confirmation page is reachable with only a booking reference and no session,
 * so a server endpoint returning a full booking PDF would hand anyone who
 * guesses a reference a document containing the guest's name and payment
 * details. Everything printed here is already on the page in front of them.
 *
 * The library is imported by this client component alone, so it is only
 * fetched when the confirmation page is actually rendered.
 */

// No Font.register: the built-in Helvetica has no rupee glyph, so amounts are
// written as "Rs." rather than emitting the tofu box a missing ₹ would produce.
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#2C2C2C", backgroundColor: "#FFFFFF" },
  brandBar: { borderBottomWidth: 2, borderBottomColor: "#C9A84C", paddingBottom: 12, marginBottom: 18 },
  brand: { fontSize: 16, fontWeight: 700, color: "#3D4A2B" },
  brandSub: { fontSize: 9, color: "#767676", marginTop: 2 },
  docTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#3D4A2B", marginTop: 8 },

  refBox: { backgroundColor: "#F5F5F0", borderWidth: 1, borderColor: "#D9D4C8", padding: 14, marginBottom: 18, alignItems: "center" },
  refLabel: { fontSize: 8, color: "#767676", textTransform: "uppercase", letterSpacing: 1 },
  refValue: { fontSize: 20, fontWeight: 700, letterSpacing: 2, color: "#6E6146", marginTop: 4 },

  sectionLabel: { fontSize: 8, color: "#767676", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, marginTop: 12 },
  row: { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: "#EFEDE6" },
  cellLabel: { width: 150, color: "#767676" },
  cellValue: { flex: 1, color: "#2C2C2C" },

  totalRow: { flexDirection: "row", backgroundColor: "#3D4A2B", paddingVertical: 6, paddingHorizontal: 8, marginTop: 4 },
  totalLabel: { flex: 1, color: "#FFFFFF", fontWeight: 700, fontSize: 11 },
  totalValue: { color: "#FFFFFF", fontWeight: 700, fontSize: 11 },

  policy: { fontSize: 8.5, color: "#4A4A4A", marginBottom: 2 },
  footer: { marginTop: 20, borderTopWidth: 1, borderTopColor: "#D9D4C8", paddingTop: 8 },
  footerText: { fontSize: 8, color: "#767676", marginBottom: 2 },
});

function money(n) {
  const v = Number(n);
  // A 2.5% CGST half lands on a paisa (Rs. 187.50), so fractions are padded.
  return `Rs. ${
    Number.isInteger(v)
      ? v.toLocaleString("en-IN")
      : v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }`;
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

function ConfirmationDoc({ booking }) {
  return (
    <Document
      title={`Booking Confirmation ${booking.bookingRef}`}
      author="Madhuban Eco Retreat"
      subject="Booking Confirmation"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.brandBar}>
          <Text style={styles.brand}>Madhuban Eco Retreat</Text>
          <Text style={styles.brandSub}>
            Ratapani Tiger Reserve · A Somaiya Group Initiative
          </Text>
          <Text style={styles.docTitle}>BOOKING CONFIRMATION</Text>
        </View>

        <View style={styles.refBox}>
          <Text style={styles.refLabel}>Booking Reference</Text>
          <Text style={styles.refValue}>{booking.bookingRef}</Text>
        </View>

        <Text style={styles.sectionLabel}>Stay Details</Text>
        <Row label="Guest" value={booking.guestName} />
        <Row label="Room" value={booking.roomName} />
        <Row label="Check-in" value={`${booking.checkIn}  (from 2:00 PM)`} />
        <Row label="Check-out" value={`${booking.checkOut}  (by 11:00 AM)`} />
        <Row
          label="Duration"
          value={`${booking.nights} night${booking.nights !== 1 ? "s" : ""}`}
        />
        <Row label="Guests" value={booking.guestSummary} />

        <Text style={styles.sectionLabel}>Payment Summary</Text>
        {booking.baseAmount != null && (
          <Row label="Subtotal (excl. GST)" value={money(booking.baseAmount)} />
        )}
        {booking.cgstAmount != null && booking.sgstAmount != null ? (
          <>
            <Row
              label={`CGST (${booking.cgstRate}%)`}
              value={money(booking.cgstAmount)}
            />
            <Row
              label={`SGST (${booking.sgstRate}%)`}
              value={money(booking.sgstAmount)}
            />
          </>
        ) : (
          booking.gstAmount != null && (
            <Row
              label={booking.gstRate ? `GST (${booking.gstRate}%)` : "GST"}
              value={money(booking.gstAmount)}
            />
          )
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL PAID</Text>
          <Text style={styles.totalValue}>{money(booking.totalAmount)}</Text>
        </View>
        <Row label="Balance due at check-in" value="Rs. 0" />

        <Text style={styles.sectionLabel}>Cancellation Policy</Text>
        <Text style={styles.policy}>• More than 45 days before arrival — 10% cancellation charge</Text>
        <Text style={styles.policy}>• Between 15 and 45 days before arrival — 50% cancellation charge</Text>
        <Text style={styles.policy}>• Within 15 days of arrival / No Show — 100% cancellation charge</Text>
        <Text style={styles.policy}>• Christmas, New Year, Holi, Diwali &amp; long weekend bookings — non-refundable</Text>
        <Text style={styles.policy}>• Group bookings (more than 3 rooms) — non-refundable</Text>
        <Text style={[styles.policy, { marginTop: 4, color: "#767676" }]}>
          Charges are calculated on the total booking value, not just the advance paid.
        </Text>

        <Text style={styles.sectionLabel}>Getting Here</Text>
        <Text style={styles.policy}>
          Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road, Rehti,
          Sehore, Madhya Pradesh 466446
        </Text>
        <Text style={styles.policy}>
          60 km from Bhopal via NH-46 · GPS: 22.88 N, 77.52 E
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Questions? WhatsApp or call +91 97705 58419 · madhubanresort@somaiya.com
          </Text>
          <Text style={styles.footerText}>
            Please carry this confirmation and a valid photo ID at check-in.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export function DownloadConfirmationButton({ booking }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleDownload() {
    setBusy(true);
    setFailed(false);
    try {
      const blob = await pdf(<ConfirmationDoc booking={booking} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Madhuban-Booking-${booking.bookingRef}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoking immediately can cancel the download in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      console.error("[confirmation-pdf] generation failed:", err);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={busy}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-earth-brown font-body text-sm font-medium text-earth-brown transition-colors hover:bg-earth-brown hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {busy ? "Preparing…" : "Download Booking Confirmation"}
      </button>
      {failed && (
        <p role="alert" className="mt-2 font-body text-xs text-red-600">
          Could not generate the PDF. Please try again, or use your browser&rsquo;s
          print option.
        </p>
      )}
    </div>
  );
}
