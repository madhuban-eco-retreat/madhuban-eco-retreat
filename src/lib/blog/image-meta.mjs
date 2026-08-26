/**
 * Minimal image header parser — pixel dimensions and MIME type from a buffer.
 *
 * Written as .mjs with no imports so that both the Next.js runtime and the
 * plain-node import script (scripts/migrate-blogs.mjs) can load the same code.
 * This package has no "type": "module", so a .js file here would be parsed as
 * CommonJS by node and could not be imported from the ESM script.
 *
 * Dimensions are read straight from the file header rather than by decoding, so
 * this stays dependency-free — `sharp` would pull a native binary into the
 * build for what is a handful of byte offsets.
 */

/** @returns {{ mimeType: string|null, width: number|null, height: number|null }} */
export function imageMetaFromBuffer(input) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const empty = { mimeType: null, width: null, height: null };
  if (b.length < 16) return empty;

  // ── PNG: 8-byte signature, then an IHDR chunk carrying width/height ────────
  if (b.length >= 24 && b.toString("hex", 0, 8) === "89504e470d0a1a0a") {
    return {
      mimeType: "image/png",
      width: b.readUInt32BE(16),
      height: b.readUInt32BE(20),
    };
  }

  // ── GIF: "GIF87a"/"GIF89a", then little-endian logical screen size ─────────
  if (b.toString("ascii", 0, 3) === "GIF") {
    return {
      mimeType: "image/gif",
      width: b.readUInt16LE(6),
      height: b.readUInt16LE(8),
    };
  }

  // ── WebP: RIFF container, dimensions differ per VP8 flavour ───────────────
  if (
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP"
  ) {
    const flavour = b.toString("ascii", 12, 16);
    try {
      if (flavour === "VP8 " && b.length >= 30) {
        // Lossy: 14-byte frame header, then 14-bit width/height.
        return {
          mimeType: "image/webp",
          width: b.readUInt16LE(26) & 0x3fff,
          height: b.readUInt16LE(28) & 0x3fff,
        };
      }
      if (flavour === "VP8L" && b.length >= 25) {
        // Lossless: 14-bit dimensions packed into 4 bytes after the signature.
        const bits = b.readUInt32LE(21);
        return {
          mimeType: "image/webp",
          width: (bits & 0x3fff) + 1,
          height: ((bits >> 14) & 0x3fff) + 1,
        };
      }
      if (flavour === "VP8X" && b.length >= 30) {
        // Extended: 24-bit little-endian canvas size, stored minus one.
        return {
          mimeType: "image/webp",
          width: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1,
          height: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1,
        };
      }
    } catch {
      // Truncated or malformed — fall through to the type-only answer below.
    }
    return { mimeType: "image/webp", width: null, height: null };
  }

  // ── JPEG: walk the segment chain to the SOF marker ────────────────────────
  if (b[0] === 0xff && b[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < b.length) {
      if (b[offset] !== 0xff) {
        offset += 1; // Resynchronise past padding rather than giving up.
        continue;
      }
      const marker = b[offset + 1];
      // SOF0..SOF15 carry the frame size; DHT/JPG/DAC (c4/c8/cc) do not.
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return {
          mimeType: "image/jpeg",
          height: b.readUInt16BE(offset + 5),
          width: b.readUInt16BE(offset + 7),
        };
      }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
        offset += 2; // Standalone markers carry no length field.
        continue;
      }
      offset += 2 + b.readUInt16BE(offset + 2);
    }
    return { mimeType: "image/jpeg", width: null, height: null };
  }

  // ── AVIF / HEIF: ftyp box brand ───────────────────────────────────────────
  if (b.length >= 12 && b.toString("ascii", 4, 8) === "ftyp") {
    const brand = b.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") {
      // Dimensions live in an ispe box; not worth walking for a rare format.
      return { mimeType: "image/avif", width: null, height: null };
    }
  }

  return empty;
}

/** Splits a data: URI into its MIME type and decoded bytes. */
export function decodeDataUri(uri) {
  const match = /^data:([^;,]+)(;charset=[^;,]+)?;base64,(.*)$/s.exec(
    String(uri || "").trim(),
  );
  if (!match) return null;
  return {
    mimeType: match[1].toLowerCase(),
    buffer: Buffer.from(match[3], "base64"),
  };
}
