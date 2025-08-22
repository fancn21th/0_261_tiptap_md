"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { MarkdownExtension } from "@/extensions/markdown";
import { HighlightExtension } from "@/extensions/highlight";
import { TableKit } from "@tiptap/extension-table";
import { SearchResult } from "@/extensions/highlight/types";
import { useRef, useState, useEffect, useCallback } from "react";

const TiptapEditor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TableKit,
      Image.configure({ inline: true }),
      MarkdownExtension.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
      HighlightExtension.configure({
        defaultColor: "#ffeb3b",
        caseSensitive: false,
        wholeWord: false,
        singleHighlightMode: false,
        autoClearOnEdit: true,
        preserveMarkdownHighlight: true,
        smoothScroll: true,
      }),
    ],
    immediatelyRender: false,
    content: ``,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  // 搜索功能
  const handleSearch = () => {
    if (!editor || !searchText.trim()) return;

    // 更新扩展配置
    const highlightExt = editor.extensionManager.extensions.find(
      (ext) => ext.name === "highlight"
    );
    if (highlightExt) {
      highlightExt.options.caseSensitive = searchOptions.caseSensitive;
      highlightExt.options.wholeWord = searchOptions.wholeWord;
    }

    editor.commands.findText(searchText, (matches) => {
      setSearchResults(matches);
      setCurrentResultIndex(0);

      // 高亮所有结果
      matches.forEach((match, index) => {
        editor.commands.highlightRange(
          match.from,
          match.to,
          `search-result-${index}`,
          index === 0 ? "#ff9800" : "#ffeb3b" // 当前结果用不同颜色
        );
      });
    });
  };

  // 清除高亮
  const clearHighlights = useCallback(() => {
    if (!editor) return;
    editor.commands.clearAllHighlights();
    setSearchResults([]);
    setCurrentResultIndex(0);
  }, [editor]);

  // 导航到下一个结果
  const nextResult = useCallback(() => {
    if (searchResults.length === 0) return;

    const newIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(newIndex);

    // 重新高亮当前结果
    searchResults.forEach((match, index) => {
      editor?.commands.highlightRange(
        match.from,
        match.to,
        `search-result-${index}`,
        index === newIndex ? "#ff9800" : "#ffeb3b"
      );
    });
  }, [searchResults, currentResultIndex, editor]);

  // 导航到上一个结果
  const prevResult = useCallback(() => {
    if (searchResults.length === 0) return;

    const newIndex =
      currentResultIndex === 0
        ? searchResults.length - 1
        : currentResultIndex - 1;
    setCurrentResultIndex(newIndex);

    // 重新高亮当前结果
    searchResults.forEach((match, index) => {
      editor?.commands.highlightRange(
        match.from,
        match.to,
        `search-result-${index}`,
        index === newIndex ? "#ff9800" : "#ffeb3b"
      );
    });
  }, [searchResults, currentResultIndex, editor]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + F 打开搜索
      if ((event.ctrlKey || event.metaKey) && event.key === "f") {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder="搜索文本..."]'
        ) as HTMLInputElement;
        searchInput?.focus();
      }

      // F3 或 Enter 下一个结果
      if (event.key === "F3" && searchResults.length > 0) {
        event.preventDefault();
        nextResult();
      }

      // Shift + F3 上一个结果
      if (event.shiftKey && event.key === "F3") {
        event.preventDefault();
        prevResult();
      }

      // Escape 清除高亮
      if (event.key === "Escape") {
        clearHighlights();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchResults, nextResult, prevResult, clearHighlights]);

  // 导出为 Markdown - 使用插件方法
  const exportToMarkdown = () => {
    if (!editor) return;

    // 尝试获取带高亮的 Markdown
    editor.commands.getMarkdownWithHighlights();
    const markdownWithHighlights = editor.storage.highlight?.lastMarkdownResult;

    // 如果有高亮内容，优先使用带高亮的版本，否则使用普通版本
    const markdown =
      markdownWithHighlights || editor.storage.markdown.getMarkdown();

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
          <div className="flex flex-wrap gap-1 mb-2">
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
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive("highlight")
                  ? "bg-yellow-500 text-white"
                  : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
            >
              高亮
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

          {/* 搜索栏 */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="搜索文本..."
                className="px-3 py-1 border border-gray-300 dark:border-gray-500 rounded text-sm flex-1 max-w-xs dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
              >
                🔍 搜索
              </button>
              <button
                onClick={() => setShowSearchOptions(!showSearchOptions)}
                className="px-3 py-1 rounded text-sm font-medium bg-gray-500 text-white hover:bg-gray-600"
              >
                ⚙️ 选项
              </button>
              <button
                onClick={clearHighlights}
                className="px-3 py-1 rounded text-sm font-medium bg-gray-500 text-white hover:bg-gray-600"
              >
                清除高亮
              </button>
            </div>

            {/* 搜索结果导航 */}
            {searchResults.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {currentResultIndex + 1} / {searchResults.length}
                </span>
                <button
                  onClick={prevResult}
                  className="px-2 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                >
                  ↑ 上一个
                </button>
                <button
                  onClick={nextResult}
                  className="px-2 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                >
                  ↓ 下一个
                </button>
              </div>
            )}

            {/* 搜索选项 */}
            {showSearchOptions && (
              <div className="flex gap-4 p-2 bg-gray-100 dark:bg-gray-600 rounded">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={searchOptions.caseSensitive}
                    onChange={(e) =>
                      setSearchOptions((prev) => ({
                        ...prev,
                        caseSensitive: e.target.checked,
                      }))
                    }
                  />
                  区分大小写
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={searchOptions.wholeWord}
                    onChange={(e) =>
                      setSearchOptions((prev) => ({
                        ...prev,
                        wholeWord: e.target.checked,
                      }))
                    }
                  />
                  全词匹配
                </label>
              </div>
            )}
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
