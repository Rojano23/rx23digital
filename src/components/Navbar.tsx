import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WhatsAppCTA } from './UI';
import { Brand } from './Brand';
import { navigation } from '../data/navigation';
import '../styles/navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const sections = navigation.map(([, id]) => document.getElementById(id));
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const line = (headerRef.current?.getBoundingClientRect().bottom ?? 84) + 28;
      let current = 'inicio';
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const desktop = matchMedia('(min-width: 1241px)');
    const resize = () => { if (desktop.matches) setOpen(false); schedule(); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={`navbar${scrolled ? ' is-scrolled' : ''}`} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <div className="container nav-inner">
        <a className="brand-link" href="#inicio" aria-label="RX23 Digital, inicio" onClick={() => setOpen(false)}><Brand /></a>
        <nav id="main-navigation" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Navegación principal">
          {navigation.map(([label, id]) => (
            <a href={`#${id}`} key={id} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <WhatsAppCTA className="button primary nav-cta">Hablemos</WhatsAppCTA>
        <button ref={toggleRef} type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
    </header>
  );
}
