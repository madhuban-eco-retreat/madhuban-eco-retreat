"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, MessageCircle, Twitter } from "lucide-react";

/**
 * Share links for an article.
 *
 * Client-side so the copy-to-clipboard action works and so the URL can be read
 * from the browser — building it from the slug alone would drop any campaign
 * parameters the reader arrived with.
 */
export function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is denied in some embedded browsers; the share links
      // still work, so this is not worth surfacing as an error.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(110,97,70)]">
        Share this story
      </h2>
      <div className="flex flex-wrap gap-2">
        {targets.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c8b99a]/60 text-[rgb(110,97,70)] transition-colors hover:bg-[rgb(110,97,70)] hover:text-white"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Link copied" : "Copy link"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c8b99a]/60 text-[rgb(110,97,70)] transition-colors hover:bg-[rgb(110,97,70)] hover:text-white"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
