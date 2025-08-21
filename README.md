# Next.js + Tiptap 富文本编辑器

这是一个基于 [Next.js 15](https://nextjs.org) 和 [Tiptap v3](https://tiptap.dev) 的富文本编辑器示例项目。

## 功能特性

- ✅ **Next.js 15** - 最新版本的 React 框架
- ✅ **Tiptap v3** - 现代化的富文本编辑器
- ✅ **TypeScript** - 类型安全的开发体验
- ✅ **Tailwind CSS 4** - 最新版本的 CSS 框架
- ✅ **SSR 支持** - 服务器端渲染优化

## 编辑器功能

- 📝 基本文本格式化（粗体、斜体、删除线）
- 📋 标题支持（H1, H2, H3）
- 📝 列表支持（有序列表、无序列表）
- 💬 引用块
- 🎨 响应式工具栏
- 📁 **Markdown 导入** - 支持导入 .md 文件
- 💾 **Markdown 导出** - 支持导出为 .md 文件

## 快速开始

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## Markdown 导入导出功能

### 测试导入功能
1. 项目根目录提供了一个 `example.md` 示例文件
2. 点击编辑器工具栏中的"📁 导入 MD"按钮
3. 选择 `example.md` 文件即可导入内容

### 测试导出功能
1. 在编辑器中输入或编辑内容
2. 点击工具栏中的"💾 导出 MD"按钮
3. 文件会自动下载到本地，文件名格式为：`tiptap-document-YYYY-MM-DD.md`

### 支持的 Markdown 格式
- 标题 (H1-H6)
- 粗体、斜体、删除线
- 有序列表和无序列表
- 引用块
- 内联代码（部分支持）

## 项目结构

```
src/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
└── components/
    └── TiptapEditor.tsx     # Tiptap 编辑器组件
```

## 技术栈

- **框架**: Next.js 15
- **编辑器**: Tiptap v3
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **包管理**: npm
- **Markdown 处理**:
  - `turndown` - HTML 转 Markdown
  - `markdown-it` - Markdown 转 HTML

## 部署

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多部署选项。

## 了解更多

- [Next.js 文档](https://nextjs.org/docs)
- [Tiptap 文档](https://tiptap.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
