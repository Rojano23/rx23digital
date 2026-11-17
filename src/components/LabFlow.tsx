import useFlowSequence from '../hooks/motion/useFlowSequence';
import type { CSSProperties } from 'react';
import { ArrowRight, Icon } from './UI';
const flows = {
  'rx23-clips': [['web', 'Video'], ['search', 'Análisis'], ['mobile', 'Clips 9:16'], ['code', 'Subtítulos · hook · copy']],
  'rx23-seo': [['globe', 'Sitio web'], ['search', 'Auditoría'], ['terminal', 'Keywords'], ['layers', 'Competencia'], ['check', 'Recomendaciones']],
};
export default function LabFlow({ kind }: { kind: string }) {
  const ref = useFlowSequence();
  const flow = flows[kind as keyof typeof flows];
  return <div ref={ref} data-motion-flow className={`lab-flow ${kind}`} aria-label={`Flujo: ${flow.map(([, name]) => name).join(', luego ')}`}>
    {flow.map(([icon, label], index) => <div className="flow-step" key={label} style={{ '--flow-index': index } as CSSProperties}>
      {index > 0 && <ArrowRight className="flow-arrow" size={12} aria-hidden="true"/>}
      <span className="flow-block"><Icon name={icon} size={19}/><span>{label}</span>{kind === 'rx23-clips' && index === 2 && <i className="vertical-frame" aria-hidden="true"/>}</span>
    </div>)}
  </div>;
}
