import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';

export default function useHeroDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });
  const allowed = () => matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    point.current = { x: 0, y: 0 };
    bounds.current = null;
    ref.current?.style.setProperty('--depth-x', '0');
    ref.current?.style.setProperty('--depth-y', '0');
  };
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const clearBounds = () => { bounds.current = null; };
    const clear = () => {
      cancelAnimationFrame(frame.current); frame.current = 0; bounds.current = null;
      ref.current?.style.setProperty('--depth-x', '0');
      ref.current?.style.setProperty('--depth-y', '0');
    };
    preference.addEventListener('change', clear);
    window.addEventListener('resize', clear);
    window.addEventListener('scroll', clearBounds, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      preference.removeEventListener('change', clear);
      window.removeEventListener('resize', clear);
      window.removeEventListener('scroll', clearBounds);
    };
  }, []);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !allowed()) return;
    const box = bounds.current ?? (bounds.current = event.currentTarget.getBoundingClientRect());
    if (!box.width || !box.height) return;
    point.current = {
      x: Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1)),
      y: Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1)),
    };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty('--depth-x', String(point.current.x));
      ref.current?.style.setProperty('--depth-y', String(point.current.y));
      frame.current = 0;
    });
  };
  return { ref, onPointerMove, onPointerLeave: reset, onPointerCancel: reset };
}
