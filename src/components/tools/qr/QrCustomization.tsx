import { useId, useState } from 'react';
import { Info } from 'lucide-react';
import { defaultDesign } from '../../../utils/qr/qrTypes';
import type { QrDesign } from '../../../utils/qr/qrTypes';

const resistanceOptions = [
  { value: 'L', label: 'Básica', description: 'Para códigos limpios y uso digital. Tolera daños menores.' },
  { value: 'M', label: 'Recomendada', description: 'Buen equilibrio entre tamaño y resistencia para uso general.' },
  { value: 'Q', label: 'Alta', description: 'Tolera mayor deterioro o interferencias en impresión.' },
  { value: 'H', label: 'Máxima', description: 'Mayor resistencia. Útil cuando el QR puede dañarse o llevar elementos superpuestos.' },
] as const;

function ContextHelp({ label, children }: { label: string; children: string }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return <span className="qr-context-help" onMouseEnter={() => setVisible(true)} onMouseLeave={event => {
    if (!event.currentTarget.contains(document.activeElement)) setVisible(false);
  }}>
    <button type="button" className="qr-help-button" aria-label={`Ayuda: ${label}`} aria-describedby={id}
      onFocus={() => setVisible(true)} onBlur={() => setVisible(false)} onClick={() => setVisible(true)}
      onKeyDown={event => { if (event.key === 'Escape') { setVisible(false); event.stopPropagation(); } }}>
      <Info size={14} aria-hidden="true"/>
    </button>
    <span id={id} role="tooltip" className="qr-help-tooltip" hidden={!visible}>{children}</span>
  </span>;
}

export default function QrCustomization({ design, onChange }: { design: QrDesign; onChange: (design: QrDesign) => void }) {
  const patch = (value: Partial<QrDesign>) => onChange({ ...design, ...value });
  const resistance = resistanceOptions.find(option => option.value === design.correction)!;
  return <fieldset className="qr-customization">
    <legend>Personalización</legend>
    <div className="qr-design-grid">
      <label htmlFor="qr-foreground">Color del QR<span className="qr-color"><input id="qr-foreground" type="color" value={design.foreground} onChange={e => patch({ foreground: e.target.value })}/><span>{design.foreground.toUpperCase()}</span></span></label>
      <label htmlFor="qr-background">Color de fondo<span className="qr-color"><input id="qr-background" type="color" value={design.background} onChange={e => patch({ background: e.target.value })}/><span>{design.background.toUpperCase()}</span></span></label>
      <label htmlFor="qr-size">Tamaño<select id="qr-size" value={design.size} onChange={e => patch({ size: Number(e.target.value) as QrDesign['size'] })}>{[256,512,1024].map(size => <option value={size} key={size}>{size} px</option>)}</select></label>
      <div className="qr-explained-control">
        <div className="qr-control-heading"><label htmlFor="qr-correction">Resistencia del QR</label><ContextHelp label="Resistencia del QR">Una resistencia mayor permite recuperar el QR aunque una parte esté dañada o cubierta, pero también puede hacerlo más denso.</ContextHelp></div>
        <select id="qr-correction" aria-describedby="qr-resistance-description" value={design.correction} onChange={e => patch({ correction: e.target.value as QrDesign['correction'] })}>
          {resistanceOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <p id="qr-resistance-description" className="qr-control-description" aria-live="polite">{resistance.description}</p>
      </div>
    </div>
    <div className="qr-explained-control">
      <div className="qr-control-heading"><label htmlFor="qr-margin">Margen exterior</label><ContextHelp label="Margen exterior">El margen permite que la cámara identifique con claridad dónde comienza y termina el código.</ContextHelp></div>
      <p id="qr-margin-description" className="qr-control-description">Espacio libre alrededor del código QR para facilitar su lectura.</p>
      <input id="qr-margin" type="range" min="0" max="12" step="1" aria-describedby="qr-margin-description qr-margin-current qr-margin-recommendation" aria-valuetext={`${design.margin} módulos`} value={design.margin} onChange={e => patch({ margin: Number(e.target.value) })}/>
      <span id="qr-margin-current" className="qr-margin-current">Actual: {design.margin} módulos</span>
      <p id="qr-margin-recommendation" className="qr-control-description">Recomendado: 4 o más.</p>
    </div>
    <button type="button" className="qr-reset" onClick={() => onChange({ ...defaultDesign })}>Restablecer diseño</button>
  </fieldset>;
}
