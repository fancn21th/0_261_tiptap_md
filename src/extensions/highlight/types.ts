export interface SearchResult {
  from: number;
  to: number;
  text: string;
}

export interface HighlightOptions {
  /**
   * Allow multiple highlight colors
   * @default false
   */
  multicolor: boolean;

  /**
   * HTML attributes to add to the highlight element.
   * @default {}
   */
  HTMLAttributes: Record<string, string | number | boolean>;

  /**
   * Default highlight color
   * @default '#ffeb3b'
   */
  defaultColor: string;

  /**
   * Whether search is case sensitive
   * @default false
   */
  caseSensitive: boolean;

  /**
   * Whether to match whole words only
   * @default false
   */
  wholeWord: boolean;

  /**
   * Whether to highlight only one result at a time
   * @default false
   */
  singleHighlightMode: boolean;

  /**
   * Whether to automatically clear highlights when editing
   * @default true
   */
  autoClearOnEdit: boolean;

  /**
   * Whether to preserve markdown highlight syntax (==text==)
   * @default false
   */
  preserveMarkdownHighlight: boolean;

  /**
   * Whether to use smooth scrolling to results
   * @default true
   */
  smoothScroll: boolean;
}

export interface HighlightStorage {
  searchResults: SearchResult[];
  currentResultIndex: number;
  highlightedRanges: Map<string, { from: number; to: number; color: string }>;
  lastSearchTerm: string;
  lastMarkdownResult?: string;
}
