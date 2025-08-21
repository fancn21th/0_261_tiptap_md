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

## 部署

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多部署选项。

## 了解更多

- [Next.js 文档](https://nextjs.org/docs)
- [Tiptap 文档](https://tiptap.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
