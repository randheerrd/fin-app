import { useState } from 'react';
import { logoSrc } from '../lib/logos';

export default function BrandLogo({
  domain,
  label = '?',
  bg = '#0E3F2E',
  fg = '#ffffff',
  size = 36,
  rounded = 'rounded-lg',
  fallbackIcon: Fallback,
}) {
  const [failed, setFailed] = useState(false);
  const src = !failed && domain ? logoSrc(domain, size) : null;

  if (src) {
    return (
      <img
        src={src}
        alt={label}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={`${rounded} flex-shrink-0 object-contain bg-white border border-[#f3f4f6]`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Icon fallback (e.g. a building for banks with no logo).
  if (Fallback) {
    return (
      <div
        className={`${rounded} bg-[#f3f4f6] flex items-center justify-center flex-shrink-0`}
        style={{ width: size, height: size }}
      >
        <Fallback size={Math.round(size * 0.5)} className="text-[#6b7280]" />
      </div>
    );
  }

  return (
    <div
      className={`${rounded} flex items-center justify-center flex-shrink-0 font-bold`}
      style={{ width: size, height: size, backgroundColor: bg, color: fg, fontSize: size * 0.42 }}
    >
      {(label.trim()[0] || '?').toUpperCase()}
    </div>
  );
}
