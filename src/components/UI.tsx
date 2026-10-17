import { ArrowUpRight, ArrowRight, Code2, Globe2, Server, Mail, Headphones, PanelsTopLeft, Scissors, Search, House, Truck, FileText, QrCode, Calculator, ArrowLeftRight, Terminal, MessageCircle, Check, ShieldCheck, Layers, Smartphone, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { whatsappLink } from '../config/contact';
const icons = { web: PanelsTopLeft, server: Server, globe: Globe2, mail: Mail, code: Code2, support: Headphones, clips: Scissors, search: Search, home: House, fleet: Truck, document: FileText, qr: QrCode, calculator: Calculator, convert: ArrowLeftRight, terminal: Terminal, message: MessageCircle, check: Check, shield: ShieldCheck, layers: Layers, mobile: Smartphone, zap: Zap };
export function Icon({ name, size = 22 }: { name: string; size?: number }) { const Component = icons[name as keyof typeof icons] || Code2; return <Component size={size} strokeWidth={1.65} aria-hidden="true" />; }
export function WhatsAppCTA({ children, message, className = 'button primary' }: { children: ReactNode; message?: string; className?: string }) { return <a className={className} href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17} aria-hidden="true" /></a>; }
export function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) { return <div className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>; }
export { ArrowRight, ArrowUpRight };
