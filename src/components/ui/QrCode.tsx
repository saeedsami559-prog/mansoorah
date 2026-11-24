import { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/** Real, scannable QR code rendered as SVG (no network, no images). */
export function QrCode({ value, size = 168, label }: { value: string; size?: number; label: string }) {
  const path = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return { d, n };
  }, [value]);
  return (
    <svg
      viewBox={`-2 -2 ${path.n + 4} ${path.n + 4}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect x="-2" y="-2" width={path.n + 4} height={path.n + 4} fill="#fff" />
      <path d={path.d} fill="#0B2C6E" />
    </svg>
  );
}
