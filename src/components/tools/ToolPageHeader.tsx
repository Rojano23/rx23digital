import { homeSectionHref } from '../../config/routes';
export default function ToolPageHeader({ title, description, note }: { title: string; description: string; note?: string }) {
  return <header className="tool-page-header"><a className="tool-back" href={homeSectionHref('herramientas')}>← Volver a Herramientas</a><span className="eyebrow">RX23 TOOLS</span><h1>{title}</h1><p>{description}</p><p className="tool-privacy">{note ?? <>Todo el procesamiento se realiza directamente en tu navegador.<br/>RX23 Digital no recibe ni almacena la información que ingreses.</>}</p></header>;
}
