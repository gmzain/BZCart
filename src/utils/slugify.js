/**
 * Convert a name to URL-friendly slug format
 * Replaces spaces with hyphens and removes special characters like &
 */
export const toSlug = (name) => {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]/g, "") // Remove special characters (including &)
    .replace(/\-+/g, "-"); // Replace multiple hyphens with single hyphen
};

/**
 * Convert a slug back to the original name
 * Replaces hyphens with spaces
 */
export const fromSlug = (slug) => {
  if (!slug) return "";
  return String(slug).replace(/\-/g, " ");
};
