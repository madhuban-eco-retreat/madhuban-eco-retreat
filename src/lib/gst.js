// @ts-check
/**
 * GST slab for a room by its nightly tariff: 5% at ₹7,500 and below, 18% above.
 *
 * This read 12% for the lower slab, which is the pre-reform rate and disagreed
 * with the 5% the stay pages have always advertised — the same room was quoted
 * one way in marketing and taxed another in the booking engine. Room prices are
 * stored GST-inclusive, so correcting the rate moves the base/GST split on the
 * breakdown without changing what a guest is charged.
 */
export function gstRate(nightlyRate) {
    return nightlyRate > 7500 ? 18 : 5;
}
/** Always derived from base price — never read stored gst_rate column. */
export function computeRoomGstRate(basePricePerNight) {
    return gstRate(basePricePerNight);
}
/**
 * Adds GST on top of a pre-tax amount.
 *
 * Stored room tariffs are BASE prices that exclude GST — ₹12,000 for a Safari
 * Tent means ₹12,000 + 18% = ₹14,160 payable. This replaced an inclusive model
 * that divided the tax back out of the tariff, which under-collected: the same
 * ₹12,000 yielded only ₹1,830 of GST against the ₹2,160 actually due.
 */
export function addGst(taxableAmount, ratePercent) {
    const base = Math.round(taxableAmount * 100) / 100;
    const gst = Math.round(base * ratePercent / 100 * 100) / 100;
    return {
        base,
        gst,
        total: Math.round((base + gst) * 100) / 100,
        ratePercent,
    };
}

/**
 * Splits a GST-INCLUSIVE total back into base and tax.
 *
 * Retained only for reading bookings and invoices written before the switch to
 * exclusive pricing — their stored totals already contain the tax. Do not use
 * it to price anything new; use addGst.
 */
export function priceBreakdownInclusive(total, ratePercent) {
    const base = total / (1 + ratePercent / 100);
    return {
        total: Math.round(total * 100) / 100,
        base: Math.round(base * 100) / 100,
        gst: Math.round((total - base) * 100) / 100,
        ratePercent,
    };
}
// ── A7: Invoice GST utilities ─────────────────────────────────────────────────
function roundTo2(n) {
    return Math.round(n * 100) / 100;
}
/** Returns "2026-27" for any date in April 2026 – March 2027. */
export function getFinancialYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed; April = 3
    if (month >= 3) {
        const yy = (year + 1) % 100;
        return `${year}-${yy.toString().padStart(2, '0')}`;
    }
    const yy = year % 100;
    return `${year - 1}-${yy.toString().padStart(2, '0')}`;
}
/**
 * Returns true when the guest's state is NOT Madhya Pradesh.
 * Null/unknown defaults to intra-state (MP) — conservative for a MP property
 * where most walk-in guests are local.
 */
export function isInterStateGuest(guestState) {
    if (!guestState)
        return false;
    const s = guestState.toLowerCase().trim();
    return s !== 'madhya pradesh' && s !== 'm.p.' && s !== 'mp' && s !== '23';
}
export function computeTaxBreakdown(taxableAmount, gstRatePercent, isInterState) {
    const totalGst = roundTo2(taxableAmount * gstRatePercent / 100);
    if (isInterState) {
        return {
            taxableAmount,
            gstRate: gstRatePercent,
            isInterState: true,
            cgstRate: null, cgstAmount: null,
            sgstRate: null, sgstAmount: null,
            igstRate: gstRatePercent,
            igstAmount: totalGst,
            totalGst,
            totalAmount: roundTo2(taxableAmount + totalGst),
        };
    }
    const halfRate = gstRatePercent / 2;
    const cgst = roundTo2(totalGst / 2);
    const sgst = roundTo2(totalGst - cgst);
    return {
        taxableAmount,
        gstRate: gstRatePercent,
        isInterState: false,
        cgstRate: halfRate, cgstAmount: cgst,
        sgstRate: halfRate, sgstAmount: sgst,
        igstRate: null, igstAmount: null,
        totalGst,
        totalAmount: roundTo2(taxableAmount + totalGst),
    };
}
/** Converts a rupee amount to Indian-style words for GST invoices. */
export function amountToWords(amount) {
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen',
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    function convert(n) {
        if (n === 0)
            return '';
        if (n < 20)
            return ones[n] ?? '';
        if (n < 100) {
            const r = n % 10 !== 0 ? ' ' + (ones[n % 10] ?? '') : '';
            return (tens[Math.floor(n / 10)] ?? '') + r;
        }
        if (n < 1000) {
            const r = n % 100 !== 0 ? ' ' + convert(n % 100) : '';
            return (ones[Math.floor(n / 100)] ?? '') + ' Hundred' + r;
        }
        if (n < 100000) {
            const r = n % 1000 !== 0 ? ' ' + convert(n % 1000) : '';
            return convert(Math.floor(n / 1000)) + ' Thousand' + r;
        }
        if (n < 10000000) {
            const r = n % 100000 !== 0 ? ' ' + convert(n % 100000) : '';
            return convert(Math.floor(n / 100000)) + ' Lakh' + r;
        }
        const r = n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '';
        return convert(Math.floor(n / 10000000)) + ' Crore' + r;
    }
    const rupeesText = rupees === 0 ? 'Zero' : convert(rupees);
    const paiseText = paise > 0 ? ` and ${convert(paise)} Paise` : '';
    return `${rupeesText} Rupees${paiseText} Only`;
}
/** Formats a number as Indian-style currency string (e.g. ₹1,00,000.00). */
export function fmtINR(amount) {
    const str = Math.abs(amount).toFixed(2);
    const dotIdx = str.indexOf('.');
    const intPart = dotIdx >= 0 ? str.slice(0, dotIdx) : str;
    const decPart = dotIdx >= 0 ? str.slice(dotIdx + 1) : '00';
    if (intPart.length <= 3)
        return `₹${intPart}.${decPart}`;
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `₹${restFormatted},${last3}.${decPart}`;
}
