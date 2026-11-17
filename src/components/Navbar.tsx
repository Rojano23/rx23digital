import { homeAnchor } from '../config/routes';
import { useEffect, useRef, useState } from 'react';
import { Menu, MoonStar, Sun, X } from 'lucide-react';
import { WhatsAppCTA } from './UI';
import { Brand } from './Brand';
import { navigation } from '../data/navigation';
import '../styles/navbar.css';

type ThemeMode = 'light' | 'dark';
const THEME_KEY = 'rx23_theme';

function readInitialTheme(): { theme: ThemeMode; manual: boolean } {
  if (typeof window === 'undefined') return { theme: 'light', manual: false };
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return { theme: saved, manual: true };
  return { theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', manual: false };
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => readInitialTheme().theme);
  const [hasManualTheme, setHasManualTheme] = useState(() => readInitialTheme().manual);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const sections = navigation.map(([, id]) => document.getElementById(id));
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const line = (headerRef.current?.getBoundingClientRect().bottom ?? 84) + 28;
      let current = window.location.pathname.includes('/servicios/') ? 'servicios' : window.location.pathname.includes('/labs/') ? 'desarrollos' : window.location.pathname.includes('/herramientas/') ? 'herramientas' : window.location.pathname.includes('/desarrollos/') ? 'desarrollos' : 'inicio';
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

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (hasManualTheme) window.localStorage.setItem(THEME_KEY, theme);
    else window.localStorage.removeItem(THEME_KEY);
  }, [theme, hasManualTheme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncTheme = () => {
      if (!hasManualTheme) setTheme(media.matches ? 'dark' : 'light');
    };
    syncTheme();
    media.addEventListener('change', syncTheme);
    return () => media.removeEventListener('change', syncTheme);
  }, [hasManualTheme]);

  const toggleTheme = () => {
    setHasManualTheme(true);
    setTheme(previous => (previous === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header ref={headerRef} className={`navbar${scrolled ? ' is-scrolled' : ''}`} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <div className="container nav-inner">
        <a className="brand-link" href={homeAnchor('inicio')} aria-label="RX23 Digital, inicio" onClick={() => setOpen(false)}><Brand /></a>
        <nav id="main-navigation" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Navegación principal">
          {navigation.map(([label, id]) => (
            <a href={homeAnchor(id)} key={id} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? 'Tema oscuro activo' : 'Tema claro activo'}
        >
          {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <MoonStar size={16} aria-hidden="true" />}
          <span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
        </button>
        <WhatsAppCTA className="button primary nav-cta">Hablemos</WhatsAppCTA>
        <button ref={toggleRef} type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
    </header>
  );
}
