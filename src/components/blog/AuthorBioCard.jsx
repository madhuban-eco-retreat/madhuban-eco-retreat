import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

/** Byline card shown beneath the article body. */
export function AuthorBioCard({ author }) {
  if (!author) return null;

  const socials = [
    { href: author.twitter_url, icon: Twitter, label: `${author.name} on X` },
    { href: author.linkedin_url, icon: Linkedin, label: `${author.name} on LinkedIn` },
    { href: author.instagram_url, icon: Instagram, label: `${author.name} on Instagram` },
  ].filter((s) => s.href);

  return (
    <section
      aria-labelledby="author-heading"
      className="mt-14 rounded-2xl bg-[#F5F0E8] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {author.avatar_url ? (
          <Image
            src={author.avatar_url}
            alt={author.avatar_alt || author.name}
            width={80}
            height={80}
            className="h-20 w-20 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl font-semibold text-[rgb(110,97,70)]"
          >
            {author.name.charAt(0)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h2 id="author-heading" className="sr-only">
            About the author
          </h2>
          <Link
            href={`/blogs/author/${author.slug}`}
            className="font-[family-name:var(--font-primary)] text-xl text-[#3a3d45] hover:text-[rgb(110,97,70)]"
          >
            {author.name}
          </Link>
          {author.designation && (
            <p className="text-sm text-[rgb(110,97,70)]">{author.designation}</p>
          )}
          {author.bio && (
            <p className="mt-3 text-sm leading-relaxed text-[#3a3d45]/75">{author.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[rgb(110,97,70)] transition-colors hover:bg-[rgb(110,97,70)] hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
            {author.article_count > 0 && (
              <span className="text-xs text-[#3a3d45]/60">
                {author.article_count} article{author.article_count === 1 ? "" : "s"} published
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
