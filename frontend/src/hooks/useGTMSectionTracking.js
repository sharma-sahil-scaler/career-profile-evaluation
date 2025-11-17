import { useEffect, useRef } from 'react';
import tracker from '../utils/tracker';

/**
 * Hook to track section views using IntersectionObserver
 *
 * Observes all elements with class 'gtm-section-view' and tracks when they become visible
 * Uses data-gtm-section-name attribute to identify the section
 *
 * Usage:
 * 1. Add this hook at the parent level (e.g., App.js or AppContent)
 * 2. Add class 'gtm-section-view' to sections you want to track
 * 3. Add data-gtm-section-name attribute with the section name
 *
 * Example:
 * <div className="gtm-section-view" data-gtm-section-name="Career Timeline">
 *   ... section content ...
 * </div>
 */
const useGTMSectionTracking = () => {
  const observerRef = useRef(null);
  const trackedSectionsRef = useRef(new Set());

  useEffect(() => {
    const trackedSections = trackedSectionsRef.current;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-gtm-section-name');

          if (sectionName && !trackedSections.has(sectionName)) {
            tracker.sectionView({
              section_name: sectionName
            });

            trackedSections.add(sectionName);

            if (observerRef.current) {
              observerRef.current.unobserve(entry.target);
            }
          }
        }
      });
    };

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    const observeElements = () => {
      const elements = document.querySelectorAll('.gtm-section-view');
      elements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('gtm-section-view')) {
              if (observerRef.current) {
                observerRef.current.observe(node);
              }
            }
            if (node.querySelectorAll) {
              const children = node.querySelectorAll('.gtm-section-view');
              children.forEach((child) => {
                if (observerRef.current) {
                  observerRef.current.observe(child);
                }
              });
            }
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, []);

  return null;
};

export default useGTMSectionTracking;
