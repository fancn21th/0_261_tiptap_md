import { Content, Extension, extensions } from "@tiptap/core";
import { ParseOptions, Fragment, Node } from "@tiptap/pm/model";
import MarkdownClipboard from "./extensions/clipboard";
import { MarkdownParser, MarkdownSerializer } from "@tiptap/pm/markdown";
import Parser from "./parser";
import Serializer from "./serializer";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    markdown: {
      setContent: (
        /**
         * The new content.
         */
        content: Content | Fragment | Node,
        /**
         * Options for `setContent`.
         */
        options?: {
          /**
           * Options for parsing the content.
           * @default {}
           */
          parseOptions?: ParseOptions;
          /**
           * Whether to throw an error if the content is invalid.
           */
          errorOnInvalidContent?: boolean;
          /**
           * Whether to emit an update event.
           * @default true
           */
          emitUpdate?: boolean;
        }
      ) => ReturnType;
    };
  }
  interface Storage {
    markdown: MarkdownStorage;
  }
}
interface MarkdownStorage {
  parser: MarkdownParser;
  serializer: MarkdownSerializer;
  getMarkdown: () => string;
  getSelectedMarkdown: () => string;
}
interface MarkdownExtensionOptions {
  html?: boolean;
  tightLists?: boolean;
  tightListClass?: string;
  bulletListMarker?: string;
  linkify?: boolean;
  breaks?: boolean;
  transformPastedText?: boolean;
  transformCopiedText?: boolean;
}
const MarkdownExtension = Extension.create<
  MarkdownExtensionOptions,
  MarkdownStorage
>({
  name: "markdown",
  addOptions() {
    return {
      html: true,
      tightLists: true,
      tightListClass: "tight",
      bulletListMarker: "-",
      linkify: false,
      breaks: true,
      transformPastedText: true,
      transformCopiedText: true,
    };
  },
  addCommands() {
    // @ts-expect-error - extensions.Commands.config may not have addCommands
    const commands = extensions.Commands.config.addCommands?.();
    return {
      setContent: (content, options) => (props) => {
        if (typeof content === "string") {
          const node = this.storage?.parser.parse(content);
          return commands?.setContent?.(node, options)(props) ?? false;
        }
        return commands?.setContent?.(content, options)(props) ?? false;
      },
      insertContentAt: (range, content, options) => (props) => {
        if (typeof content === "string") {
          return (
            commands?.insertContentAt?.(
              range,
              this.storage.parser.parse(content, {
                inline: true,
              }),
              options
            )(props) ?? false
          );
        }
        return (
          commands?.insertContentAt?.(range, content, options)(props) ?? false
        );
      },
    };
  },
  onBeforeCreate({ editor }) {
    if (!this.storage.parser) {
      this.storage.parser = Parser(editor.schema);
    }
    if (!this.storage.serializer) {
      this.storage.serializer = Serializer;
    }
    // this.storage.parser = new MarkdownParser(editor.schema, this.options)

    // 动态创建高亮映射，根据高亮扩展的配置决定是否保留等号标记
    // const createDynamicMarkMapping = () => {
    //   const highlightExtension = editor.extensionManager.extensions.find(ext => ext.name === 'highlight')
    //   const preserveMarkdownHighlight = highlightExtension?.options?.preserveMarkdownHighlight ?? false
    //
    //   return {
    //      ...MarkMapping,
    //      highlight: preserveMarkdownHighlight
    //        ? MarkMapping.highlight // 使用原始的带等号的映射
    //        : ({ children }: { children?: string | string[] }) => {
    //            if (Array.isArray(children)) {
    //              return children.join('')
    //            }
    //            return children || ''
    //          }
    //    }
    // }

    // this.storage.serializer = (node: Node) =>
    //   renderToMarkdown({
    //     extensions: editor.extensionManager.extensions,
    //     content: node,
    //     options: {
    //       markMapping: createDynamicMarkMapping(),
    //       nodeMapping: NodeMapping,
    //     },
    //   })
    this.storage.getMarkdown = () =>
      this.storage.serializer.serialize(editor.state.doc);
    this.storage.getSelectedMarkdown = () => {
      const { state } = editor;
      const { from, to } = state.selection;
      const slice = state.doc.cut(from, to);
      return this.storage.serializer.serialize(slice);
    };
  },
  addExtensions() {
    return [
      MarkdownClipboard.configure({
        transformPastedText: this.options.transformPastedText,
        transformCopiedText: this.options.transformCopiedText,
      }),
    ];
  },
});
export default MarkdownExtension;
