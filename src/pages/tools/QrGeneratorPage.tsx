import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ToolPageHeader from '../../components/tools/ToolPageHeader';
import QrTypeSelector from '../../components/tools/qr/QrTypeSelector';
import QrForm from '../../components/tools/qr/QrForm';
import QrCustomization from '../../components/tools/qr/QrCustomization';
import QrPreview from '../../components/tools/qr/QrPreview';
import { initialFields, defaultDesign } from '../../utils/qr/qrTypes';
import type { QrType } from '../../utils/qr/qrTypes';
import { buildQrPayload } from '../../utils/qr/qrPayload';
import { generateQr } from '../../utils/qr/qrGenerate';
import { lowContrast } from '../../utils/qr/qrValidation';
import '../../styles/qr-tool.css';
export default function QrGeneratorPage() {
  const [type, setType] = useState<QrType>('url');
  const [fields, setFields] = useState({ ...initialFields });
  const [design, setDesign] = useState({ ...defaultDesign });
  const [result, setResult] = useState<{ key: string; png: string; svg: string; error: string } | null>(null);
  const { payload, hint } = buildQrPayload(type, fields);
  const key = JSON.stringify({ payload, design });
  useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void generateQr(payload, design).then(output => { if (!cancelled) setResult({ key, ...output, error: '' }); }).catch(() => {
        if (!cancelled) setResult({ key, png: '', svg: '', error: 'El contenido es demasiado largo para esta configuración. Reduce la información o el nivel de corrección.' });
      });
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [payload, design, key]);
  const current = payload && result?.key === key ? result : null;
  const output = current?.png ? current : null;
  return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar/><main id="main" className="qr-tool-page"><div className="container"><ToolPageHeader title="Generador de QR" description="Crea códigos QR para compartir enlaces, textos, WhatsApp, correo, teléfono o redes Wi-Fi."/><div className="qr-tool-grid"><section className="qr-config-card" aria-labelledby="qr-config-heading"><h2 id="qr-config-heading">Configuración</h2><QrTypeSelector value={type} onChange={setType}/><form onSubmit={e => e.preventDefault()} autoComplete="off"><QrForm type={type} fields={fields} onChange={patch => setFields(previous => ({ ...previous, ...patch }))}/><p className="qr-input-hint" role="status">{hint}</p><QrCustomization design={design} onChange={setDesign}/></form></section><QrPreview output={output} busy={Boolean(payload && !current)} error={current?.error ?? ''} contrastWarning={lowContrast(design.foreground, design.background)}/></div></div></main><Footer/></>;
}
