"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

/**
 * Tiptap rich text editor cho admin viết blog post.
 * Output là HTML — em convert sang markdown-ish khi save.
 * For Phase 1: lưu HTML trực tiếp vào body_mdx (MDX renderer hiểu HTML).
 */
export function PostEditor({ content, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold-700 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-4" },
      }),
      Placeholder.configure({
        placeholder: "Bắt đầu viết bài tại đây…",
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-navy max-w-none min-h-[400px] focus:outline-none px-5 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-cream-300 bg-white p-12 text-center text-navy/40">
        Đang tải editor…
      </div>
    );
  }

  function addLink() {
    const url = window.prompt("Dán URL:");
    if (url) editor!.chain().focus().setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("URL ảnh:");
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="rounded-lg border border-cream-300 bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-cream-300 bg-cream-50">
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          icon={Bold}
          label="Bold"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          icon={Italic}
          label="Italic"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          icon={Strikethrough}
          label="Strike"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          icon={Code}
          label="Code"
        />
        <Divider />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="H2"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          label="H3"
        />
        <Divider />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          icon={List}
          label="List"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="Numbered"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          icon={Quote}
          label="Quote"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          label="Divider"
        />
        <Divider />
        <ToolBtn onClick={addLink} active={editor.isActive("link")} icon={LinkIcon} label="Link" />
        <ToolBtn onClick={addImage} icon={ImageIcon} label="Image" />
        <Divider />
        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          label="Undo"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          label="Redo"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolBtn({
  onClick,
  active,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "size-9 rounded inline-flex items-center justify-center transition",
        active
          ? "bg-navy text-cream"
          : "text-navy hover:bg-navy/5",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

function Divider() {
  return <span className="self-center w-px h-5 bg-cream-300 mx-1" aria-hidden />;
}
