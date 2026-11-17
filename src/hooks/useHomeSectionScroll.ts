import { useEffect } from 'react';
import { currentPath, normalizeHomeSection } from '../config/routes';

// A full-page navigation can reach the fragment before React mounts its target.
// Wait for the Home DOM and fonts, then apply the existing sticky-navbar offset
// through scrollIntoView + the document's responsive scroll-padding-top.
export default function useHomeSectionScroll() {
  useEffect(() => {
    if (currentPath() || !window.location.hash) return;
    const initialHash = window.location.hash;
    let cancelled = false;
    let frame = 0;
    const positionSection = () => {
      if (cancelled || window.location.hash !== initialHash) return;
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        let id: string;
        try { id = decodeURIComponent(initialHash.slice(1)); } catch { return; }
        const normalizedId = normalizeHomeSection(id) ?? id;
        if (normalizedId !== id) {
          const normalizedHash = `#${encodeURIComponent(normalizedId)}`;
          if (window.location.hash !== normalizedHash) {
            history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}${normalizedHash}`);
          }
        }
        document.getElementById(normalizedId)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      });
    };
    if (document.fonts) void document.fonts.ready.then(positionSection);
    else positionSection();
    // Do not override a visitor who has already started navigating manually.
    const cancel = () => { cancelled = true; cancelAnimationFrame(frame); };
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });
    window.addEventListener('keydown', cancel, { once: true });
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, []);
}
