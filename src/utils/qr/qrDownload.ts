export function downloadQr(format: 'png' | 'svg', output: { png: string; svg: string }) {
  const link = document.createElement('a');
  const objectUrl = format === 'svg' ? URL.createObjectURL(new Blob([output.svg], { type: 'image/svg+xml;charset=utf-8' })) : null;
  link.href = objectUrl ?? output.png;
  link.download = `rx23-qr.${format}`;
  document.body.append(link);
  link.click();
  link.remove();
  if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
