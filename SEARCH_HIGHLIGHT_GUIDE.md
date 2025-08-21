# Tiptap 搜索和高亮功能实现

基于您现有的 Tiptap Markdown 编辑器，我已经成功实现了完整的搜索和高亮功能。

## 🚀 功能特性

### 1. 基础搜索功能
- **文本搜索**：实时搜索文档中的文本内容
- **结果高亮**：自动高亮所有匹配的搜索结果
- **结果计数**：显示找到的匹配项数量

### 2. 高级搜索选项
- **区分大小写**：可选择是否区分大小写搜索
- **全词匹配**：只匹配完整的单词
- **搜索选项面板**：可折叠的高级选项设置

### 3. 结果导航
- **下一个/上一个**：在搜索结果间快速导航
- **当前结果高亮**：当前查看的结果使用不同颜色突出显示
- **循环导航**：到达最后一个结果时自动回到第一个

### 4. 键盘快捷键
- `Ctrl/Cmd + F`：打开搜索框
- `F3`：跳转到下一个结果
- `Shift + F3`：跳转到上一个结果
- `Escape`：清除所有高亮

### 5. Markdown 集成
- **高亮保留**：导出 Markdown 时保留高亮标记（==文本==）
- **自动清除**：编辑时自动清除搜索高亮
- **手动高亮**：支持手动选择文本进行高亮标记

## 📁 文件结构

```
src/extensions/
├── highlight/
│   ├── highlight.extension.ts  # 核心高亮扩展
│   ├── types.ts                # 类型定义
│   ├── utils.ts                # 工具函数
│   └── index.ts                # 导出文件
├── markdown/
│   └── ...                     # 原有 Markdown 扩展
└── index.ts                    # 统一导出
```

## 🎯 使用方法

### 1. 基本搜索
1. 在编辑器工具栏的搜索框中输入要搜索的文本
2. 按回车键或点击"🔍 搜索"按钮
3. 所有匹配的文本将被高亮显示
4. 使用"上一个/下一个"按钮在结果间导航

### 2. 高级搜索
1. 点击"⚙️ 选项"按钮展开搜索选项
2. 勾选"区分大小写"进行精确匹配
3. 勾选"全词匹配"只匹配完整单词
4. 重新执行搜索应用新设置

### 3. 手动高亮
1. 选择要高亮的文本
2. 点击工具栏的"高亮"按钮
3. 或使用快捷键 `Cmd/Ctrl + Shift + H`

### 4. 导出带高亮的 Markdown
1. 使用搜索功能高亮文本
2. 点击"💾 导出 MD"按钮
3. 导出的文件将包含 `==高亮文本==` 格式

## 🛠 技术实现

### 核心架构
```typescript
// 扩展配置
HighlightExtension.configure({
  defaultColor: '#ffeb3b',        // 默认高亮颜色
  caseSensitive: false,           // 区分大小写
  wholeWord: false,               // 全词匹配
  singleHighlightMode: false,     // 单一高亮模式
  autoClearOnEdit: true,          // 编辑时自动清除
  preserveMarkdownHighlight: true, // 保留 MD 格式
  smoothScroll: true,             // 平滑滚动
})
```

### 搜索 API
```typescript
// 搜索文本
editor.commands.findText(searchTerm, (results) => {
  console.log(`找到 ${results.length} 个匹配项`);
});

// 高亮指定范围
editor.commands.highlightRange(from, to, id, color);

// 清除所有高亮
editor.commands.clearAllHighlights();

// 导航结果
editor.commands.nextSearchResult();
editor.commands.prevSearchResult();
```

## 🎨 样式自定义

高亮颜色可以通过配置自定义：
- 默认高亮：`#ffeb3b`（黄色）
- 当前结果：`#ff9800`（橙色）
- 可配置任意颜色值

## 🔧 扩展性

该实现具有良好的扩展性：
1. **插件化设计**：每个功能模块独立
2. **事件驱动**：支持回调函数处理搜索结果
3. **配置灵活**：所有选项都可配置
4. **类型安全**：完整的 TypeScript 支持

## 🚦 使用示例

```typescript
const editor = useEditor({
  extensions: [
    StarterKit,
    MarkdownExtension.configure({
      transformPastedText: true,
      transformCopiedText: true,
    }),
    HighlightExtension.configure({
      defaultColor: '#ffeb3b',
      preserveMarkdownHighlight: true,
    }),
  ],
});

// 搜索功能
const handleSearch = (searchText: string) => {
  editor.commands.findText(searchText, (results) => {
    results.forEach((match, index) => {
      editor.commands.highlightRange(
        match.from,
        match.to,
        `search-${index}`,
        index === 0 ? '#ff9800' : '#ffeb3b'
      );
    });
  });
};
```

## 🎉 总结

这个实现为您的 Tiptap Markdown 编辑器提供了专业级的搜索和高亮功能，具有以下优势：

1. **用户友好**：直观的搜索界面和快捷键支持
2. **功能完整**：从基础搜索到高级选项一应俱全
3. **性能优化**：高效的文本搜索和高亮算法
4. **集成良好**：与现有 Markdown 扩展无缝集成
5. **扩展性强**：易于定制和扩展新功能

您现在可以在浏览器中访问 http://localhost:3000 来测试所有功能！
