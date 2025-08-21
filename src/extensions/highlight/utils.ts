import { SearchResult } from './types';
import { Node } from '@tiptap/pm/model';

/**
 * Search for text in the editor content
 */
export function searchText(
  content: string,
  searchTerm: string,
  options: {
    caseSensitive?: boolean;
    wholeWord?: boolean;
  } = {}
): SearchResult[] {
  if (!searchTerm.trim()) return [];

  const { caseSensitive = false, wholeWord = false } = options;
  const results: SearchResult[] = [];
  
  const searchContent = caseSensitive ? content : content.toLowerCase();
  let searchFor = caseSensitive ? searchTerm : searchTerm.toLowerCase();

  if (wholeWord) {
    searchFor = `\\b${escapeRegExp(searchFor)}\\b`;
  } else {
    searchFor = escapeRegExp(searchFor);
  }

  const regex = new RegExp(searchFor, 'g');
  let match;

  while ((match = regex.exec(searchContent)) !== null) {
    results.push({
      from: match.index,
      to: match.index + match[0].length,
      text: content.slice(match.index, match.index + match[0].length),
    });
  }

  return results;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find text ranges in ProseMirror document
 */
export function findTextRanges(
  doc: Node,
  searchTerm: string,
  options: {
    caseSensitive?: boolean;
    wholeWord?: boolean;
  } = {}
): SearchResult[] {
  const results: SearchResult[] = [];
  const textContent = doc.textContent;
  
  const searchResults = searchText(textContent, searchTerm, options);
  
  // Convert text positions to document positions
  let textPos = 0;
  
  doc.descendants((node: Node, pos: number) => {
    if (node.isText) {
      const nodeText = node.text || '';
      const nodeStart = textPos;
      const nodeEnd = textPos + nodeText.length;
      
      // Check if any search results fall within this text node
      searchResults.forEach(result => {
        if (result.from >= nodeStart && result.to <= nodeEnd) {
          const relativeFrom = result.from - nodeStart;
          const relativeTo = result.to - nodeStart;
          
          results.push({
            from: pos + relativeFrom,
            to: pos + relativeTo,
            text: result.text,
          });
        }
      });
      
      textPos += nodeText.length;
    }
    return true;
  });
  
  return results;
}

/**
 * Generate unique highlight ID
 */
export function generateHighlightId(): string {
  return `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Scroll element into view smoothly
 */
export function scrollToElement(element: Element, smooth = true): void {
  element.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'center',
    inline: 'nearest',
  });
}
