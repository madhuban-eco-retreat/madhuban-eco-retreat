import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const FALLBACK_AVATAR =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

/**
 * Author bio card. Used after the FAQs on an article page (where the writer
 * is a footnote, not the headline) and at the top of the author's own
 * archive page — same visual language in both places. Centered layout
 * (avatar-above-name, not side-by-side) — reads as a calm profile card
 * rather than a wide banner competing with the article above it.
 */
export default function AuthorBio({ author, headingLevel = "h2" }) {
  if (!author) return null;
  const HeadingTag = headingLevel;

  return (
    <div className="flex flex-col items-center text-center gap-3 bg-white rounded-xl p-6 md:p-8 border border-warm-beige/60 shadow-sm max-w-md mx-auto">
      <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-earth-brown/15">
        <Image
          src={author.avatar_url || FALLBACK_AVATAR}
          alt={author.avatar_alt || author.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-xs text-charcoal/45 uppercase tracking-wide">
          Written by
        </p>
        <Link href={`/blogs/author/${author.slug}`}>
          <HeadingTag className="font-primary text-xl text-earth-brown hover:underline mt-1">
            {author.name}
          </HeadingTag>
        </Link>
        {author.designation && (
          <p className="text-sm text-charcoal/50 mt-0.5">
            {author.designation}
          </p>
        )}
      </div>
      {author.bio && (
        <p className="text-sm text-charcoal leading-relaxed">{author.bio}</p>
      )}
      {(author.twitter_url || author.linkedin_url || author.instagram_url) && (
        <div className="flex items-center justify-center gap-4 mt-1">
          {author.twitter_url && (
            <a
              href={author.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on Twitter`}
              className="text-earth-brown hover:text-brand-bronze"
            >
              <FaTwitter size={16} />
            </a>
          )}
          {author.linkedin_url && (
            <a
              href={author.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on LinkedIn`}
              className="text-earth-brown hover:text-brand-bronze"
            >
              <FaLinkedin size={16} />
            </a>
          )}
          {author.instagram_url && (
            <a
              href={author.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on Instagram`}
              className="text-earth-brown hover:text-brand-bronze"
            >
              <FaInstagram size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
