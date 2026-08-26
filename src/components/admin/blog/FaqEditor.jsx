"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui";

/**
 * Question and answer pairs for the post.
 *
 * These become both the on-page FAQ accordion and the FAQPage JSON-LD block, so
 * an entry with only one half filled in is dropped at save time rather than
 * emitting a Question with no acceptedAnswer, which Search Console flags.
 */
export function FaqEditor({ value = [], onChange }) {
  function update(index, patch) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-xl border border-admin-card-border p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-charcoal/50">
              Question {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove question ${index + 1}`}
              className="text-charcoal/40 hover:text-error"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={item.question ?? ""}
            onChange={(e) => update(index, { question: e.target.value })}
            placeholder="How far is Ratapani from Bhopal?"
            className="h-9 w-full rounded-lg border border-admin-card-border bg-admin-card-bg px-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest-green focus:outline-none"
          />
          <textarea
            value={item.answer ?? ""}
            onChange={(e) => update(index, { answer: e.target.value })}
            placeholder="Answer…"
            rows={3}
            className="w-full resize-y rounded-lg border border-admin-card-border bg-admin-card-bg px-3 py-2 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest-green focus:outline-none"
          />
        </div>
      ))}

      {value.length === 0 && (
        <p className="font-body text-xs text-charcoal/40">
          No FAQs yet. These generate the FAQ schema for search results.
        </p>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange([...value, { question: "", answer: "" }])}
      >
        <Plus className="h-3.5 w-3.5" />
        Add FAQ
      </Button>
    </div>
  );
}
