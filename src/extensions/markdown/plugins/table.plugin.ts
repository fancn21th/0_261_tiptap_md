import MarkdownIt from "markdown-it";

const TablePlugin = (md: MarkdownIt) => {
  md.core.ruler.push("wrap_table_cell", (state) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];

      if (tok.type === "th_open" || tok.type === "td_open") {
        // 找到对应的 inline token
        const nextToken = tokens[i + 1];
        if (nextToken && nextToken.type === "inline") {
          // 包装成 paragraph
          const paragraphOpen = new state.Token(
            "paragraph_open",
            "paragraph",
            1
          );
          const paragraphClose = new state.Token(
            "paragraph_close",
            "paragraph",
            -1
          );

          // 插入 paragraph_open
          tokens.splice(i + 1, 0, paragraphOpen);
          // 插入 paragraph_close，放到 inline token 后
          tokens.splice(i + 3, 0, paragraphClose);

          // 跳过新插入的 token
          i += 2;
        }
      }
    }
  });
};
export default TablePlugin;
