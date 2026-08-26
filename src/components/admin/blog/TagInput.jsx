"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * Tag chips with a free-text field.
 *
 * Enter and comma both commit, because typing "tigers, birds" and expecting two
 * tags is the obvious reading. Backspace on an empty field removes the last
 * chip, which is the convention everywhere else this pattern appears.
 */
export function TagInput({ value = [], onChange, placeholder = "Add a tag…" }) {
  const [draft, setDraft] = useState("");

  function commit(raw) {
    const parts = String(raw)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    // Case-insensitive de-duplication: "Ratapani" and "ratapani" are one tag.
    const seen = new Set(value.map((t) => t.toLowerCase()));
    const added = parts.filter((t) => {
      const key = t.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (added.length > 0) onChange([...value, ...added]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-warm-beige/50 px-2 py-1 font-body text-xs text-charcoal"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="text-charcoal/50 hover:text-error"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <span className="font-body text-xs text-charcoal/40">No tags yet</span>
        )}
      </div>
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          if (next.endsWith(",")) commit(next);
          else setDraft(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => commit(draft)}
        className="h-9 w-full rounded-xl border border-admin-card-border bg-admin-card-bg px-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest-green focus:outline-none"
      />
    </div>
  );
}
