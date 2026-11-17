export const currentPath = () => {
  const pathname = decodeURI(window.location.pathname);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const relative = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length)
    : pathname;
  return relative.replace(/^\/+|\/+$/g, '');
};

const LEGACY_SECTION_ALIASES: Record<string, string> = {
  labs: 'desarrollos',
  'rx23-labs': 'desarrollos',
};

export const normalizeHomeSection = (section?: string) =>
  section ? (LEGACY_SECTION_ALIASES[section] ?? section) : undefined;

export const homeSectionHref = (section?: string) =>
  `${import.meta.env.BASE_URL}${normalizeHomeSection(section) ? `#${encodeURIComponent(normalizeHomeSection(section) as string)}` : ''}`;

// On Home, fragment-only links preserve native smooth scrolling without a reload.
export const homeAnchor = (section: string) =>
  currentPath() ? homeSectionHref(section) : `#${encodeURIComponent(normalizeHomeSection(section) ?? section)}`;
