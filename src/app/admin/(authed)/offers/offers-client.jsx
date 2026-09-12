"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Percent } from "lucide-react";
import { Card, Button, Input, Select, Toggle, Modal, Badge, EmptyState } from "@/components/admin/ui";
import { validateOfferPayload, describeReward } from "@/lib/admin/offers";
import { REWARD_LABELS } from "@/lib/pricing/offers.mjs";

/**
 * Offers.
 *
 * One reward per offer, one offer per booking. The screen leans hard on that
 * second rule because it is the one staff will forget: a list of five live
 * offers does not mean a guest gets five discounts, it means the engine picks
 * the best one and the other four are invisible.
 *
 * Nothing is publishable without previewing it first. The preview prices a real
 * sample stay through the real engine, which is the only reliable way to notice
 * that a new 15% campaign loses to the standing 20% long-stay discount and will
 * therefore never fire.
 */

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const BLANK = {
  name: "",
  description: "",
  is_active: false,
  min_nights: 1,
  min_rooms: 1,
  stay_from: "",
  stay_to: "",
  book_by: "",
  room_slugs: [],
  reward_type: "percent_off_stay",
  reward_value: 10,
  reward_tiers: [{ night: 2, percent: 20 }],
};

export default function OffersClient({ initialOffers, roomRates, loadError }) {
  const [offers, setOffers] = useState(initialOffers ?? []);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [sample, setSample] = useState({ roomSlug: "safari-tent", nights: 3, adults: 2 });

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/offers");
    if (res.ok) {
      const json = await res.json();
      setOffers(json.offers ?? []);
    }
  }, []);

  const runPreview = useCallback(async () => {
    if (!draft) return;
    const errors = validateOfferPayload(draft);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    setPreviewing(true);
    setPreview(null);
    try {
      const res = await fetch("/api/admin/offers/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer: draft, sample }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Preview failed");
      setPreview(json);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setPreviewing(false);
    }
  }, [draft, sample]);

  const saveDraft = useCallback(async () => {
    const errors = validateOfferPayload(draft);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    setSaving(true);
    try {
      const editing = Boolean(draft.id);
      const res = await fetch("/api/admin/offers", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      toast.success(editing ? "Offer updated" : "Offer created");
      setDraft(null);
      setPreview(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [draft, refresh]);

  if (loadError) {
    return (
      <Card>
        <p className="font-body text-sm text-error">{loadError}</p>
      </Card>
    );
  }

  const activeCount = offers.filter((o) => o.is_active).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold text-charcoal">Offers</h1>
          <p className="font-body text-sm text-charcoal/60">
            Conditions in, one reward out. Only one offer ever applies to a
            booking — whichever saves the guest the most, the standing long-stay
            discount included. Nothing stacks.
          </p>
        </div>
        <Button onClick={() => { setDraft({ ...BLANK }); setPreview(null); }}>
          <Plus className="h-4 w-4" /> New offer
        </Button>
      </header>

      {activeCount > 1 && (
        <Card className="border-admin-status-info-fg/25 bg-admin-status-info-bg">
          <p className="font-body text-sm text-admin-status-info-fg">
            {activeCount} offers are live. A guest still gets only one — the
            biggest saving wins for each booking, so the others apply only where
            they beat it.
          </p>
        </Card>
      )}

      {offers.length === 0 ? (
        <EmptyState
          icon={<Percent className="h-6 w-6" />}
          title="No offers yet"
          description="Create one to run a campaign. Offers never apply on peak or blackout nights."
          action={{ label: "New offer", onClick: () => setDraft({ ...BLANK }) }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {offers.map((o) => (
            <Card key={o.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold text-charcoal">{o.name}</span>
                    <Badge variant={o.is_active ? "success" : "neutral"}>
                      {o.is_active ? "Live" : "Off"}
                    </Badge>
                  </div>
                  <p className="font-body text-sm text-charcoal/70">{describeReward(o)}</p>
                  <p className="font-body text-xs text-charcoal/50">
                    {o.min_nights > 1 && `${o.min_nights}+ nights · `}
                    {o.min_rooms > 1 && `${o.min_rooms}+ rooms · `}
                    {o.stay_from || o.stay_to
                      ? `Stays ${o.stay_from ?? "any"} → ${o.stay_to ?? "any"} · `
                      : ""}
                    {o.book_by ? `Book by ${o.book_by} · ` : ""}
                    {Array.isArray(o.room_slugs) && o.room_slugs.length > 0
                      ? o.room_slugs.join(", ")
                      : "All room types"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Toggle
                    checked={Boolean(o.is_active)}
                    onChange={async (v) => {
                      const res = await fetch("/api/admin/offers", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: o.id, is_active: v }),
                      });
                      if (res.ok) {
                        setOffers(offers.map((x) => (x.id === o.id ? { ...x, is_active: v } : x)));
                        toast.success(v ? `${o.name} is live` : `${o.name} switched off`);
                      } else {
                        toast.error("Could not change that");
                      }
                    }}
                  />
                  <Button size="sm" variant="secondary" onClick={() => { setDraft({ ...o, room_slugs: o.room_slugs ?? [] }); setPreview(null); }}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    aria-label={`Delete ${o.name}`}
                    onClick={async () => {
                      if (!window.confirm(`Delete "${o.name}"? Bookings already made keep their price.`)) return;
                      const res = await fetch(`/api/admin/offers?id=${o.id}`, { method: "DELETE" });
                      if (res.ok) {
                        setOffers(offers.filter((x) => x.id !== o.id));
                        toast.success("Offer deleted");
                      } else {
                        toast.error("Could not delete");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── editor ─────────────────────────────────────────────────────── */}
      <Modal
        open={Boolean(draft)}
        onClose={() => { setDraft(null); setPreview(null); }}
        title={draft?.id ? "Edit offer" : "New offer"}
        size="xl"
      >
        {draft && (
          <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto pr-1">
            <Input label="Name" value={draft.name} required onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Input label="Description" value={draft.description ?? ""} helperText="Internal note — guests never see this" onChange={(e) => setDraft({ ...draft, description: e.target.value })} />

            {/* Conditions */}
            <div>
              <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Conditions
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Minimum nights" type="number" min="1" value={draft.min_nights} onChange={(e) => setDraft({ ...draft, min_nights: e.target.value })} />
                <Input label="Minimum rooms" type="number" min="1" value={draft.min_rooms} onChange={(e) => setDraft({ ...draft, min_rooms: e.target.value })} />
                <Input label="Stays from" type="date" value={draft.stay_from ?? ""} onChange={(e) => setDraft({ ...draft, stay_from: e.target.value })} />
                <Input label="Stays to" type="date" value={draft.stay_to ?? ""} onChange={(e) => setDraft({ ...draft, stay_to: e.target.value })} />
                <Input label="Book by" type="date" helperText="For early-bird or last-minute" value={draft.book_by ?? ""} onChange={(e) => setDraft({ ...draft, book_by: e.target.value })} />
              </div>

              <p className="mt-3 mb-1 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Applies to
              </p>
              <div className="flex flex-wrap gap-2">
                {roomRates.map((r) => {
                  const on = (draft.room_slugs ?? []).includes(r.room_slug);
                  return (
                    <button
                      key={r.room_slug}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          room_slugs: on
                            ? draft.room_slugs.filter((s) => s !== r.room_slug)
                            : [...(draft.room_slugs ?? []), r.room_slug],
                        })
                      }
                      className={
                        on
                          ? "rounded-lg border border-forest-green bg-forest-green/10 px-3 py-1.5 font-body text-xs text-forest-green"
                          : "rounded-lg border border-admin-card-border px-3 py-1.5 font-body text-xs text-charcoal/70"
                      }
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 font-body text-xs text-charcoal/50">
                {(draft.room_slugs ?? []).length === 0
                  ? "None selected — the offer applies to every room type."
                  : `${draft.room_slugs.length} selected.`}
              </p>
            </div>

            {/* Reward */}
            <div>
              <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Reward — pick one
              </h3>
              <Select
                label="Reward type"
                value={draft.reward_type}
                onChange={(e) => setDraft({ ...draft, reward_type: e.target.value })}
                options={Object.entries(REWARD_LABELS).map(([value, label]) => ({ value, label }))}
              />

              {draft.reward_type === "percent_off_stay" && (
                <div className="mt-3">
                  <Input label="Percent off (%)" type="number" min="1" max="100" value={draft.reward_value} onChange={(e) => setDraft({ ...draft, reward_value: e.target.value })} />
                </div>
              )}
              {draft.reward_type === "flat_off" && (
                <div className="mt-3">
                  <Input label="Amount off (₹)" type="number" min="1" value={draft.reward_value} onChange={(e) => setDraft({ ...draft, reward_value: e.target.value })} />
                </div>
              )}
              {draft.reward_type === "free_night_per_n" && (
                <div className="mt-3">
                  <Input
                    label="Pay for N nights"
                    type="number"
                    min="1"
                    helperText="Stay N+1, pay for N. The cheapest qualifying night is the free one."
                    value={draft.reward_value}
                    onChange={(e) => setDraft({ ...draft, reward_value: e.target.value })}
                  />
                </div>
              )}
              {draft.reward_type === "tiered_per_night" && (
                <div className="mt-3 flex flex-col gap-2">
                  <p className="font-body text-xs text-charcoal/60">
                    A percentage off specific nights of the stay. Night 1 is the
                    first night the guest sleeps.
                  </p>
                  {(draft.reward_tiers ?? []).map((t, i) => (
                    <div key={i} className="flex items-end gap-2">
                      <Input label="Night" type="number" min="1" value={t.night} className="w-24" onChange={(e) => {
                        const tiers = [...draft.reward_tiers];
                        tiers[i] = { ...t, night: e.target.value };
                        setDraft({ ...draft, reward_tiers: tiers });
                      }} />
                      <Input label="% off" type="number" min="1" max="100" value={t.percent} className="w-24" onChange={(e) => {
                        const tiers = [...draft.reward_tiers];
                        tiers[i] = { ...t, percent: e.target.value };
                        setDraft({ ...draft, reward_tiers: tiers });
                      }} />
                      <Button size="sm" variant="ghost" aria-label="Remove tier" onClick={() => setDraft({ ...draft, reward_tiers: draft.reward_tiers.filter((_, k) => k !== i) })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="secondary" onClick={() => setDraft({ ...draft, reward_tiers: [...(draft.reward_tiers ?? []), { night: (draft.reward_tiers?.length ?? 0) + 2, percent: 20 }] })}>
                    <Plus className="h-4 w-4" /> Add tier
                  </Button>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-admin-card-border bg-admin-canvas-bg p-4">
              <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Preview before publishing
              </h3>
              <div className="grid gap-3 sm:grid-cols-4">
                <Select
                  label="Room"
                  value={sample.roomSlug}
                  onChange={(e) => setSample({ ...sample, roomSlug: e.target.value })}
                  options={roomRates.map((r) => ({ value: r.room_slug, label: r.label }))}
                />
                <Input label="Nights" type="number" min="1" value={sample.nights} onChange={(e) => setSample({ ...sample, nights: e.target.value })} />
                <Input label="Adults" type="number" min="1" value={sample.adults} onChange={(e) => setSample({ ...sample, adults: e.target.value })} />
                <div className="flex items-end">
                  <Button variant="secondary" onClick={runPreview} loading={previewing}>
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                </div>
              </div>

              {preview && (
                <div className="mt-4 font-body text-sm">
                  <p className="text-charcoal">
                    <strong>
                      {preview.sample.nights}-night{" "}
                      {roomRates.find((r) => r.room_slug === preview.sample.roomSlug)?.label} from{" "}
                      {preview.sample.checkIn}
                    </strong>
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-charcoal/60">Without this offer</p>
                      <p className="text-base font-semibold text-charcoal">{inr(preview.without.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/60">With this offer</p>
                      <p className="text-base font-semibold text-charcoal">{inr(preview.with.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/60">Guest saves</p>
                      <p className={preview.saving > 0 ? "text-base font-semibold text-forest-green" : "text-base font-semibold text-charcoal/50"}>
                        {inr(preview.saving)}
                      </p>
                    </div>
                  </div>
                  {!preview.offerWon && (
                    <p className="mt-3 rounded-lg bg-admin-status-pending-bg px-3 py-2 text-xs text-admin-status-pending-fg">
                      This offer does not apply to that sample. {preview.reason}
                    </p>
                  )}
                  {preview.with.peakNights > 0 && (
                    <p className="mt-2 text-xs text-charcoal/60">
                      {preview.with.peakNights} of these nights are peak — offers never apply to those.
                    </p>
                  )}
                  {preview.with.blackoutNights > 0 && (
                    <p className="mt-1 text-xs text-charcoal/60">
                      {preview.with.blackoutNights} are blackout nights — offers never apply to those either.
                    </p>
                  )}
                </div>
              )}
            </div>

            <Toggle
              checked={Boolean(draft.is_active)}
              onChange={(v) => setDraft({ ...draft, is_active: v })}
              label="Live"
              description="A live offer competes on every new quote. It still only applies where it beats the long-stay discount."
            />

            <div className="flex justify-end gap-2 border-t border-admin-card-border pt-4">
              <Button variant="secondary" onClick={() => { setDraft(null); setPreview(null); }}>
                Cancel
              </Button>
              <Button onClick={saveDraft} loading={saving}>
                {draft.id ? "Save offer" : "Create offer"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
