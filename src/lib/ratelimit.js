import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Named sliding-window limiters, built lazily and cached.
 *
 * One limiter per concern rather than one shared bucket: a guest filling in a
 * date picker and a script grinding coupon codes are different behaviours and
 * must not spend each other's budget. Each gets its own Redis key prefix so the
 * windows are genuinely independent.
 */
const LIMITS = {
    /** Public form submissions. */
    form: { tokens: 10, window: "1 h", prefix: "madhuban:form" },
    /**
     * Price recalculation. The checkout form refetches on every date, occupancy
     * and coupon change, so this is set well above ordinary interactive use and
     * only bites on automated traffic.
     */
    price: { tokens: 30, window: "10 m", prefix: "madhuban:price" },
    /**
     * FAILED coupon attempts only — a valid code costs nothing. Five wrong
     * guesses an hour makes enumerating the coupon table impractical while
     * leaving room for a guest mistyping one off an email.
     */
    coupon: { tokens: 5, window: "1 h", prefix: "madhuban:coupon" },
    /**
     * Admin password attempts. The panel has a handful of staff accounts, so
     * ten tries a quarter-hour is generous for a human and useless for a
     * dictionary run against a known address.
     */
    adminPassword: { tokens: 10, window: "15 m", prefix: "madhuban:admin-pw" },
    /**
     * OTP submissions. A six-digit code is a million possibilities; capping
     * guesses at ten per quarter-hour keeps the odds of hitting one inside its
     * ten-minute life negligible.
     */
    adminOtp: { tokens: 10, window: "15 m", prefix: "madhuban:admin-otp" },
};

const _limiters = new Map();
let _warned = false;

function getLimiter(name) {
    if (_limiters.has(name))
        return _limiters.get(name);
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
        if (!_warned) {
            console.warn("[ratelimit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — rate limiting disabled");
            _warned = true;
        }
        return null;
    }
    const config = LIMITS[name];
    if (!config) {
        console.warn(`[ratelimit] unknown limiter "${name}" — not limiting`);
        return null;
    }
    const limiter = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(config.tokens, config.window),
        prefix: config.prefix,
    });
    _limiters.set(name, limiter);
    return limiter;
}

export function getClientIP(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded)
        return forwarded.split(",")[0].trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}

/** Consumes one token from the named window. Defaults to the form limiter. */
export async function checkRateLimit(request, name = "form") {
    const limiter = getLimiter(name);
    if (!limiter)
        return { limited: false };
    const ip = getClientIP(request);
    const { success, reset } = await limiter.limit(ip);
    if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return { limited: true, retryAfter };
    }
    return { limited: false };
}

/**
 * Reads the remaining budget without spending any of it.
 *
 * The coupon window is charged only for wrong codes, which cannot be known
 * until the code has been looked up — so the request has to be admitted before
 * the outcome exists. Peeking first is what stops an already-exhausted caller
 * from getting that lookup at all.
 */
export async function peekRateLimit(request, name) {
    const limiter = getLimiter(name);
    if (!limiter)
        return { limited: false };
    const ip = getClientIP(request);
    const { remaining, reset } = await limiter.getRemaining(ip);
    if (remaining <= 0) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return { limited: true, retryAfter };
    }
    return { limited: false, remaining };
}

/** Spends one token and reports what is left. Used to charge a failed attempt. */
export async function consumeRateLimit(request, name) {
    const limiter = getLimiter(name);
    if (!limiter)
        return { limited: false, remaining: null };
    const ip = getClientIP(request);
    const { success, remaining, reset } = await limiter.limit(ip);
    return {
        limited: !success,
        remaining,
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
    };
}
