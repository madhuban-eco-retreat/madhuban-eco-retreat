"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Card, Button, Input, Select, Toggle, Modal } from "@/components/admin/ui";
import { validateRatePayload } from "@/lib/admin/rates-validation.mjs";

/**
 * Rates & Rules.
 *
 * Four independent blocks — room prices, GST, occupancy charges, seasons — each
 * saving on its own so a half-finished edit in one cannot take another with it.
 *
 * Every save goes through a before -> after confirmation. These are live prices
 * on a public website: the cost of one careless keystroke is real money, and a
 * dialog that shows "Rs 12,000 -> Rs 1,200" is the cheapest place to catch a
 * missing zero.
 */

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/* ── before → after confirmation ─────────────────────────────────────────── */

function ConfirmDialog({ open, title, changes, saving, onCancel, onConfirm }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-4">
        <p className="font-body text-sm text-charcoal/70">
          These changes take effect on new quotes immediately. Bookings already
          confirmed keep the price they were made at.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead>
              <tr className="border-b border-admin-card-border text-xs uppercase tracking-wider text-charcoal/60">
                <th className="py-2 pr-4 font-semibold">Field</th>
                <th className="py-2 pr-4 font-semibold">Before</th>
                <th className="py-2 font-semibold">After</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => (
                <tr key={c.label} className="border-b border-admin-card-border/60">
                  <td className="py-2 pr-4 text-charcoal">{c.label}</td>
                  <td className="py-2 pr-4 text-charcoal/50 line-through">{c.before}</td>
                  <td className="py-2 font-semibold text-charcoal">{c.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {changes.length === 0 && (
          <p className="font-body text-sm text-charcoal/60">Nothing has changed.</p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={saving} disabled={changes.length === 0}>
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── screen ──────────────────────────────────────────────────────────────── */

export default function RatesClient({ initial }) {
  const [roomRates, setRoomRates] = useState(initial.roomRates ?? []);
  const [gst, setGst] = useState(initial.gstRules ?? initial.defaults?.gst ?? {});
  const [occ, setOcc] = useState(initial.occupancyRules ?? {});
  const [longStay, setLongStay] = useState(initial.longStayRules ?? {});
  const [seasons, setSeasons] = useState(initial.seasons ?? []);

  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [seasonDraft, setSeasonDraft] = useState(null);

  const original = useMemo(
    () => ({
      roomRates: initial.roomRates ?? [],
      gst: initial.gstRules ?? {},
      occ: initial.occupancyRules ?? {},
      longStay: initial.longStayRules ?? {},
    }),
    [initial],
  );

  const save = useCallback(async (payload, onDone) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/rates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      toast.success("Saved — new quotes use these values from now on");
      onDone?.();
      setConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, []);

  const askToSave = (kind, payload, changes, title) => {
    const errors = validateRatePayload(kind, payload);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    setConfirm({ title, changes, payload: { kind, ...payload } });
  };

  if (initial.loadError) {
    return (
      <Card>
        <p className="font-body text-sm text-error">{initial.loadError}</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Rates &amp; Rules</h1>
        <p className="font-body text-sm text-charcoal/60">
          The rate card the booking engine quotes from. Changes apply to new
          quotes only — confirmed bookings keep the price they were made at.
        </p>
      </header>

      {initial.migrationPending && (
        <Card className="border-admin-status-pending-fg/30 bg-admin-status-pending-bg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-admin-status-pending-fg" />
            <div className="font-body text-sm text-admin-status-pending-fg">
              <p className="font-semibold">The rates migration has not been applied yet.</p>
              <p className="mt-1">
                Run <code>supabase/migrations/20260912_admin_rates_offers.sql</code> in the
                Supabase SQL editor. Until then the site quotes from the values built into
                the code, and saving here will fail.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Room rates ─────────────────────────────────────────────────── */}
      <Card>
        <h2 className="mb-1 font-display text-lg font-semibold text-charcoal">Room rates</h2>
        <p className="mb-4 font-body text-xs text-charcoal/60">
          Per night, double occupancy, before GST. The peak rate is what a
          Christmas/New Year night costs — it is stored separately, so a category
          can break the standard +20% without changing it for everyone.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead>
              <tr className="border-b border-admin-card-border text-xs uppercase tracking-wider text-charcoal/60">
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 pr-4 font-semibold">Regular</th>
                <th className="py-2 pr-4 font-semibold">Peak</th>
                <th className="py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {roomRates.map((r, i) => {
                const before = original.roomRates.find((o) => o.room_slug === r.room_slug);
                const dirty =
                  Number(before?.regular_rate) !== Number(r.regular_rate) ||
                  Number(before?.peak_rate) !== Number(r.peak_rate);
                return (
                  <tr key={r.room_slug} className="border-b border-admin-card-border/60">
                    <td className="py-3 pr-4 font-medium text-charcoal">{r.label}</td>
                    <td className="py-3 pr-4">
                      <Input
                        type="number"
                        min="0"
                        value={r.regular_rate ?? ""}
                        aria-label={`${r.label} regular rate`}
                        onChange={(e) => {
                          const next = [...roomRates];
                          next[i] = { ...r, regular_rate: e.target.value };
                          setRoomRates(next);
                        }}
                        className="w-32"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Input
                        type="number"
                        min="0"
                        value={r.peak_rate ?? ""}
                        aria-label={`${r.label} peak rate`}
                        onChange={(e) => {
                          const next = [...roomRates];
                          next[i] = { ...r, peak_rate: e.target.value };
                          setRoomRates(next);
                        }}
                        className="w-32"
                      />
                    </td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        disabled={!dirty}
                        onClick={() =>
                          askToSave(
                            "room_rate",
                            {
                              room_slug: r.room_slug,
                              label: r.label,
                              regular_rate: r.regular_rate,
                              peak_rate: r.peak_rate,
                              sort_order: r.sort_order,
                            },
                            [
                              {
                                label: `${r.label} — regular`,
                                before: inr(before?.regular_rate),
                                after: inr(r.regular_rate),
                              },
                              {
                                label: `${r.label} — peak`,
                                before: inr(before?.peak_rate),
                                after: inr(r.peak_rate),
                              },
                            ].filter((c) => c.before !== c.after),
                            `Change ${r.label} rates?`,
                          )
                        }
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── GST ────────────────────────────────────────────────────────── */}
      <Card>
        <h2 className="mb-1 font-display text-lg font-semibold text-charcoal">GST slabs</h2>
        <p className="mb-4 font-body text-xs text-charcoal/60">
          The threshold is read against the effective per-night value — the rate
          after the peak surcharge and any discount, with extra-person charges
          added. A night at or below the threshold takes the lower rate.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Threshold (₹)"
            type="number"
            min="0"
            value={gst.threshold ?? ""}
            onChange={(e) => setGst({ ...gst, threshold: e.target.value })}
          />
          <Input
            label="Lower rate (%)"
            type="number"
            min="0"
            value={gst.rate_low ?? ""}
            onChange={(e) => setGst({ ...gst, rate_low: e.target.value })}
          />
          <Input
            label="Higher rate (%)"
            type="number"
            min="0"
            value={gst.rate_high ?? ""}
            onChange={(e) => setGst({ ...gst, rate_high: e.target.value })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() =>
              askToSave(
                "gst",
                { threshold: gst.threshold, rate_low: gst.rate_low, rate_high: gst.rate_high },
                [
                  { label: "Threshold", before: inr(original.gst.threshold), after: inr(gst.threshold) },
                  { label: "Lower rate", before: `${original.gst.rate_low}%`, after: `${gst.rate_low}%` },
                  { label: "Higher rate", before: `${original.gst.rate_high}%`, after: `${gst.rate_high}%` },
                ].filter((c) => c.before !== c.after),
                "Change GST slabs?",
              )
            }
          >
            Save GST slabs
          </Button>
        </div>
      </Card>

      {/* ── Occupancy ──────────────────────────────────────────────────── */}
      <Card>
        <h2 className="mb-1 font-display text-lg font-semibold text-charcoal">
          Extra person &amp; bedding
        </h2>
        <p className="mb-4 font-body text-xs text-charcoal/60">
          Per night, before GST. These are added to the room value, so they can
          carry a night over the GST threshold.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Extra adult (₹)"
            type="number"
            min="0"
            value={occ.extra_adult_rate ?? ""}
            onChange={(e) => setOcc({ ...occ, extra_adult_rate: e.target.value })}
          />
          <Input
            label="Child (₹)"
            type="number"
            min="0"
            value={occ.child_rate ?? ""}
            onChange={(e) => setOcc({ ...occ, child_rate: e.target.value })}
          />
          <Input
            label="Extra bedding (₹)"
            type="number"
            min="0"
            value={occ.extra_bedding_rate ?? ""}
            onChange={(e) => setOcc({ ...occ, extra_bedding_rate: e.target.value })}
          />
          <Input
            label="Infant (₹)"
            type="number"
            min="0"
            value={occ.infant_rate ?? 0}
            onChange={(e) => setOcc({ ...occ, infant_rate: e.target.value })}
          />
          <Input
            label="Infant up to age"
            type="number"
            min="0"
            helperText="Free at or below this age"
            value={occ.infant_max_age ?? ""}
            onChange={(e) => setOcc({ ...occ, infant_max_age: e.target.value })}
          />
          <Input
            label="Child up to age"
            type="number"
            min="0"
            helperText="Above this counts as an adult"
            value={occ.child_max_age ?? ""}
            onChange={(e) => setOcc({ ...occ, child_max_age: e.target.value })}
          />
          <Input
            label="Adults included"
            type="number"
            min="1"
            value={occ.default_adults_included ?? ""}
            onChange={(e) => setOcc({ ...occ, default_adults_included: e.target.value })}
          />
          <Input
            label="Maximum adults"
            type="number"
            min="1"
            value={occ.default_max_adults ?? ""}
            onChange={(e) => setOcc({ ...occ, default_max_adults: e.target.value })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() =>
              askToSave(
                "occupancy",
                occ,
                [
                  ["Extra adult", "extra_adult_rate", inr],
                  ["Child", "child_rate", inr],
                  ["Extra bedding", "extra_bedding_rate", inr],
                  ["Infant", "infant_rate", inr],
                  ["Infant max age", "infant_max_age", String],
                  ["Child max age", "child_max_age", String],
                  ["Adults included", "default_adults_included", String],
                  ["Maximum adults", "default_max_adults", String],
                ]
                  .map(([label, key, fmt]) => ({
                    label,
                    before: fmt(original.occ[key]),
                    after: fmt(occ[key]),
                  }))
                  .filter((c) => c.before !== c.after),
                "Change extra-person charges?",
              )
            }
          >
            Save charges
          </Button>
        </div>
      </Card>

      {/* ── Long stay ──────────────────────────────────────────────────── */}
      <Card>
        <h2 className="mb-1 font-display text-lg font-semibold text-charcoal">
          Long-stay discount
        </h2>
        <p className="mb-4 font-body text-xs text-charcoal/60">
          The standing house discount. Withheld on peak and blackout nights, and
          it competes with campaign offers — a guest gets whichever saves more,
          never both.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Discount (%)"
            type="number"
            min="0"
            max="99"
            value={Math.round((Number(longStay.discount_rate) || 0) * 100)}
            onChange={(e) =>
              setLongStay({ ...longStay, discount_rate: Number(e.target.value) / 100 })
            }
          />
          <Input
            label="Minimum nights"
            type="number"
            min="1"
            value={longStay.min_nights ?? ""}
            onChange={(e) => setLongStay({ ...longStay, min_nights: e.target.value })}
          />
          <div className="flex items-end pb-1">
            <Toggle
              checked={Boolean(longStay.is_active ?? true)}
              onChange={(v) => setLongStay({ ...longStay, is_active: v })}
              label="Active"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() =>
              askToSave(
                "long_stay",
                {
                  discount_rate: longStay.discount_rate,
                  min_nights: longStay.min_nights,
                  applies_on_peak: false,
                  is_active: longStay.is_active ?? true,
                },
                [
                  {
                    label: "Discount",
                    before: `${Math.round((Number(original.longStay.discount_rate) || 0) * 100)}%`,
                    after: `${Math.round((Number(longStay.discount_rate) || 0) * 100)}%`,
                  },
                  {
                    label: "Minimum nights",
                    before: String(original.longStay.min_nights),
                    after: String(longStay.min_nights),
                  },
                  {
                    label: "Active",
                    before: String(original.longStay.is_active ?? true),
                    after: String(longStay.is_active ?? true),
                  },
                ].filter((c) => c.before !== c.after),
                "Change the long-stay discount?",
              )
            }
          >
            Save discount
          </Button>
        </div>
      </Card>

      {/* ── Seasons ────────────────────────────────────────────────────── */}
      <Card>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Peak &amp; blackout dates
          </h2>
          <Button
            size="sm"
            onClick={() =>
              setSeasonDraft({
                kind: "blackout",
                label: "",
                is_recurring: false,
                start_date: "",
                end_date: "",
                is_active: true,
              })
            }
          >
            <Plus className="h-4 w-4" /> Add period
          </Button>
        </div>
        <p className="mb-4 font-body text-xs text-charcoal/60">
          <strong>Peak</strong> adds the surcharge and withholds discounts.{" "}
          <strong>Blackout</strong> is the regular rate but still withholds them —
          for festivals and long weekends. Recurring periods match by month and
          day every year; dated ones are for lunar festivals and must be
          refreshed annually.
        </p>

        <div className="flex flex-col gap-2">
          {seasons.length === 0 && (
            <p className="font-body text-sm text-charcoal/60">No periods configured.</p>
          )}
          {seasons.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-card-border p-3"
            >
              <div className="flex flex-col">
                <span className="font-body text-sm font-semibold text-charcoal">
                  {s.label}{" "}
                  <span
                    className={
                      s.kind === "peak"
                        ? "ml-1 rounded-md bg-admin-status-pending-bg px-2 py-0.5 text-xs text-admin-status-pending-fg"
                        : "ml-1 rounded-md bg-admin-status-neutral-bg px-2 py-0.5 text-xs text-admin-status-neutral-fg"
                    }
                  >
                    {s.kind === "peak" ? "Peak +surcharge" : "No discount"}
                  </span>
                </span>
                <span className="font-body text-xs text-charcoal/60">
                  {s.is_recurring
                    ? `Every year: ${s.start_day}/${s.start_month} – ${s.end_day}/${s.end_month}`
                    : `${s.start_date} – ${s.end_date}`}
                  {!s.is_active && " · inactive"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setSeasonDraft(s)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    if (!window.confirm(`Delete "${s.label}"? Future quotes stop treating these dates specially.`))
                      return;
                    const res = await fetch(`/api/admin/rates?seasonId=${s.id}`, { method: "DELETE" });
                    if (res.ok) {
                      setSeasons(seasons.filter((x) => x.id !== s.id));
                      toast.success(`Removed ${s.label}`);
                    } else {
                      toast.error("Could not delete");
                    }
                  }}
                  aria-label={`Delete ${s.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── season editor ──────────────────────────────────────────────── */}
      <Modal
        open={Boolean(seasonDraft)}
        onClose={() => setSeasonDraft(null)}
        title={seasonDraft?.id ? "Edit period" : "Add period"}
      >
        {seasonDraft && (
          <div className="flex flex-col gap-4">
            <Input
              label="Label"
              value={seasonDraft.label}
              onChange={(e) => setSeasonDraft({ ...seasonDraft, label: e.target.value })}
              required
            />
            <Select
              label="Type"
              value={seasonDraft.kind}
              onChange={(e) => setSeasonDraft({ ...seasonDraft, kind: e.target.value })}
              options={[
                { value: "blackout", label: "Blackout — regular rate, no discount" },
                { value: "peak", label: "Peak — surcharge and no discount" },
              ]}
            />
            <Toggle
              checked={Boolean(seasonDraft.is_recurring)}
              onChange={(v) => setSeasonDraft({ ...seasonDraft, is_recurring: v })}
              label="Repeats every year (same month and day)"
            />
            {seasonDraft.is_recurring ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Input label="Start month" type="number" min="1" max="12" value={seasonDraft.start_month ?? ""} onChange={(e) => setSeasonDraft({ ...seasonDraft, start_month: e.target.value })} />
                <Input label="Start day" type="number" min="1" max="31" value={seasonDraft.start_day ?? ""} onChange={(e) => setSeasonDraft({ ...seasonDraft, start_day: e.target.value })} />
                <Input label="End month" type="number" min="1" max="12" value={seasonDraft.end_month ?? ""} onChange={(e) => setSeasonDraft({ ...seasonDraft, end_month: e.target.value })} />
                <Input label="End day" type="number" min="1" max="31" value={seasonDraft.end_day ?? ""} onChange={(e) => setSeasonDraft({ ...seasonDraft, end_day: e.target.value })} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start date" type="date" value={seasonDraft.start_date ?? ""} onChange={(e) => setSeasonDraft({ ...seasonDraft, start_date: e.target.value })} />
                <Input label="End date" type="date" helperText="Inclusive — the last night at this rate" value={seasonDraft.end_date ?? ""} onChange={(e) => setSeasonDraft({ ...seasonDraft, end_date: e.target.value })} />
              </div>
            )}
            <Toggle
              checked={Boolean(seasonDraft.is_active ?? true)}
              onChange={(v) => setSeasonDraft({ ...seasonDraft, is_active: v })}
              label="Active"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSeasonDraft(null)}>
                Cancel
              </Button>
              <Button
                loading={saving}
                onClick={async () => {
                  const payload = {
                    id: seasonDraft.id,
                    kind_of_season: seasonDraft.kind,
                    label: seasonDraft.label,
                    is_recurring: seasonDraft.is_recurring,
                    start_date: seasonDraft.start_date,
                    end_date: seasonDraft.end_date,
                    start_month: seasonDraft.start_month,
                    start_day: seasonDraft.start_day,
                    end_month: seasonDraft.end_month,
                    end_day: seasonDraft.end_day,
                    is_active: seasonDraft.is_active ?? true,
                    sort_order: seasonDraft.sort_order ?? 0,
                  };
                  const errors = validateRatePayload("season", {
                    ...payload,
                    kind: seasonDraft.kind,
                  });
                  if (errors.length > 0) {
                    toast.error(errors[0]);
                    return;
                  }
                  await save({ kind: "season", ...payload }, () => {
                    setSeasonDraft(null);
                    // Re-read rather than patching state by hand: the row may
                    // have been created, and only the server knows its id.
                    window.location.reload();
                  });
                }}
              >
                Save period
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title ?? ""}
        changes={confirm?.changes ?? []}
        saving={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={() => save(confirm.payload, () => window.location.reload())}
      />
    </div>
  );
}
