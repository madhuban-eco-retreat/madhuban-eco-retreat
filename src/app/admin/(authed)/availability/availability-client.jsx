"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, addMonths, subMonths, addDays, subDays, startOfMonth, eachDayOfInterval, } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarRange, X, AlertTriangle, } from "lucide-react";
import { toast } from "sonner";
import { Button, Modal, Select, TextArea, Input, Badge, Card, } from "@/components/admin/ui";
import { computeCellState, blockedUnitsFor, } from "@/lib/admin/availability-utils";
import { BLOCK_REASON_OPTIONS, CUSTOM_BLOCK_REASON } from "@/lib/admin/block-reasons";
// ─── Color mapping ────────────────────────────────────────────────────────────
// Traffic-light reading of what is left: green = every unit free, amber = some
// free, red/charcoal = none free.
const CELL_CLASSES = {
    available: "bg-forest-green/15 border border-forest-green/30 text-forest-green",
    partial: "bg-gold-accent/30 border border-gold-accent/50 text-charcoal",
    "fully-booked": "bg-error/80 text-ivory",
    blocked: "bg-charcoal text-ivory",
    "check-in": "bg-gold-accent text-charcoal",
};
const LEGEND = [
    { state: "available", label: "All units available" },
    { state: "partial", label: "Some units left" },
    { state: "fully-booked", label: "Fully booked" },
    { state: "check-in", label: "Check-in day" },
    { state: "blocked", label: "Blocked" },
];
const REASON_OPTIONS = BLOCK_REASON_OPTIONS;
/** "2/4 available" — the number staff actually need off a calendar cell. */
function availabilityLabel(cellState) {
    return `${cellState.available}/${cellState.inventory} available`;
}
/**
 * Hover summary for a cell: how many units are gone, to what, and on whose say-so.
 *
 * title= is plain text, so the lines are joined with newlines rather than markup.
 */
function cellTooltip(room, date, cellState) {
    const lines = [`${room.name} — ${format(parseISO(date), "d MMM yyyy")}`, availabilityLabel(cellState)];
    if (cellState.occupied > 0) {
        lines.push(`${cellState.occupied} booked`);
    }
    for (const bl of cellState.blocks) {
        const units = blockedUnitsFor(bl, cellState.inventory);
        const who = bl.created_by_name ? ` · by ${bl.created_by_name}` : "";
        lines.push(`Blocked ${units} unit${units === 1 ? "" : "s"} — ${bl.reason ?? "no reason given"}${who}`, `   ${format(parseISO(bl.date_from), "d MMM")} – ${format(parseISO(bl.date_to), "d MMM yyyy")}`);
    }
    return lines.join("\n");
}
function statusLabel(status) {
    switch (status) {
        case "CONFIRMED": return "Confirmed";
        case "CHECKED_IN": return "Checked In";
        case "CHECKED_OUT": return "Checked Out";
        case "PENDING_PAYMENT": return "Pending Payment";
        default: return status;
    }
}
function statusVariant(status) {
    switch (status) {
        case "CONFIRMED": return "confirmed";
        case "CHECKED_IN": return "info";
        case "CHECKED_OUT": return "neutral";
        default: return "pending";
    }
}
function formatDisplayDate(dateStr) {
    return format(parseISO(dateStr), "EEE, d MMM yyyy");
}
function formatMonthLabel(dateStr) {
    return format(parseISO(dateStr), "MMMM yyyy");
}
function formatWeekLabel(fromDate, toDate) {
    const from = parseISO(fromDate);
    const to = subDays(parseISO(toDate), 1);
    if (format(from, "MMM yyyy") === format(to, "MMM yyyy")) {
        return `${format(from, "d")}–${format(to, "d MMM yyyy")}`;
    }
    return `${format(from, "d MMM")} – ${format(to, "d MMM yyyy")}`;
}
export function AvailabilityClient({ rooms, bookings, blocks, view, fromDate, toDate, today, blockRoomId = null, }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedCell, setSelectedCell] = useState(null);
    // Arriving from a room's "Block dates" link opens the form straight away,
    // seeded from the initial state rather than an effect so the modal is never
    // painted closed for a frame first.
    const [blockModalOpen, setBlockModalOpen] = useState(blockRoomId !== null);
    const [blockPrefill, setBlockPrefill] = useState(blockRoomId
        ? {
            room_id: blockRoomId,
            start_date: today,
            end_date: format(addDays(parseISO(today), 1), "yyyy-MM-dd"),
        }
        : {});
    const [blockModalKey, setBlockModalKey] = useState(0);
    // Compute days to display
    const lastDay = subDays(parseISO(toDate), 1);
    const days = eachDayOfInterval({
        start: parseISO(fromDate),
        end: lastDay,
    }).map((d) => format(d, "yyyy-MM-dd"));
    // ── Navigation ──────────────────────────────────────────────────────────────
    function navigate(newStart) {
        startTransition(() => {
            router.push(`/admin/availability?view=${view}&start=${newStart}`);
        });
    }
    function handlePrev() {
        if (view === "month") {
            navigate(format(subMonths(parseISO(fromDate), 1), "yyyy-MM-dd"));
        }
        else {
            navigate(format(subDays(parseISO(fromDate), 7), "yyyy-MM-dd"));
        }
    }
    function handleNext() {
        if (view === "month") {
            navigate(format(addMonths(parseISO(fromDate), 1), "yyyy-MM-dd"));
        }
        else {
            navigate(format(addDays(parseISO(fromDate), 7), "yyyy-MM-dd"));
        }
    }
    function handleToday() {
        if (view === "month") {
            navigate(format(startOfMonth(parseISO(today)), "yyyy-MM-dd"));
        }
        else {
            navigate(today);
        }
    }
    function handleViewToggle(newView) {
        if (newView === view)
            return;
        const newStart = newView === "month"
            ? format(startOfMonth(parseISO(fromDate)), "yyyy-MM-dd")
            : fromDate;
        startTransition(() => {
            router.push(`/admin/availability?view=${newView}&start=${newStart}`);
        });
    }
    // ── Cell click ──────────────────────────────────────────────────────────────
    function handleCellClick(room, date) {
        const cellState = computeCellState(room, date, bookings, blocks);
        setSelectedCell({ roomId: room.id, date, cellState });
    }
    // ── Block modal helpers ─────────────────────────────────────────────────────
    function openBlockModal(prefill) {
        setBlockPrefill(prefill ?? {});
        setBlockModalOpen(true);
        setBlockModalKey((k) => k + 1);
    }
    function openBlockFromCell(room, date) {
        openBlockModal({
            room_id: room.id,
            start_date: date,
            end_date: format(addDays(parseISO(date), 1), "yyyy-MM-dd"),
        });
    }
    // ── Remove block ────────────────────────────────────────────────────────────
    async function handleRemoveBlock(blockId) {
        if (!confirm("Remove this block? Dates will become bookable again."))
            return;
        try {
            const res = await fetch("/api/admin/availability/unblock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ block_id: blockId }),
            });
            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error ?? "Failed to remove block");
                return;
            }
            toast.success("Block removed");
            setSelectedCell(null);
            router.refresh();
        }
        catch {
            toast.error("Network error. Please try again.");
        }
    }
    const periodLabel = view === "month"
        ? formatMonthLabel(fromDate)
        : formatWeekLabel(fromDate, toDate);
    return (<div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} disabled={isPending} aria-label="Previous period" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-admin-card-border text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:opacity-40">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <button onClick={handleToday} disabled={isPending} className="h-9 px-3 rounded-xl border border-admin-card-border font-body text-sm text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:opacity-40">
            Today
          </button>
          <button onClick={handleNext} disabled={isPending} aria-label="Next period" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-admin-card-border text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:opacity-40">
            <ChevronRight className="w-4 h-4"/>
          </button>
          <h2 className="font-display text-xl font-medium text-charcoal ml-1">
            {periodLabel}
          </h2>
          {isPending && (<span className="font-body text-xs text-charcoal/40 animate-pulse">Loading…</span>)}
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl border border-admin-card-border overflow-hidden">
            {["month", "week"].map((v) => (<button key={v} onClick={() => handleViewToggle(v)} disabled={isPending} className={`h-9 px-4 font-body text-sm capitalize transition-colors disabled:opacity-40 ${view === v
                ? "bg-forest-green text-ivory"
                : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"}`}>
                {v}
              </button>))}
          </div>

          <Button variant="primary" size="sm" onClick={() => openBlockModal()}>
            <CalendarRange className="w-4 h-4"/>
            Block Dates
          </Button>
        </div>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        {LEGEND.map(({ state, label }) => (<div key={state} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-sm flex-shrink-0 ${CELL_CLASSES[state]}`}/>
            <span className="font-body text-xs text-charcoal/50">{label}</span>
          </div>))}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm border-2 border-gold-accent flex-shrink-0"/>
          <span className="font-body text-xs text-charcoal/50">Today</span>
        </div>
      </div>

      {/* ── Calendar grid ───────────────────────────────────────────────────── */}
      <Card>
        {rooms.length === 0 ? (<div className="py-12 text-center font-body text-sm text-charcoal/40">
            No active rooms found.
          </div>) : (<div className="overflow-x-auto -mx-6 px-6">
            <CalendarGrid rooms={rooms} days={days} bookings={bookings} blocks={blocks} today={today} view={view} selectedCell={selectedCell} onCellClick={handleCellClick}/>
          </div>)}
      </Card>

      {/* ── Side panel ──────────────────────────────────────────────────────── */}
      {selectedCell && (<SidePanel rooms={rooms} selectedCell={selectedCell} onClose={() => setSelectedCell(null)} onBlock={openBlockFromCell} onRemoveBlock={handleRemoveBlock}/>)}

      {/* ── Block Dates modal ────────────────────────────────────────────────── */}
      <BlockDatesModal key={blockModalKey} open={blockModalOpen} rooms={rooms} prefill={blockPrefill} today={today} onClose={() => setBlockModalOpen(false)} onSuccess={() => {
            setBlockModalOpen(false);
            router.refresh();
        }}/>
    </div>);
}
function CalendarGrid({ rooms, days, bookings, blocks, today, view, selectedCell, onCellClick, }) {
    const cellW = view === "week" ? "min-w-[80px]" : "min-w-[36px]";
    const cellH = view === "week" ? "h-12" : "h-8";
    const roomColW = "min-w-[120px] w-[120px]";
    return (<table className="border-separate border-spacing-0.5 min-w-full">
      <thead>
        <tr>
          {/* Room label column */}
          <th className={`${roomColW} sticky left-0 z-10 bg-admin-canvas-bg pb-1 text-left`}/>
          {days.map((day) => {
            const d = parseISO(day);
            const isToday = day === today;
            return (<th key={day} className={`${cellW} pb-1 text-center align-bottom`}>
                <div className={`flex flex-col items-center ${isToday ? "text-gold-accent font-semibold" : "text-charcoal/50"}`}>
                  <span className="font-body text-[10px] uppercase tracking-wide">
                    {format(d, "EEE").slice(0, view === "week" ? 3 : 1)}
                  </span>
                  <span className="font-body text-xs">
                    {view === "week" ? format(d, "d MMM") : format(d, "d")}
                  </span>
                </div>
              </th>);
        })}
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (<tr key={room.id}>
            {/* Room name */}
            <td className={`${roomColW} sticky left-0 z-10 bg-admin-canvas-bg pr-2 py-0.5`}>
              <span className="font-body text-xs font-medium text-charcoal truncate block">
                {room.name}
              </span>
              <span className="font-body text-[10px] text-charcoal/40">
                {room.inventory_count} unit{room.inventory_count === 1 ? "" : "s"}
              </span>
            </td>
            {days.map((day) => {
                const cellState = computeCellState(room, day, bookings, blocks);
                const isToday = day === today;
                const isSelected = selectedCell?.roomId === room.id && selectedCell?.date === day;
                const tooltip = cellTooltip(room, day, cellState);
                return (<td key={day} className={`${cellW} py-0.5`}>
                  <button type="button" onClick={() => onCellClick(room, day)} title={tooltip} aria-label={`${room.name} on ${format(parseISO(day), "d MMM yyyy")}: ${availabilityLabel(cellState)}`} className={`
                      w-full ${cellH} rounded-md flex items-center justify-center
                      font-body text-xs transition-all cursor-pointer
                      ${CELL_CLASSES[cellState.state]}
                      ${isToday ? "ring-2 ring-gold-accent ring-offset-1" : ""}
                      ${isSelected ? "ring-2 ring-forest-green ring-offset-1 scale-110" : "hover:scale-105"}
                    `}>
                    {/* Week view has room for the count; month view keeps the colour
                        alone and puts the numbers in the tooltip and side panel.
                        Single-unit rooms say nothing — "0/1" adds no information a
                        red cell has not already given. */}
                    {view === "week" && room.inventory_count > 1 && (<span className="text-[11px] font-medium">
                        {cellState.available}/{cellState.inventory}
                      </span>)}
                    {view === "week" && room.inventory_count === 1 && cellState.state === "blocked" && (<span className="text-[10px] font-medium">Blocked</span>)}
                  </button>
                </td>);
            })}
          </tr>))}
      </tbody>
    </table>);
}
function SidePanel({ rooms, selectedCell, onClose, onBlock, onRemoveBlock, }) {
    const room = rooms.find((r) => r.id === selectedCell.roomId);
    const { date, cellState } = selectedCell;
    const [removing, setRemoving] = useState(null);
    if (!room)
        return null;
    async function handleRemove(blockId) {
        setRemoving(blockId);
        await onRemoveBlock(blockId);
        setRemoving(null);
    }
    return (<div className="fixed inset-y-0 right-0 z-40 w-full max-w-sm shadow-2xl">
      {/* Backdrop (mobile) */}
      <div className="fixed inset-0 bg-charcoal/30 lg:hidden" onClick={onClose} aria-hidden="true"/>
      <div className="relative h-full overflow-y-auto bg-admin-card-bg border-l border-admin-card-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-admin-card-border px-5 py-4 flex-shrink-0">
          <div>
            <h3 className="font-display text-lg font-medium text-charcoal">
              {room.name}
            </h3>
            <p className="font-body text-xs text-charcoal/60 mt-0.5">
              {formatDisplayDate(date)}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close panel" className="rounded-lg p-1.5 text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Status summary */}
          <div>
            <StatePill state={cellState.state}/>
            <p className="mt-1.5 font-body text-sm font-medium text-charcoal">
              {cellState.available} of {cellState.inventory} unit
              {cellState.inventory === 1 ? "" : "s"} available
            </p>
            <p className="mt-0.5 font-body text-xs text-charcoal/50">
              {cellState.occupied} booked · {cellState.blocked} blocked
            </p>
          </div>

          {/* Bookings list */}
          {cellState.bookings.length > 0 && (<div>
              <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
                Bookings
              </h4>
              <ul className="space-y-2">
                {cellState.bookings.map((b) => (<li key={b.id} className="rounded-xl border border-admin-card-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-charcoal truncate">
                          {b.guest_name}
                        </p>
                        <p className="font-body text-xs text-charcoal/50 mt-0.5">
                          {b.num_adults + b.num_children} guests ·{" "}
                          {format(parseISO(b.checkin), "d MMM")} –{" "}
                          {format(parseISO(b.checkout), "d MMM")}
                        </p>
                      </div>
                      <Badge variant={statusVariant(b.status)}>
                        {statusLabel(b.status)}
                      </Badge>
                    </div>
                    <a href={`/admin/bookings/${b.id}`} className="mt-2 inline-block font-body text-xs text-earth-brown hover:underline underline-offset-4">
                      View booking →
                    </a>
                  </li>))}
              </ul>
            </div>)}

          {/* Blocks list */}
          {cellState.blocks.length > 0 && (<div>
              <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
                Blocks
              </h4>
              <ul className="space-y-2">
                {cellState.blocks.map((bl) => {
                const units = blockedUnitsFor(bl, cellState.inventory);
                return (<li key={bl.id} className="rounded-xl border border-admin-card-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-body text-sm font-medium text-charcoal">
                        {bl.reason ?? "No reason given"}
                      </p>
                      <Badge variant="neutral">
                        {units} unit{units === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <p className="font-body text-xs text-charcoal/50 mt-0.5">
                      {format(parseISO(bl.date_from), "d MMM")} –{" "}
                      {format(parseISO(bl.date_to), "d MMM yyyy")}
                    </p>
                    {bl.created_by_name && (<p className="font-body text-xs text-charcoal/50 mt-0.5">
                        Blocked by {bl.created_by_name}
                        {bl.created_at && ` on ${format(parseISO(bl.created_at), "d MMM yyyy")}`}
                      </p>)}
                    {bl.notes && (<p className="font-body text-xs text-charcoal/60 mt-1">
                        {bl.notes}
                      </p>)}
                    <button type="button" disabled={removing === bl.id} onClick={() => handleRemove(bl.id)} className="mt-2 font-body text-xs text-error hover:underline underline-offset-4 disabled:opacity-50">
                      {removing === bl.id ? "Removing…" : "Remove block"}
                    </button>
                  </li>);
            })}
              </ul>
            </div>)}
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 border-t border-admin-card-border px-5 py-4 space-y-2">
          {/* Offered whenever a unit is still free — on a multi-unit room that
              includes days that are already partly blocked. */}
          {cellState.available > 0 && (<Button variant="secondary" size="sm" className="w-full" onClick={() => onBlock(room, date)}>
              <CalendarRange className="w-4 h-4"/>
              Block This Day for {room.name}
            </Button>)}
          <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>);
}
function StatePill({ state }) {
    const labels = {
        available: "All Units Available",
        partial: "Partially Available",
        "fully-booked": "Fully Booked",
        blocked: "Blocked",
        "check-in": "Check-in Day",
    };
    return (<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${CELL_CLASSES[state]}`}>
      {labels[state]}
    </span>);
}
function BlockDatesModal({ open, rooms, prefill, today, onClose, onSuccess, }) {
    const [roomId, setRoomId] = useState(prefill.room_id ?? "");
    const [startDate, setStartDate] = useState(prefill.start_date ?? today);
    const [endDate, setEndDate] = useState(prefill.end_date ?? "");
    const [reason, setReason] = useState(prefill.reason ?? "");
    const [customReason, setCustomReason] = useState("");
    const [units, setUnits] = useState(1);
    const [notes, setNotes] = useState(prefill.notes ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    const roomOptions = rooms.map((r) => ({ value: r.id, label: r.name }));
    const isPrefillRoom = !!prefill.room_id;
    const selectedRoom = rooms.find((r) => r.id === roomId);
    const maxUnits = Math.max(selectedRoom?.inventory_count ?? 1, 1);
    const isCustomReason = reason === CUSTOM_BLOCK_REASON;
    // Switching from Glamping Tent (4) to a single-unit room must not leave a
    // stale "3" behind that the server would then reject.
    function handleRoomChange(nextRoomId) {
        setRoomId(nextRoomId);
        const nextMax = Math.max(rooms.find((r) => r.id === nextRoomId)?.inventory_count ?? 1, 1);
        setUnits((u) => Math.min(u, nextMax));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setServerError(null);
        if (!roomId) {
            setServerError("Please select a room type.");
            return;
        }
        if (!startDate) {
            setServerError("Start date is required.");
            return;
        }
        if (!endDate) {
            setServerError("End date is required.");
            return;
        }
        if (endDate <= startDate) {
            setServerError("End date must be after start date.");
            return;
        }
        if (!reason) {
            setServerError("Reason category is required.");
            return;
        }
        if (isCustomReason && !customReason.trim()) {
            setServerError("Please describe the custom reason.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/availability/block", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    room_id: roomId,
                    start_date: startDate,
                    end_date: endDate,
                    units: Math.min(Math.max(units, 1), maxUnits),
                    reason,
                    custom_reason: isCustomReason ? customReason.trim() : undefined,
                    notes: notes.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error ?? "Failed to create block.");
                return;
            }
            toast.success("Dates blocked");
            onSuccess();
        }
        catch {
            setServerError("Network error. Please try again.");
        }
        finally {
            setSubmitting(false);
        }
    }
    return (<Modal open={open} onClose={onClose} title="Block Dates" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Type */}
        <div>
          {isPrefillRoom ? (<div>
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal block mb-1">
                Room Type
              </label>
              <p className="font-body text-sm text-charcoal px-3 h-10 flex items-center border border-admin-card-border rounded-xl bg-charcoal/5">
                {rooms.find((r) => r.id === prefill.room_id)?.name ?? "—"}
              </p>
            </div>) : (<Select label="Room Type" required placeholder="Select a room type" options={roomOptions} value={roomId} onChange={(e) => handleRoomChange(e.target.value)}/>)}
        </div>

        {/* Units to block — pointless on a single-unit room, where the only
            possible answer is 1. */}
        {maxUnits > 1 && (<div>
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal block mb-1.5">
              Units to Block
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: maxUnits }, (_, i) => i + 1).map((n) => (<button key={n} type="button" onClick={() => setUnits(n)} aria-pressed={units === n} className={`h-9 min-w-[2.5rem] rounded-xl border px-3 font-body text-sm transition-colors ${units === n
                    ? "border-forest-green bg-forest-green text-ivory"
                    : "border-admin-card-border text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"}`}>
                  {n}
                </button>))}
            </div>
            <p className="mt-1.5 font-body text-xs text-charcoal/50">
              {units === maxUnits
                ? `Blocks all ${maxUnits} units — the room type is off sale for these dates.`
                : `${maxUnits - units} unit${maxUnits - units === 1 ? "" : "s"} stay bookable.`}
            </p>
          </div>)}

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start Date" type="date" required min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
          <Input label="End Date" type="date" required min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        </div>

        {/* Reason */}
        <Select label="Reason" required placeholder="Select a reason" options={REASON_OPTIONS} value={reason} onChange={(e) => setReason(e.target.value)}/>

        {/* Custom reason — this text is what gets stored as the block's reason,
            so it is what shows on the calendar rather than the word "Custom". */}
        {isCustomReason && (<Input label="Custom Reason" required placeholder="e.g. Tent floor replacement" maxLength={200} value={customReason} onChange={(e) => setCustomReason(e.target.value)}/>)}

        {/* Notes */}
        <TextArea label="Additional Notes" placeholder="Optional details for staff reference" helperText="Optional" value={notes} maxLength={500} currentLength={notes.length} onChange={(e) => setNotes(e.target.value)}/>

        {/* Server error */}
        {serverError && (<div className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5"/>
            <p className="font-body text-sm text-error">{serverError}</p>
          </div>)}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={submitting}>
            Block Dates
          </Button>
        </div>
      </form>
    </Modal>);
}
