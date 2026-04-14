import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "section",
  "h2",
  "h3",
  "h4",
  "p",
  "div",
  "span",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "em",
  "br",
];

export function sanitizeReadingHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["class", "id"],
    ALLOW_ARIA_ATTR: true,
  });
}
