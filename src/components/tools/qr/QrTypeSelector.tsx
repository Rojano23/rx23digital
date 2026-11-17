import { qrTypes } from '../../../utils/qr/qrTypes';
import type { QrType } from '../../../utils/qr/qrTypes';
export default function QrTypeSelector({ value, onChange }: { value: QrType; onChange: (value: QrType) => void }) {
  return <div className="qr-type-selector" role="group" aria-label="Tipo de QR">{qrTypes.map(([type, label]) => <button key={type} type="button" aria-pressed={value === type} onClick={() => onChange(type)}>{label}</button>)}</div>;
}
