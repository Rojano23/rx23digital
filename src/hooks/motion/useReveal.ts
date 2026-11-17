import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('#main .reveal, #main [data-motion-flow]')];
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const reveal = (node: HTMLElement) => {
      node.classList.add('is-revealed');
      if (!preference.matches) node.dispatchEvent(new Event('rx23:reveal'));
    };
    if (!('IntersectionObserver' in window) || preference.matches) {
      nodes.forEach(node => node.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    nodes.forEach(node => {
      if (node.matches('.reveal')) node.classList.add('motion-reveal', 'is-reveal-ready');
      observer.observe(node);
    });
    const change = () => {
      if (!preference.matches) return;
      nodes.forEach(node => { node.classList.add('is-revealed'); observer.unobserve(node); });
    };
    preference.addEventListener('change', change);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', change);
      nodes.forEach(node => node.classList.remove('is-reveal-ready', 'motion-reveal', 'is-revealed'));
    };
  }, []);
}
