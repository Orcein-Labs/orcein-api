/**
 * Orcein Context Digest Engine
 * High-performance edge HTML-to-Markdown extractor and token minifier.
 */

export interface DigestOptions {
  maxTokens?: number;
  includeImages?: boolean;
  preserveLinks?: boolean;
}

export interface DigestResult {
  title: string;
  markdown: string;
  metadata: {
    originalBytes: number;
    digestBytes: number;
    compressionPercent: number;
    estimatedTokens: number;
    tokensSaved: number;
  };
}

/**
 * Fast BPE token count estimator (~3.8 characters per token for English text/code)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 3.8);
}

/**
 * Extract clean title from HTML
 */
export function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }
  return 'Untitled Page';
}

/**
 * Core HTML to Token-Minified Markdown Extractor
 */
export function extractMarkdown(rawHtml: string, options: DigestOptions = {}): DigestResult {
  if (!rawHtml || rawHtml.trim().length === 0) {
    return {
      title: "",
      markdown: "",
      metadata: {
        originalBytes: 0,
        digestBytes: 0,
        compressionPercent: 0,
        estimatedTokens: 0,
        tokensSaved: 0
      }
    };
  }

  const originalBytes = rawHtml.length;
  const title = extractTitle(rawHtml);

  // 1. Remove non-content tags and heavy noise
  let cleaned = rawHtml
    // Remove DOCTYPE, comments
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    // Remove script, style, noscript, svg, canvas, iframe, form
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<canvas\b[\s\S]*?<\/canvas>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/<form\b[\s\S]*?<\/form>/gi, '')
    .replace(/<button\b[\s\S]*?<\/button>/gi, '')
    // Remove navigation, header, footer, aside, ads
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, '')
    .replace(/<header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, '')
    // Remove aria-hidden elements
    .replace(/<[^>]+aria-hidden=["']true["'][\s\S]*?<\/[^>]+>/gi, '');

  // Strip <head> completely now that title is extracted
  cleaned = cleaned.replace(/<head\b[\s\S]*?<\/head>/gi, '');

  // 2. Extract code blocks first to protect formatting
  const codeBlocks: string[] = [];
  cleaned = cleaned.replace(/<pre[^>]*><code(?: class=["'](?:language-)?([a-zA-Z0-9_-]+)["'])?[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => {
    const unescaped = decodeHtmlEntities(code);
    const token = `__ORCEIN_CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`\n\`\`\`${lang || ''}\n${unescaped.trim()}\n\`\`\`\n`);
    return token;
  });

  // Standalone pre tags
  cleaned = cleaned.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
    const unescaped = decodeHtmlEntities(code.replace(/<[^>]+>/g, ''));
    const token = `__ORCEIN_CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`\n\`\`\`\n${unescaped.trim()}\n\`\`\`\n`);
    return token;
  });

  // Standalone inline code
  const inlineCodes: string[] = [];
  cleaned = cleaned.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => {
    const unescaped = decodeHtmlEntities(code.replace(/<[^>]+>/g, ''));
    const token = `__ORCEIN_INLINE_CODE_${inlineCodes.length}__`;
    inlineCodes.push(`\`${unescaped.trim()}\``);
    return token;
  });

  // 3. Convert Tables to GFM Markdown
  cleaned = cleaned.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableContent) => {
    return formatMarkdownTable(tableContent);
  });

  // 4. Convert Structural Elements
  cleaned = cleaned
    // Headings
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n')
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n\n##### $1\n\n')
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n\n###### $1\n\n')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
      const text = content.replace(/<[^>]+>/g, '').trim();
      return `\n\n> ${text.replace(/\n/g, '\n> ')}\n\n`;
    })
    // List Items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n* $1')
    .replace(/<\/(ul|ol)>/gi, '\n\n')
    // Paragraphs and breaks
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // Links
  if (options.preserveLinks !== false) {
    cleaned = cleaned.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      if (!cleanText || href.startsWith('javascript:') || href === '#') return cleanText;
      return `[${cleanText}](${href})`;
    });
  } else {
    cleaned = cleaned.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  }

  // Bold & Italic (using word boundaries so <button>, <iframe>, <input> don't falsely match)
  cleaned = cleaned
    .replace(/<(?:strong\b|b\b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**')
    .replace(/<(?:em\b|i\b)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*');

  // 5. Strip all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // 6. Restore code blocks and inline code
  codeBlocks.forEach((code, idx) => {
    cleaned = cleaned.replace(`__ORCEIN_CODE_BLOCK_${idx}__`, code);
  });
  inlineCodes.forEach((code, idx) => {
    cleaned = cleaned.replace(`__ORCEIN_INLINE_CODE_${idx}__`, code);
  });

  // 7. Decode HTML entities
  cleaned = decodeHtmlEntities(cleaned);

  // 8. Minify whitespace: collapse consecutive blank lines and trim lines
  let minified = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter((line, i, arr) => line.length > 0 || (i > 0 && (arr[i - 1]?.length ?? 0) > 0))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Prepend title if not already first heading
  if (title && !minified.startsWith('# ')) {
    minified = `# ${title}\n\n${minified}`;
  }

  // 9. Handle max_tokens budgeting if requested
  if (options.maxTokens && options.maxTokens > 0) {
    const notice = `\n\n[... Truncated at budget: ${options.maxTokens} tokens ...]`;
    const noticeChars = notice.length;
    const maxChars = Math.max(50, Math.floor(options.maxTokens * 3.8) - noticeChars);
    
    if (minified.length > maxChars) {
      const boundaryIndex = minified.lastIndexOf('\n\n', maxChars);
      const cutPoint = boundaryIndex > maxChars * 0.6 ? boundaryIndex : maxChars;
      minified = minified.substring(0, cutPoint).trim() + notice;
    }
  }

  const digestBytes = minified.length;
  const compressionPercent = originalBytes > 0 
    ? Math.round((1 - digestBytes / originalBytes) * 100 * 10) / 10 
    : 0;
  
  const estimatedTokens = estimateTokens(minified);
  const rawTokens = estimateTokens(rawHtml);
  const tokensSaved = Math.max(0, rawTokens - estimatedTokens);

  return {
    title,
    markdown: minified,
    metadata: {
      originalBytes,
      digestBytes,
      compressionPercent,
      estimatedTokens,
      tokensSaved
    }
  };
}

/**
 * Converts HTML table to GFM Markdown table
 */
function formatMarkdownTable(tableHtml: string): string {
  const rows: string[][] = [];
  const rowMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  if (!rowMatches || rowMatches.length === 0) return '';

  for (const rowHtml of rowMatches) {
    const cells: string[] = [];
    const cellMatches = rowHtml.match(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi);
    if (cellMatches) {
      for (const cell of cellMatches) {
        const text = cell.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        cells.push(text);
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
  }

  if (rows.length === 0) return '';

  const maxCols = Math.max(...rows.map(r => r.length));
  if (maxCols === 0) return '';

  const normalizedRows = rows.map(r => {
    const row = [...r];
    while (row.length < maxCols) row.push('');
    return row;
  });

  const header = normalizedRows[0];
  if (!header) return '';
  const delimiter = new Array(maxCols).fill('---');
  const dataRows = normalizedRows.slice(1);

  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${delimiter.join(' | ')} |`,
    ...dataRows.map(r => `| ${r.join(' | ')} |`)
  ];

  return `\n\n${lines.join('\n')}\n\n`;
}

/**
 * Decode basic HTML entities
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}
