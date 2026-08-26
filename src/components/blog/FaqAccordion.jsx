import { ChevronDown } from "lucide-react";

/**
 * Article FAQ list.
 *
 * Built on <details>/<summary> rather than JavaScript state: the answers are
 * real DOM text with no client bundle, the disclosure works before hydration
 * and without JS at all, and keyboard and screen-reader behaviour comes from
 * the platform instead of hand-rolled ARIA.
 *
 * The same questions are also emitted as FAQPage JSON-LD from the page, which
 * is what search engines actually read for rich results.
 */
export function FaqAccordion({ faq }) {
  const entries = (faq ?? []).filter((f) => f?.question?.trim() && f?.answer?.trim());
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2
        id="faq-heading"
        className="font-[family-name:var(--font-primary)] text-2xl text-[rgb(110,97,70)]"
      >
        Frequently asked questions
      </h2>
      <div className="mt-5 flex flex-col gap-3">
        {entries.map((item, index) => (
          <details
            key={index}
            className="group overflow-hidden rounded-xl border border-[#c8b99a]/50 bg-white"
            // The first answer is open so the section does not read as an
            // empty stack of bars on arrival.
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-[#3a3d45] marker:content-['']">
              <span>{item.question}</span>
              <ChevronDown
                className="h-4 w-4 flex-shrink-0 text-[rgb(110,97,70)] transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-[#3a3d45]/80">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
