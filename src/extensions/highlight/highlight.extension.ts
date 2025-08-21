import { Mark, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core';
import { HighlightOptions, HighlightStorage, SearchResult } from './types';
import { findTextRanges, generateHighlightId, scrollToElement } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlight: {
      /**
       * Set a highlight mark
       */
      setHighlight: (attributes?: { color?: string }) => ReturnType;
      /**
       * Toggle a highlight mark
       */
      toggleHighlight: (attributes?: { color?: string }) => ReturnType;
      /**
       * Unset a highlight mark
       */
      unsetHighlight: () => ReturnType;
      /**
       * Find text in the document and execute callback with results
       */
      findText: (
        searchTerm: string,
        callback?: (results: SearchResult[]) => void
      ) => ReturnType;
      /**
       * Highlight a specific range of text
       */
      highlightRange: (
        from: number,
        to: number,
        id?: string,
        color?: string
      ) => ReturnType;
      /**
       * Clear all highlights
       */
      clearAllHighlights: () => ReturnType;
      /**
       * Navigate to next search result
       */
      nextSearchResult: () => ReturnType;
      /**
       * Navigate to previous search result
       */
      prevSearchResult: () => ReturnType;
      /**
       * Get markdown with highlights preserved
       */
      getMarkdownWithHighlights: () => ReturnType;
    };
  }

  interface Storage {
    highlight: HighlightStorage;
  }
}

/**
 * Matches a highlight to a ==highlight== on input.
 */
export const inputRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))$/;

/**
 * Matches a highlight to a ==highlight== on paste.
 */
export const pasteRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))/g;

/**
 * Enhanced Highlight extension with search functionality
 */
export const HighlightExtension = Mark.create<HighlightOptions, HighlightStorage>({
  name: 'highlight',

  addOptions() {
    return {
      multicolor: true,
      HTMLAttributes: {},
      defaultColor: '#ffeb3b',
      caseSensitive: false,
      wholeWord: false,
      singleHighlightMode: false,
      autoClearOnEdit: true,
      preserveMarkdownHighlight: false,
      smoothScroll: true,
    };
  },

  addStorage() {
    return {
      searchResults: [],
      currentResultIndex: 0,
      highlightedRanges: new Map(),
      lastSearchTerm: '',
      lastMarkdownResult: undefined,
    };
  },

  addAttributes() {
    return {
      color: {
        default: this.options.defaultColor,
        parseHTML: element => 
          element.getAttribute('data-color') || 
          element.style.backgroundColor ||
          this.options.defaultColor,
        renderHTML: attributes => {
          if (!attributes.color) {
            return {};
          }

          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color}; color: inherit`,
          };
        },
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-highlight-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-highlight-id': attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            color: attributes.color || this.options.defaultColor,
            id: generateHighlightId(),
          });
        },

      toggleHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, {
            color: attributes.color || this.options.defaultColor,
            id: generateHighlightId(),
          });
        },

      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },

      findText:
        (searchTerm: string, callback?: (results: SearchResult[]) => void) =>
        ({ state }) => {
          const results = findTextRanges(state.doc, searchTerm, {
            caseSensitive: this.options.caseSensitive,
            wholeWord: this.options.wholeWord,
          });

          this.storage.searchResults = results;
          this.storage.lastSearchTerm = searchTerm;
          this.storage.currentResultIndex = 0;

          if (callback) {
            callback(results);
          }

          return true;
        },

      highlightRange:
        (from: number, to: number, id?: string, color?: string) =>
        ({ tr, state }) => {
          const highlightId = id || generateHighlightId();
          const highlightColor = color || this.options.defaultColor;

          // Clear existing highlight if in single highlight mode
          if (this.options.singleHighlightMode) {
            // Remove all existing highlight marks
            tr.removeMark(0, state.doc.content.size, this.type);
            this.storage.highlightedRanges.clear();
          }

          // Store the highlight range
          this.storage.highlightedRanges.set(highlightId, {
            from,
            to,
            color: highlightColor,
          });

          // Apply the highlight
          tr.addMark(from, to, this.type.create({
            color: highlightColor,
            id: highlightId,
          }));
          
          return true;
        },

      clearAllHighlights:
        () =>
        ({ tr, state }) => {
          // Create a new transaction to remove all highlights
          const newTr = tr;
          
          // Remove all highlight marks from the document
          newTr.removeMark(0, state.doc.content.size, this.type);
          
          // Clear storage
          this.storage.highlightedRanges.clear();
          this.storage.searchResults = [];
          this.storage.currentResultIndex = 0;
          this.storage.lastSearchTerm = '';

          return true;
        },

      nextSearchResult:
        () =>
        ({ editor }) => {
          const { searchResults, currentResultIndex } = this.storage;
          if (searchResults.length === 0) return false;

          const newIndex = (currentResultIndex + 1) % searchResults.length;
          this.storage.currentResultIndex = newIndex;

          const result = searchResults[newIndex];
          if (result) {
            // Focus on the result
            editor.commands.focus();
            editor.commands.setTextSelection(result.from);

            // Scroll to the result
            setTimeout(() => {
              const selection = editor.view.dom.querySelector('[data-highlight-id]');
              if (selection && this.options.smoothScroll) {
                scrollToElement(selection, true);
              }
            }, 10);
          }

          return true;
        },

      prevSearchResult:
        () =>
        ({ editor }) => {
          const { searchResults, currentResultIndex } = this.storage;
          if (searchResults.length === 0) return false;

          const newIndex = currentResultIndex === 0 
            ? searchResults.length - 1 
            : currentResultIndex - 1;
          this.storage.currentResultIndex = newIndex;

          const result = searchResults[newIndex];
          if (result) {
            // Focus on the result
            editor.commands.focus();
            editor.commands.setTextSelection(result.from);

            // Scroll to the result
            setTimeout(() => {
              const selection = editor.view.dom.querySelector('[data-highlight-id]');
              if (selection && this.options.smoothScroll) {
                scrollToElement(selection, true);
              }
            }, 10);
          }

          return true;
        },

      getMarkdownWithHighlights:
        () =>
        ({ editor }) => {
          if (!this.options.preserveMarkdownHighlight) {
            return false;
          }

          // Get the markdown serializer from markdown extension
          const markdownStorage = editor.storage.markdown;
          if (!markdownStorage?.serializer) {
            return false;
          }

          // Get current document content
          let markdown = markdownStorage.getMarkdown();

          // Replace highlights with markdown syntax
          this.storage.highlightedRanges.forEach((range) => {
            const text = editor.state.doc.textBetween(range.from, range.to);
            // This is a simplified approach - in production you'd want more sophisticated logic
            markdown = markdown.replace(text, `==${text}==`);
          });

          this.storage.lastMarkdownResult = markdown;
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.toggleHighlight(),
      'Mod-f': () => {
        // Trigger search (this would be handled by the UI component)
        return false;
      },
      'F3': () => this.editor.commands.nextSearchResult(),
      'Shift-F3': () => this.editor.commands.prevSearchResult(),
      'Escape': () => this.editor.commands.clearAllHighlights(),
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: () => ({
          color: this.options.defaultColor,
          id: generateHighlightId(),
        }),
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
        getAttributes: () => ({
          color: this.options.defaultColor,
          id: generateHighlightId(),
        }),
      }),
    ];
  },

  onCreate() {
    // Initialize storage
    this.storage.searchResults = [];
    this.storage.currentResultIndex = 0;
    this.storage.highlightedRanges = new Map();
    this.storage.lastSearchTerm = '';
  },

  onUpdate() {
    // Auto-clear highlights on edit if enabled
    if (this.options.autoClearOnEdit && this.storage.highlightedRanges.size > 0) {
      // Clear search highlights but keep manual highlights
      // This is a simplified implementation
      const searchHighlights = Array.from(this.storage.highlightedRanges.entries())
        .filter(([id]) => id.startsWith('search-'));
      
      searchHighlights.forEach(([id]) => {
        this.storage.highlightedRanges.delete(id);
      });
    }
  },
});

export default HighlightExtension;
