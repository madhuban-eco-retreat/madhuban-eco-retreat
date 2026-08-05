import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
export async function createNotification(params) {
    const supabase = createAdminClient();
    await supabase.from("notifications").insert({
        recipient_email: ADMIN_EMAIL,
        type: params.type,
        title: params.title,
        body: params.body,
        link_url: params.linkUrl ?? null,
    });
}
