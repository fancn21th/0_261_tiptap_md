import Image from "next/image";
import TiptapEditor from "@/components/TiptapEditor";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            className="dark:invert mx-auto mb-8"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold mb-4">Next.js + Tiptap 编辑器</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            基于 Next.js 15 和 Tiptap v3 的富文本编辑器示例
          </p>
        </div>

        {/* Tiptap Editor */}
        <div className="mb-12">
          <TiptapEditor />
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">编辑功能</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• 使用工具栏按钮来格式化文本</li>
                <li>• 支持粗体、斜体、删除线等基本格式</li>
                <li>• 可以创建不同级别的标题 (H1, H2, H3)</li>
                <li>• 支持无序列表、有序列表和引用块</li>
                <li>• 直接在编辑器中输入文本即可开始编辑</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">导入导出功能</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  • 📁 <strong>导入 MD</strong>：点击按钮选择 .md 文件导入
                </li>
                <li>
                  • 💾 <strong>导出 MD</strong>：将当前内容导出为 Markdown 文件
                </li>
                <li>• 支持标准 Markdown 格式</li>
                <li>• 可以导入项目根目录的 example.md 文件进行测试</li>
                <li>• 导出的文件会自动下载到本地</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 flex-wrap justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm text-gray-600 dark:text-gray-400"
            href="https://tiptap.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            📝 Tiptap 文档
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm text-gray-600 dark:text-gray-400"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 Next.js 文档
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm text-gray-600 dark:text-gray-400"
            href="https://github.com/ueberdosis/tiptap"
            target="_blank"
            rel="noopener noreferrer"
          >
            🐙 GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
