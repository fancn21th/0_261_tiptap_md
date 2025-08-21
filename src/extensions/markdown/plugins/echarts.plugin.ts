import type MarkdownIt from "markdown-it";

const EchartsPlugin = (md: MarkdownIt) => {
  md.block.ruler.before(
    "fence",
    "chart_block",
    (state, startLine, endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      if (state.src.slice(start, start + 3) !== "```") return false;

      const params = state.src.slice(start + 3, max).trim();
      if (params !== "echarts") return false;

      if (silent) return true;

      let nextLine = startLine + 1;
      let content = "";

      while (nextLine < endLine) {
        const pos = state.bMarks[nextLine] + state.tShift[nextLine];
        const maxPos = state.eMarks[nextLine];
        const line = state.src.slice(pos, maxPos);

        if (line.startsWith("```")) break;
        content += line + "\n";
        nextLine++;
      }

      state.line = nextLine + 1;

      const token = state.push("echarts_block", "echarts", 0);
      token.block = true;
      token.attrs = [["options", JSON.parse(content)]];

      return true;
    }
  );
};
export default EchartsPlugin;
