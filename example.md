# Tiptap 编辑器专业版示例文档

这是一个 **Markdown** 示例文档，用于测试 Tiptap 编辑器的**专业插件系统**。

## 功能特性

### 文本格式

- **粗体文本**
- *斜体文本*
- ~~删除线文本~~

### 列表功能

#### 无序列表
- 第一项
- 第二项
  - 子项目 1
  - 子项目 2
- 第三项

#### 有序列表
1. 第一步
2. 第二步
3. 第三步

### 引用块

> 这是一个引用块的示例。
>
> 现在使用的是**专业插件系统**，直接在 Tiptap 节点和 Markdown 之间转换，无需 HTML 中介。

### 代码

这是一个 `内联代码` 示例。

```javascript
// 代码块示例
function hello() {
  console.log("Hello, Tiptap Markdown Plugin!");
}
```

### 数学公式（KaTeX 支持）

内联数学公式：$E = mc^2$

块级数学公式：
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

### 表格功能

| 功能 | 旧方案 | 新插件方案 |
|------|--------|------------|
| 转换方式 | Markdown ↔ HTML ↔ Tiptap | Markdown ↔ Tiptap (直接) |
| 数据完整性 | 可能丢失 | 完全保持 |
| 扩展性 | 有限 | 强大 |
| 性能 | 一般 | 优秀 |

### 图表支持（ECharts）

```echarts
{
  "title": {
    "text": "示例图表"
  },
  "xAxis": {
    "type": "category",
    "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [{
    "data": [120, 200, 150, 80, 70, 110, 130],
    "type": "bar"
  }]
}
```

## 总结

这个示例展示了 Tiptap 编辑器专业插件系统支持的各种 Markdown 格式。插件系统的优势：

1. **直接转换** - 无 HTML 中介层
2. **原生集成** - 作为 Tiptap Extension
3. **扩展功能** - 数学公式、图表、表格
4. **实时处理** - 粘贴时自动转换
5. **数据完整性** - 精确的节点映射

**祝您使用愉快！** 🎉

---

*Powered by Tiptap v3 + Professional Markdown Extension*
