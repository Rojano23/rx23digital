import { useEffect, useRef } from 'react';

export default function useFlowSequence() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const card = node.closest('.lab-link') ?? node;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let run = 0;
    let last = -Infinity;
    const play = () => {
      if (preference.matches || performance.now() - last < 1200) return;
      last = performance.now();
      run++;
      node.classList.remove('flow-play-a', 'flow-play-b');
      node.classList.add(run % 2 ? 'flow-play-a' : 'flow-play-b');
    };
    const pointer = (event: Event) => {
      if ((event as PointerEvent).pointerType === 'mouse' && matchMedia('(hover: hover)').matches) play();
    };
    const stop = () => { if (preference.matches) node.classList.remove('flow-play-a', 'flow-play-b'); };
    node.addEventListener('rx23:reveal', play);
    card.addEventListener('pointerenter', pointer);
    card.addEventListener('focusin', play);
    preference.addEventListener('change', stop);
    return () => {
      node.removeEventListener('rx23:reveal', play);
      card.removeEventListener('pointerenter', pointer);
      card.removeEventListener('focusin', play);
      preference.removeEventListener('change', stop);
      node.classList.remove('flow-play-a', 'flow-play-b');
    };
  }, []);
  return ref;
}
