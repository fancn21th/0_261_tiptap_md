import {
  MarkdownSerializer,
  defaultMarkdownSerializer,
} from "@tiptap/pm/markdown";

const Serializer = new MarkdownSerializer(
  {
    ...defaultMarkdownSerializer.nodes,
    codeBlock: defaultMarkdownSerializer.nodes.code_block,
    hr: defaultMarkdownSerializer.nodes.horizontal_rule,
    chart: (state, node) => {
      state.write("```echarts\n");
      state.write(JSON.stringify(node.attrs.options, null, 2) || "");
      state.write("\n```\n");
    },
    inlineMath: (state, node) => {
      state.write(`$${node.attrs.latex || ""}$`);
    },
    blockMath: (state, node) => {
      state.write(`$$\n${node.attrs.latex.trim() || ""}\n$$`);
      state.closeBlock(node); // 确保后面接的 block 有换行
    },
    // --- 表格 ---
    table: (state, node) => {
      // 收集所有行
      const rows: string[][] = [];
      node.content.forEach((rowNode) => {
        const row: string[] = [];
        rowNode.content.forEach((cellNode) => {
          const cellText = Serializer.serialize(cellNode);
          row.push(cellText.replace(/\|/g, "\\|")); // 转义竖线
        });
        rows.push(row);
      });

      if (rows.length === 0) return;

      // header 和 body
      const header = rows[0];
      const body = rows.slice(1);

      // 输出 Markdown 表头
      state.write("| " + header.join(" | ") + " |\n");
      state.write("| " + header.map(() => "---").join(" | ") + " |\n");

      // 输出表格内容
      body.forEach((row) => {
        state.write("| " + row.join(" | ") + " |\n");
      });

      state.write("\n");
    },
    tableRow: (state, node) => {
      return state.renderContent(node);
    },
    tableCell: (state, node) => {
      return state.renderContent(node);
    },
    tableHeader: (state, node) => {
      return state.renderContent(node);
    },
  },
  defaultMarkdownSerializer.marks,
  {
    strict: false,
  }
);
export default Serializer;
