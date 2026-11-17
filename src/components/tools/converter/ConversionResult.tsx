import { useEffect, useRef, useState } from 'react';
import type { Unit } from '../../../utils/conversions/definitions';
import UnitSelector from './UnitSelector';
export default function ConversionResult({ result, unit, units, onUnitChange }: { result: string; unit: string; units: readonly Unit[]; onUnitChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ result: string; message: string } | null>(null);
  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 1800);
    return () => clearTimeout(timeout);
  }, [feedback]);
  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setFeedback({ result, message: 'Resultado copiado' });
    } catch {
      inputRef.current?.focus(); inputRef.current?.select();
      setFeedback({ result, message: 'Selecciona el resultado para copiarlo manualmente.' });
    }
  };
  return <div className="converter-side converter-result"><span className="converter-direction">A</span><label htmlFor="converter-result">Resultado<input ref={inputRef} id="converter-result" type="text" readOnly value={result} placeholder="—"/></label><UnitSelector id="converter-to" label="Unidad de destino" units={units} value={unit} onChange={onUnitChange}/><div className="converter-copy"><button type="button" disabled={!result} onClick={() => void copy()}>Copiar resultado</button><span role="status">{feedback?.result === result ? feedback.message : ''}</span></div></div>;
}
