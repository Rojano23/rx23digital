import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../../config/contact';
import { Icon } from '../UI';
export type DemoVideo = { src: string; poster?: string; orientation?: 'horizontal' | 'vertical' };
/** Local paths are relative to public/, resolved using the configured Vite base. */
export default function VideoDemo({ title, video }: { title: string; video?: DemoVideo }) {
  const ref = useRef<HTMLElement>(null);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    if (!video || !ref.current) return;
    if (!('IntersectionObserver' in window)) { setNearby(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '150px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [video]);
  return <figure ref={ref} className={`clips-demo ${video?.orientation === 'vertical' ? 'is-vertical' : ''}`}><figcaption>{title}</figcaption>{video ? <video aria-label={title} controls playsInline preload="metadata" src={nearby ? assetUrl(video.src) : undefined} poster={nearby && video.poster ? assetUrl(video.poster) : undefined}/> : <div className="clips-demo-placeholder"><Icon name="clips" size={27}/><span>Demo en preparación</span></div>}</figure>;
}
