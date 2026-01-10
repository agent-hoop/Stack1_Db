import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import "./Editor.css";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

/* ---------- Toolbar Button ---------- */
const ToolbarButton = ({ onClick, isActive, children, tooltip }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault(); // VERY IMPORTANT for selection
      onClick();
    }}
    className={`p-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`}
    title={tooltip}
  >
    {children}
  </button>
);

export default function Editor({ content, setContent }) {
  const [editorState, setEditorState] = useState(0); // forces toolbar refresh

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
  heading: {
    levels: [1, 2, 3],
  },
}),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write something amazing…",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-400 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[400px] p-6 prose prose-invert max-w-none",
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
      setEditorState((s) => s + 1);
    },
    onSelectionUpdate() {
      setEditorState((s) => s + 1);
    },
  });

  /* ---------- External content sync ---------- */
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  /* ---------- Commands ---------- */
  const addImage = useCallback(() => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "");
    if (url === null) return;
    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl bg-[#0c0e12] border border-white/10 shadow-xl overflow-hidden">
      
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 p-2 bg-[#161920] border-b border-white/10">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={setLink} isActive={editor.isActive("link")}>
          <LinkIcon size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={addImage}>
          <ImageIcon size={18} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Footer */}
      <div className="flex justify-between px-4 py-2 text-xs text-gray-500 border-t border-white/10 bg-[#161920]">
        <span>⌘ / Ctrl + B for bold</span>
      </div>
    </div>
  );
}
