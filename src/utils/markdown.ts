/**
 * Markdown processing utility for converting Markdown strings to HTML
 *
 * Uses the unified/remark/rehype pipeline for server-side Markdown processing.
 * Supports GitHub Flavored Markdown (tables, strikethrough, task lists, etc.)
 *
 * @module utils/markdown
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

// Raw HTML is allowed in editor markdown for occasional inline tags, but
// rehype-sanitize strips <script>, event handlers, and javascript: URLs.
// defaultSchema mirrors GitHub's allowlist (inline formatting, links, lists,
// code, GFM tables); extending it here would require an explicit decision.
const sanitizeSchema = defaultSchema;

/**
 * Converts a Markdown string to HTML
 *
 * @param markdown - The Markdown string to convert
 * @returns Promise resolving to HTML string
 *
 * @example
 * ```typescript
 * const html = await markdownToHtml('**bold** text');
 * // Returns: '<p><strong>bold</strong> text</p>'
 * ```
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeStringify)
      .process(markdown);

    return String(result);
  } catch (error) {
    console.error('Error processing Markdown:', error);
    // Return original text wrapped in paragraph on error
    return `<p>${markdown}</p>`;
  }
}
