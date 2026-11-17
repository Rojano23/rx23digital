import { useEffect, useRef, useState } from 'react';
import type { Calculation, Metric } from '../../../utils/calculators/definitions';
import { formatCurrency, formatPercent, formatUnits } from '../../../utils/calculators/currency';
const formatMetric = (metric: Metric) => metric.value === null ? metric.empty ?? 'No disponible' : metric.kind === 'money' ? formatCurrency(metric.value) : metric.kind === 'percent' ? formatPercent(metric.value) : formatUnits(metric.value);
export default function ResultPanel({ result }: { result: Calculation | null }) {
  const [feedback, setFeedback] = useState<{ text: string; message: string } | null>(null);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const text = result ? [result.primary, ...result.secondary].map(metric => `${metric.label}: ${formatMetric(metric)}`).join('\n') : '';
  useEffect(() => {
    if (!feedback) return;
    if (feedback.message.startsWith('Selecciona')) { fallbackRef.current?.focus(); fallbackRef.current?.select(); }
    const timer = setTimeout(() => setFeedback(null), 1800);
    return () => clearTimeout(timer);
  }, [feedback]);
  const copy = async () => {
    if (!text) return;
    try { await navigator.clipboard.writeText(text); setFeedback({ text, message: 'Resultado copiado' }); }
    catch { setFeedback({ text, message: 'Selecciona el resumen para copiarlo manualmente.' }); }
  };
  return <section className="business-results" aria-label="Resultados"><span className="eyebrow">TU RESULTADO</span>{result ? <div className="business-result-values" key={text} aria-live="polite" aria-atomic="true"><h3>{result.primary.label}</h3><p className="business-primary">{formatMetric(result.primary)}</p><dl>{result.secondary.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{formatMetric(metric)}</dd></div>)}</dl></div> : <div className="business-empty"><h3>Hagamos las cuentas.</h3><p>Completa los campos para ver el resultado.</p></div>}<button className="button primary" type="button" disabled={!result} onClick={() => void copy()}>Copiar resultado</button><p className="business-copy-status" role="status">{feedback?.text === text ? feedback.message : ''}</p>{feedback?.text === text && feedback.message.startsWith('Selecciona') && <textarea ref={fallbackRef} readOnly value={text} aria-label="Resumen para copiar"/>}</section>;
}
