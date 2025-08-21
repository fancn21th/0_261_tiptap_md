"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: `
      <h2>欢迎使用 Tiptap 编辑器!</h2>
      <p>这是一个基于 <strong>Tiptap v3</strong> 的富文本编辑器示例。</p>
      <p>您可以:</p>
      <ul>
        <li>使用 <strong>粗体</strong> 和 <em>斜体</em> 文本</li>
        <li>创建列表</li>
        <li>添加标题</li>
        <li>插入链接</li>
      </ul>
      <p>试试看编辑这段文本吧！</p>
    `,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* 工具栏 */}
        <div className="border-b border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("bold")
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              粗体
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("italic")
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              斜体
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("strike")
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              删除线
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              H3
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              • 列表
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              1. 列表
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              引用
            </button>
          </div>
        </div>

        {/* 编辑器内容 */}
        <div className="p-4 min-h-[300px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
