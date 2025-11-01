/**
 * Adds or updates a meta tag in the document head
 * @param {string} name - The name attribute of the meta tag
 * @param {string} content - The content attribute of the meta tag
 */
export function addMeta(name, content) {
  if (typeof document === "undefined") return;

  // Check if meta tag already exists
  let metaTag = document.querySelector(`meta[name="${name}"]`);

  if (metaTag) {
    // Update existing meta tag
    metaTag.setAttribute("content", content);
  } else {
    // Create new meta tag
    metaTag = document.createElement("meta");
    metaTag.setAttribute("name", name);
    metaTag.setAttribute("content", content);
    document.head.appendChild(metaTag);
  }
}

/**
 * Removes a meta tag from the document head
 * @param {string} name - The name attribute of the meta tag to remove
 */
export function removeMeta(name) {
  if (typeof document === "undefined") return;

  const metaTag = document.querySelector(`meta[name="${name}"]`);
  if (metaTag) {
    metaTag.remove();
  }
}

/**
 * Gets the content of a meta tag
 * @param {string} name - The name attribute of the meta tag
 * @returns {string|null} The content of the meta tag, or null if not found
 */
export function getMetaContent(name) {
  if (typeof document === "undefined") return null;

  const metaTag = document.querySelector(`meta[name="${name}"]`);
  return metaTag ? metaTag.getAttribute("content") : null;
}
