import {
  defaultMarkdownParser,
  MarkdownParser,
  ParseSpec,
} from "@tiptap/pm/markdown";
import MarkdownIt from "markdown-it";
import { Schema } from "@tiptap/pm/model";
import EchartsPlugin from "../plugins/echarts.plugin";
import KatexPlugin from "../plugins/katex.plugin";
import TablePlugin from "../plugins/table.plugin";

const tokens: Record<string, ParseSpec> = {
  ...defaultMarkdownParser.tokens,
  bullet_list: { block: "bulletList" },
  ordered_list: {
    block: "orderedList",
    getAttrs: (tok) => ({ order: tok.attrGet("start") || 1 }),
  },
  list_item: { block: "listItem" },
  code_block: { block: "codeBlock", noCloseToken: true },
  fence: {
    block: "codeBlock",
    getAttrs: (tok) => ({ params: tok.info || "" }),
    noCloseToken: true,
  },
  hr: { node: "horizontalRule" },
  hardbreak: { node: "hardBreak" },
  // math_inline: {
  //   node: "inlineMath",
  //   getAttrs: (tok) => ({ latex: tok.attrGet("latex") }),
  // },
  // math_block: {
  //   block: "blockMath",
  //   getAttrs: (tok) => ({ latex: tok.attrGet("latex") }),
  //   noCloseToken: true,
  // },
  // echarts_block: {
  //   block: "chart",
  //   getAttrs: (tok) => ({
  //     options: tok.attrGet("options"),
  //   }),
  //   noCloseToken: true,
  // },
  // table: {
  //   block: "table",
  // },
  // thead: {
  //   ignore: true,
  // },
  // tbody: {
  //   ignore: true,
  // },
  // tr: {
  //   block: "tableRow",
  // },
  // td: {
  //   block: "tableCell",
  //   getAttrs: (tok) => ({
  //     colspan: parseInt(tok.attrGet("colspan") || "1", 10),
  //     rowspan: parseInt(tok.attrGet("rowspan") || "1", 10),
  //   }),
  // },
  // th: {
  //   block: "tableHeader",
  //   getAttrs: (tok) => ({
  //     colspan: parseInt(tok.attrGet("colspan") || "1", 10),
  //     rowspan: parseInt(tok.attrGet("rowspan") || "1", 10),
  //   }),
  // },

  strong: { mark: "bold" },
  em: { mark: "italic" },
};

const Parser = (schema: Schema) => {
  const md = MarkdownIt();
  md.use(EchartsPlugin);
  md.use(KatexPlugin);
  md.use(TablePlugin);
  return new MarkdownParser(schema, md, tokens);
};

export default Parser;
