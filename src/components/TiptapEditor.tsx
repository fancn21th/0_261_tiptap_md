"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MarkdownExtension } from "@/extensions/markdown";
import { useRef } from "react";

const TiptapEditor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      MarkdownExtension.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
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

  // 导出为 Markdown - 使用插件方法
  const exportToMarkdown = () => {
    if (!editor) return;

    const markdown = editor.storage.markdown.getMarkdown();

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tiptap-document-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导入 Markdown 文件 - 使用插件方法
  const importFromMarkdown = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择 - 使用插件方法
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const markdown = e.target?.result as string;
      // 使用插件的 setContent 方法直接设置 Markdown 内容
      editor.commands.setContent(markdown);
    };
    reader.readAsText(file);

    // 重置文件输入
    event.target.value = "";
  };

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
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <button
              onClick={importFromMarkdown}
              className="px-3 py-1 rounded text-sm font-medium transition-colors bg-green-500 text-white hover:bg-green-600"
            >
              📁 导入 MD
            </button>
            <button
              onClick={exportToMarkdown}
              className="px-3 py-1 rounded text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
            >
              💾 导出 MD
            </button>
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileImport}
          style={{ display: "none" }}
        />

        {/* 编辑器内容 */}
        <div className="p-4 min-h-[300px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
