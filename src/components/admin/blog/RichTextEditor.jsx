"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import Image from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The article body editor.
 *
 * Content is stored as HTML rather than ProseMirror JSON. The eleven imported
 * MongoDB posts are HTML, the public pages render HTML, and keeping one
 * representation avoids a conversion step on every read — the legacy
 * blog_posts table stored JSON and had to be converted during migration.
 */

const HEADING_LEVELS = [1, 2, 3, 4];
const SWATCHES = ["#2F3E34", "#6B7F5E", "#B4894A", "#8C3B2E", "#2B4C6F", "#4A4A4A"];

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active ? true : undefined}
      title={label}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-charcoal/70 transition-colors",
        "hover:bg-charcoal/5 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-forest-green/10 text-forest-green",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px flex-shrink-0 bg-admin-card-border" aria-hidden="true" />;
}

export function RichTextEditor({
  value,
  onChange,
  blogId = null,
  placeholder = "Start writing the article…",
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  // Lets the change handler tell "the user typed" from "we just loaded a draft".
  const hydratedRef = useRef(false);

  const editor = useEditor({
    // Required under the App Router: rendering the editor during SSR produces
    // markup the client immediately replaces, which React reports as a
    // hydration mismatch.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: HEADING_LEVELS },
        // v3's StarterKit bundles Link; opening links on click inside the
        // editor would navigate away mid-edit.
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, HTMLAttributes: { loading: "lazy" } }),
      TableKit.configure({ table: { resizable: true } }),
      Youtube.configure({ controls: true, nocookie: true, modestBranding: true }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[28rem] px-5 py-4",
      },
    },
    onUpdate: ({ editor: instance }) => {
      if (!hydratedRef.current) return;
      onChange(instance.getHTML());
    },
  });

  // Loading an existing post: the editor mounts empty, then the fetched HTML
  // arrives. Without the emitUpdate:false guard this write would fire onUpdate
  // and mark a freshly opened post as having unsaved changes.
  useEffect(() => {
    if (!editor) return;
    const incoming = value ?? "";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
    hydratedRef.current = true;
  }, [editor, value]);

  const uploadFile = useCallback(
    async (file) => {
      if (!file || !editor) return;
      setUploading(true);
      setUploadError(null);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("fileName", file.name);
        if (blogId) form.append("blogId", blogId);

        const res = await fetch("/api/admin/blog/upload-image", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");

        editor
          .chain()
          .focus()
          .setImage({ src: data.url, alt: data.altText || file.name })
          .run();
      } catch (error) {
        setUploadError(error.message);
      } finally {
        setUploading(false);
      }
    },
    [editor, blogId],
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    // A bare "madhubanecoretreat.com" would otherwise resolve relative to the
    // current page and 404.
    const href = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube URL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex min-h-[32rem] items-center justify-center rounded-xl border border-admin-card-border bg-admin-card-bg">
        <Loader2 className="h-5 w-5 animate-spin text-charcoal/40" aria-hidden="true" />
      </div>
    );
  }

  const inTable = editor.isActive("table");

  return (
    <div className="overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-[var(--admin-card-shadow)]">
      <div
        className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-admin-card-border bg-admin-canvas-bg px-2 py-1.5"
        role="toolbar"
        aria-label="Formatting"
      >
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {HEADING_LEVELS.map((level) => (
          <ToolbarButton
            key={level}
            label={`Heading ${level}`}
            active={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            <span className="font-body text-xs font-semibold">H{level}</span>
          </ToolbarButton>
        ))}

        <Divider />

        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Align centre"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <label
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-1.5 text-charcoal/70 hover:bg-charcoal/5"
          title="Text colour"
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-charcoal/20"
            style={{ backgroundColor: editor.getAttributes("textStyle").color ?? "#2F3E34" }}
            aria-hidden="true"
          />
          <span className="sr-only">Text colour</span>
          <input
            type="color"
            className="h-0 w-0 opacity-0"
            value={editor.getAttributes("textStyle").color ?? "#2F3E34"}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        {SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            title={`Set colour ${swatch}`}
            aria-label={`Set colour ${swatch}`}
            onClick={() => editor.chain().focus().setColor(swatch).run()}
            className="h-4 w-4 flex-shrink-0 rounded-full border border-charcoal/15"
            style={{ backgroundColor: swatch }}
          />
        ))}
        <ToolbarButton
          label="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Add link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label={uploading ? "Uploading image…" : "Insert image"}
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </ToolbarButton>
        <ToolbarButton label="Embed YouTube video" onClick={addYoutube}>
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Insert table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        {inTable && (
          <>
            <ToolbarButton
              label="Add column"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <span className="font-body text-[10px] font-semibold">+Col</span>
            </ToolbarButton>
            <ToolbarButton
              label="Add row"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <span className="font-body text-[10px] font-semibold">+Row</span>
            </ToolbarButton>
            <ToolbarButton
              label="Delete column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <span className="font-body text-[10px] font-semibold">−Col</span>
            </ToolbarButton>
            <ToolbarButton
              label="Delete row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <span className="font-body text-[10px] font-semibold">−Row</span>
            </ToolbarButton>
            <ToolbarButton
              label="Delete table"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <span className="font-body text-[10px] font-semibold text-error">×Table</span>
            </ToolbarButton>
          </>
        )}

        <Divider />

        <ToolbarButton
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Cleared so choosing the same file twice in a row still fires.
          e.target.value = "";
          uploadFile(file);
        }}
      />

      {uploadError && (
        <p role="alert" className="border-b border-error/20 bg-error/5 px-5 py-2 font-body text-xs text-error">
          {uploadError}
        </p>
      )}

      <EditorContent editor={editor} />

      <div className="flex justify-end gap-4 border-t border-admin-card-border bg-admin-canvas-bg px-5 py-2 font-body text-xs tabular-nums text-charcoal/50">
        <span>{editor.storage.characterCount.words()} words</span>
        <span>{editor.storage.characterCount.characters()} characters</span>
      </div>
    </div>
  );
}
