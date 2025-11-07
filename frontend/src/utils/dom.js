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
