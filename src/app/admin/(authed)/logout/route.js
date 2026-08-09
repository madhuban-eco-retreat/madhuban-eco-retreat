import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/session";

export async function POST() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
    // Clear the admin window too. Leaving a valid marker behind after sign-out
    // would mean the next Supabase session in this browser inherited whatever
    // was left of the previous login's twenty-four hours.
    res.cookies.set(ADMIN_SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
}
