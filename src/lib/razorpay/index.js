import "server-only";
import crypto from "crypto";
import Razorpay from "razorpay";
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing env var: ${name}`);
    return value;
}
function getClient() {
    return new Razorpay({
        key_id: requireEnv("RAZORPAY_KEY_ID"),
        key_secret: requireEnv("RAZORPAY_KEY_SECRET"),
    });
}
export async function createRazorpayOrder(params) {
    const client = getClient();
    const order = await client.orders.create({
        amount: params.amountPaise,
        currency: "INR",
        receipt: params.receipt,
        notes: params.notes,
    });
    return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
    };
}
export function verifyPaymentSignature(orderId, paymentId, signature) {
    const secret = requireEnv("RAZORPAY_KEY_SECRET");
    const expected = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    try {
        return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
    }
    catch {
        return false;
    }
}
export function verifyWebhookSignature(rawBody, signature) {
    const secret = requireEnv("RAZORPAY_WEBHOOK_SECRET");
    const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");
    try {
        return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
    }
    catch {
        return false;
    }
}
