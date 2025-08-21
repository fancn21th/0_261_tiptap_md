import { MarkProps, NodeProps } from "@tiptap/static-renderer";
import { MarkType } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";

const serializeChildrenToHTMLString = (children?: string | string[]): string =>
  ([] as string[])
    .concat(children || "")
    .filter(Boolean)
    .join("");
export const MarkMapping: Record<
  string,
  NoInfer<(ctx: MarkProps<MarkType, string | string[], Node>) => string>
> = {
  /* TODO @tiptap/static-renderer 参数bug  所以把默认的都copy过来了 */
  bold({ children }) {
    return `**${serializeChildrenToHTMLString(children)}**`;
  },
  italic({ children, node }) {
    let isBoldToo = false;

    // Check if the node being wrapped also has a bold mark, if so, we need to use the bold markdown syntax
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (node?.marks.some((m: any) => m.type.name === "bold")) {
      isBoldToo = true;
    }

    if (isBoldToo) {
      // If the content is bold, just wrap the bold content in italic markdown syntax with another set of asterisks
      return `*${serializeChildrenToHTMLString(children)}*`;
    }

    return `_${serializeChildrenToHTMLString(children)}_`;
  },
  code({ children }) {
    return `\`${serializeChildrenToHTMLString(children)}\``;
  },
  strike({ children }) {
    return `~~${serializeChildrenToHTMLString(children)}~~`;
  },
  underline({ children }) {
    return `<u>${serializeChildrenToHTMLString(children)}</u>`;
  },
  subscript({ children }) {
    return `<sub>${serializeChildrenToHTMLString(children)}</sub>`;
  },
  superscript({ children }) {
    return `<sup>${serializeChildrenToHTMLString(children)}</sup>`;
  },
  link({ node, children }) {
    return `[${serializeChildrenToHTMLString(children)}](${node.attrs.href})`;
  },
  highlight({ children }) {
    return `==${serializeChildrenToHTMLString(children)}==`;
  },
  askAI: ({ children }) => serializeChildrenToHTMLString(children),
};

export const NodeMapping: Record<
  string,
  NoInfer<(ctx: NodeProps<Node, string | string[]>) => string>
> = {
  /* TODO @tiptap/static-renderer 参数bug  所以把默认的都copy过来了 */
  bulletList({ children }) {
    return `\n${serializeChildrenToHTMLString(children)}`;
  },
  orderedList({ children }) {
    return `\n${serializeChildrenToHTMLString(children)}`;
  },
  listItem({ node, children, parent }) {
    if (parent?.type.name === "bulletList") {
      return `- ${serializeChildrenToHTMLString(children).trim()}\n`;
    }
    if (parent?.type.name === "orderedList") {
      let number = parent.attrs.start || 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parent.forEach((parentChild: any, _offset: any, index: any) => {
        if (node === parentChild) {
          number = index + 1;
        }
      });

      return `${number}. ${serializeChildrenToHTMLString(children).trim()}\n`;
    }

    return serializeChildrenToHTMLString(children);
  },
  paragraph({ children }) {
    return `\n${serializeChildrenToHTMLString(children)}\n`;
  },
  heading({ node, children }) {
    const level = node.attrs.level as number;

    return `${new Array(level)
      .fill("#")
      .join("")} ${serializeChildrenToHTMLString(children)}\n`;
  },
  codeBlock({ node, children }) {
    return `\n\`\`\`${node.attrs.language}\n${serializeChildrenToHTMLString(
      children
    )}\n\`\`\`\n`;
  },
  blockquote({ children }) {
    return `\n${serializeChildrenToHTMLString(children)
      .trim()
      .split("\n")
      .map((a) => `> ${a}`)
      .join("\n")}`;
  },
  image({ node }) {
    return `![${node.attrs.alt}](${node.attrs.src})`;
  },
  hardBreak() {
    return "\n";
  },
  horizontalRule() {
    return "\n---\n";
  },
  table({ children, node }) {
    if (!Array.isArray(children)) {
      return `\n${serializeChildrenToHTMLString(children)}\n`;
    }

    return `\n${serializeChildrenToHTMLString(children[0])}| ${new Array(
      node.childCount
    )
      .fill("---")
      .join(" | ")} |\n${serializeChildrenToHTMLString(children.slice(1))}\n`;
  },
  tableRow({ children }) {
    if (Array.isArray(children)) {
      return `| ${children.join(" | ")} |\n`;
    }
    return `${serializeChildrenToHTMLString(children)}\n`;
  },
  tableHeader({ children }) {
    return serializeChildrenToHTMLString(children).trim();
  },
  tableCell({ children }) {
    return serializeChildrenToHTMLString(children).trim();
  },
};
