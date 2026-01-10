import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export default function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-[#0c0e12] p-4 rounded-2xl min-h-[400px] flex flex-col gap-4 text-white shadow-lg">
      
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          className={`px-3 py-1 rounded ${editor.isActive("bold") ? "bg-indigo-600 text-white" : "bg-white/10 text-white/70"}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className={`px-3 py-1 rounded ${editor.isActive("italic") ? "bg-indigo-600 text-white" : "bg-white/10 text-white/70"}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className={`px-3 py-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-indigo-600 text-white" : "bg-white/10 text-white/70"}`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Center
        </button>
        <button
          className={`px-3 py-1 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-indigo-600 text-white" : "bg-white/10 text-white/70"}`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Right
        </button>
        <button
          className={`px-3 py-1 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-indigo-600 text-white" : "bg-white/10 text-white/70"}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          className={`px-3 py-1 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-indigo-600 text-white" : "bg-white/10 text-white/70"}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none outline-none flex-1 min-h-[300px]"
      />
    </div>
  );
}
