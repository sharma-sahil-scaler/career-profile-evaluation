export function addMeta(name, content) {
  if (typeof document === 'undefined') return;

  let metaTag = document.querySelector(`meta[name="${name}"]`);

  if (metaTag) {
    metaTag.setAttribute('content', content);
  } else {
    // Create new meta tag
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', name);
    metaTag.setAttribute('content', content);
    document.head.appendChild(metaTag);
  }
}

export function removeMeta(name) {
  if (typeof document === 'undefined') return;

  const metaTag = document.querySelector(`meta[name="${name}"]`);
  if (metaTag) {
    metaTag.remove();
  }
}

export function getMetaContent(name) {
  if (typeof document === 'undefined') return null;

  const metaTag = document.querySelector(`meta[name="${name}"]`);
  return metaTag ? metaTag.getAttribute('content') : null;
}
