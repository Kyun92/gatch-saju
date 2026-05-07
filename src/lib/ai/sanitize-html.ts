import sanitizeHtml from "sanitize-html";

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
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ["class", "id", "aria-*"],
    },
  });
}
