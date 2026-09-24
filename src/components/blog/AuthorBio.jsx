import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const FALLBACK_AVATAR =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

export default function AuthorBio({ author, headingLevel = "h2" }) {
  if (!author) return null;
  const HeadingTag = headingLevel;

  return (
    <div className="flex items-center gap-5 bg-white rounded-xl p-5 md:p-6 border border-warm-beige/60 shadow-sm w-full">
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border-2 border-earth-brown/15">
        <Image
          src={author.avatar_url || FALLBACK_AVATAR}
          alt={author.avatar_alt || author.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-charcoal/45 uppercase tracking-wide">
          Written by
        </p>
        <Link href={`/blogs/author/${author.slug}`}>
          <HeadingTag className="font-primary text-lg md:text-xl text-earth-brown hover:underline mt-0.5">
            {author.name}
          </HeadingTag>
        </Link>
        {author.designation && (
          <p className="text-sm text-charcoal/50 mt-0.5">
            {author.designation}
          </p>
        )}
        {author.bio && (
          <p className="text-sm text-charcoal leading-relaxed mt-2">{author.bio}</p>
        )}
        {(author.twitter_url || author.linkedin_url || author.instagram_url) && (
          <div className="flex items-center gap-4 mt-3">
            {author.twitter_url && (
              
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
    </div>
  );
}