import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight } from '../UI';
/** Uses the shared reveal event and flow animations; never replays on hover. */
export default function ClipsFlow({ steps, className = '', label }: { steps: ReactNode[]; className?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const play = () => { if (!preference.matches) node.classList.add('flow-play-a'); };
    const stop = () => { if (preference.matches) node.classList.remove('flow-play-a'); };
    node.addEventListener('rx23:reveal', play, { once: true });
    preference.addEventListener('change', stop);
    return () => { node.removeEventListener('rx23:reveal', play); preference.removeEventListener('change', stop); };
  }, []);
  return <div ref={ref} className={`clips-flow reveal ${className}`} data-motion-flow role="list" aria-label={label}>{steps.map((step, index) => <div className="flow-step" role="listitem" key={index} style={{ '--flow-index': index } as CSSProperties}>{index > 0 && <ArrowRight className="flow-arrow" size={17} aria-hidden="true"/>}<div className="flow-block">{step}</div></div>)}</div>;
}
