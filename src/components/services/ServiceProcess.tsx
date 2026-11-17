import type { CSSProperties } from 'react';
import { ArrowRight } from '../UI';
import useFlowSequence from '../../hooks/motion/useFlowSequence';
export default function ServiceProcess({ steps }: { steps: readonly string[] }) {
  const ref = useFlowSequence();
  return <div ref={ref} data-motion-flow className="web-process reveal" role="list" aria-label="Proceso de desarrollo web">{steps.map((step,index) => <div role="listitem" className="flow-step" key={step} style={{ '--flow-index': index } as CSSProperties}>{index > 0 && <ArrowRight className="flow-arrow" size={15} aria-hidden="true"/>}<div className="flow-block"><span className="web-step-number">{String(index+1).padStart(2,'0')}</span><strong>{step}</strong></div></div>)}</div>;
}
