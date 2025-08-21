import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Slice } from "@tiptap/pm/model";

const MarkdownClipboard = Extension.create({
  name: "markdownClipboard",
  addOptions() {
    return {
      transformPastedText: false,
      transformCopiedText: false,
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownClipboard"),
        props: {
          handlePaste: (view, event) => {
            if (!this.options.transformPastedText) return false;
            const text = event.clipboardData?.getData("text/plain");

            if (!text) return false;

            const parsed = this.editor.storage.markdown.parser.parse(text, {
              inline: true,
            });
            if (!parsed) return false;
            const tr = view.state.tr.replaceSelection(
              new Slice(parsed.content, 0, 0)
            );
            view.dispatch(tr);

            return true;
          },
          //@ts-expect-error - clipboardTextSerializer type mismatch
          clipboardTextSerializer: (slice) => {
            if (!this.options.transformCopiedText) {
              return null;
            }
            return this.editor.storage.markdown.serializer.serialize(
              this.editor.schema.node("doc", null, slice.content)
            );
          },
        },
      }),
    ];
  },
});

export default MarkdownClipboard;
