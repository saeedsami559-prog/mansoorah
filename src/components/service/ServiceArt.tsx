import { useId } from 'react';

/**
 * Original flat illustrations for each service (Section 9 fallback: no stock photos).
 * Colours use CSS variables so they adapt to light and dark themes.
 */
const NAVY = '#0B2C6E';
const BLUE = '#1C5AA6';
const ROYAL = '#0070C0';
const GOLD = '#D4A84B';
const WHITE = '#FFFFFF';

function Device({ slug }: { slug: string }) {
  switch (slug) {
    case 'smart-door-lock':
      return (
        <g>
          <rect x="130" y="36" width="140" height="210" rx="10" fill={NAVY} />
          <rect x="142" y="48" width="116" height="90" rx="6" fill={BLUE} />
          <rect x="142" y="146" width="116" height="88" rx="6" fill={BLUE} />
          <rect x="222" y="104" width="40" height="92" rx="12" fill={WHITE} />
          <rect x="230" y="112" width="24" height="16" rx="4" fill={ROYAL} opacity="0.25" />
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => <circle key={`${r}-${c}`} cx={236 + c * 12} cy={142 + r * 11} r="3.2" fill={NAVY} />),
          )}
          <circle cx="242" cy="180" r="8" fill="none" stroke={GOLD} strokeWidth="2.5" />
          <path d="M238 180a4 4 0 0 1 8 0" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
          <rect x="196" y="152" width="34" height="10" rx="5" fill={GOLD} />
          <g fill="none" stroke={ROYAL} strokeWidth="3" strokeLinecap="round" opacity="0.8">
            <path d="M290 90a30 30 0 0 1 0 36" />
            <path d="M302 80a46 46 0 0 1 0 56" />
          </g>
        </g>
      );
    case 'security-cameras':
      return (
        <g>
          <rect x="70" y="40" width="16" height="70" rx="4" fill={NAVY} />
          <path d="M86 70 L120 78" stroke={NAVY} strokeWidth="10" strokeLinecap="round" />
          <g transform="rotate(14 190 100)">
            <rect x="112" y="72" width="150" height="56" rx="26" fill={WHITE} />
            <rect x="240" y="78" width="40" height="44" rx="14" fill={NAVY} />
            <circle cx="262" cy="100" r="12" fill={ROYAL} />
            <circle cx="262" cy="100" r="5" fill={NAVY} />
            <circle cx="140" cy="100" r="4" fill={GOLD} />
          </g>
          <path d="M268 150 L330 210 L230 222 Z" fill={ROYAL} opacity="0.14" />
          <g transform="translate(300 52)">
            <path d="M0 0h70v10a35 35 0 0 1-70 0z" fill={WHITE} />
            <circle cx="35" cy="22" r="13" fill={NAVY} />
            <circle cx="35" cy="22" r="6" fill={ROYAL} />
          </g>
          <circle cx="352" cy="134" r="5" fill="#1F9D61" />
          <rect x="70" y="190" width="120" height="44" rx="10" fill={WHITE} opacity="0.95" />
          <circle cx="92" cy="212" r="7" fill="#C53030" />
          <rect x="106" y="205" width="64" height="6" rx="3" fill={NAVY} opacity="0.6" />
          <rect x="106" y="215" width="44" height="6" rx="3" fill={NAVY} opacity="0.3" />
        </g>
      );
    case 'video-doorbell':
      return (
        <g>
          <rect x="100" y="34" width="170" height="214" rx="8" fill={NAVY} opacity="0.12" />
          <rect x="176" y="46" width="58" height="160" rx="29" fill={WHITE} />
          <circle cx="205" cy="84" r="18" fill={NAVY} />
          <circle cx="205" cy="84" r="8" fill={ROYAL} />
          <circle cx="211" cy="78" r="3" fill={WHITE} opacity="0.7" />
          <circle cx="205" cy="160" r="20" fill="none" stroke={GOLD} strokeWidth="5" />
          <circle cx="205" cy="160" r="11" fill={BLUE} />
          <g fill="none" stroke={ROYAL} strokeWidth="3" strokeLinecap="round" opacity="0.8">
            <path d="M252 140a26 26 0 0 1 0 40" />
            <path d="M266 130a42 42 0 0 1 0 60" />
          </g>
          <rect x="286" y="118" width="70" height="120" rx="14" fill={NAVY} />
          <rect x="294" y="130" width="54" height="84" rx="6" fill={ROYAL} opacity="0.35" />
          <circle cx="321" cy="164" r="14" fill={WHITE} opacity="0.85" />
          <path d="M305 200a16 12 0 0 1 32 0" fill={WHITE} opacity="0.85" />
          <rect x="310" y="222" width="22" height="6" rx="3" fill={GOLD} />
        </g>
      );
    case 'smart-lighting':
      return (
        <g>
          <path d="M200 20 V70" stroke={NAVY} strokeWidth="4" />
          <circle cx="200" cy="130" r="80" fill={GOLD} opacity="0.18" />
          <circle cx="200" cy="130" r="54" fill={GOLD} opacity="0.22" />
          <path d="M176 70h48l6 18h-60z" fill={NAVY} />
          <path d="M200 88c-30 0-48 22-48 46 0 18 10 30 22 40v16h52v-16c12-10 22-22 22-40 0-24-18-46-48-46z" fill={WHITE} />
          <path d="M186 160l14-26 14 26" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="176" y="192" width="48" height="8" rx="4" fill={NAVY} />
          <rect x="182" y="204" width="36" height="8" rx="4" fill={NAVY} opacity="0.7" />
          <rect x="300" y="120" width="62" height="96" rx="14" fill={WHITE} />
          <rect x="312" y="134" width="38" height="30" rx="8" fill={BLUE} />
          <rect x="312" y="172" width="38" height="30" rx="8" fill={NAVY} opacity="0.15" />
          <circle cx="331" cy="149" r="4" fill={GOLD} />
          <rect x="46" y="150" width="70" height="66" rx="12" fill={WHITE} opacity="0.95" />
          <circle cx="66" cy="172" r="8" fill={GOLD} />
          <rect x="80" y="168" width="26" height="8" rx="4" fill={NAVY} opacity="0.5" />
          <rect x="58" y="194" width="48" height="8" rx="4" fill={BLUE} opacity="0.5" />
        </g>
      );
    case 'iot-hub':
      return (
        <g>
          <g stroke={ROYAL} strokeWidth="3" strokeDasharray="6 7" opacity="0.7">
            <path d="M200 140 L80 70" />
            <path d="M200 140 L320 70" />
            <path d="M200 140 L80 214" />
            <path d="M200 140 L320 214" />
          </g>
          <circle cx="200" cy="140" r="58" fill={WHITE} />
          <circle cx="200" cy="140" r="42" fill={NAVY} />
          <circle cx="200" cy="140" r="26" fill="none" stroke={GOLD} strokeWidth="4" />
          <circle cx="200" cy="140" r="8" fill={GOLD} />
          {[
            [80, 70, 'lock'],
            [320, 70, 'bulb'],
            [80, 214, 'cam'],
            [320, 214, 'ac'],
          ].map(([x, y, k]) => (
            <g key={String(k)} transform={`translate(${Number(x) - 26} ${Number(y) - 26})`}>
              <rect width="52" height="52" rx="14" fill={WHITE} />
              {k === 'lock' && (
                <>
                  <rect x="16" y="24" width="20" height="16" rx="3" fill={BLUE} />
                  <path d="M20 24v-5a6 6 0 0 1 12 0v5" fill="none" stroke={BLUE} strokeWidth="3" />
                </>
              )}
              {k === 'bulb' && (
                <>
                  <circle cx="26" cy="22" r="10" fill={GOLD} />
                  <rect x="21" y="33" width="10" height="7" rx="2" fill={NAVY} />
                </>
              )}
              {k === 'cam' && (
                <>
                  <rect x="11" y="18" width="30" height="16" rx="8" fill={NAVY} />
                  <circle cx="34" cy="26" r="4" fill={ROYAL} />
                </>
              )}
              {k === 'ac' && (
                <>
                  <rect x="10" y="17" width="32" height="12" rx="4" fill={BLUE} />
                  <path d="M16 35v6M26 35v6M36 35v6" stroke={ROYAL} strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}
            </g>
          ))}
        </g>
      );
    case 'wifi-network':
      return (
        <g>
          <g fill="none" stroke={ROYAL} strokeWidth="9" strokeLinecap="round">
            <path d="M120 112a112 112 0 0 1 160 0" opacity="0.35" />
            <path d="M146 138a74 74 0 0 1 108 0" opacity="0.6" />
            <path d="M172 164a36 36 0 0 1 56 0" />
          </g>
          <rect x="110" y="180" width="180" height="48" rx="14" fill={NAVY} />
          <rect x="134" y="150" width="8" height="34" rx="4" fill={NAVY} />
          <rect x="258" y="150" width="8" height="34" rx="4" fill={NAVY} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={140 + i * 18} cy="204" r="4" fill={i < 3 ? '#1F9D61' : GOLD} />
          ))}
          <rect x="228" y="199" width="44" height="10" rx="5" fill={BLUE} />
          <rect x="44" y="110" width="44" height="66" rx="12" fill={WHITE} />
          <circle cx="66" cy="160" r="5" fill={BLUE} />
          <rect x="54" y="122" width="24" height="6" rx="3" fill={NAVY} opacity="0.3" />
          <rect x="312" y="110" width="44" height="66" rx="12" fill={WHITE} />
          <circle cx="334" cy="160" r="5" fill={BLUE} />
          <rect x="322" y="122" width="24" height="6" rx="3" fill={NAVY} opacity="0.3" />
        </g>
      );
    case 'smart-ac-controller':
      return (
        <g>
          <rect x="70" y="50" width="260" height="76" rx="18" fill={WHITE} />
          <rect x="88" y="104" width="224" height="8" rx="4" fill={NAVY} opacity="0.15" />
          <circle cx="302" cy="72" r="5" fill="#1F9D61" />
          <g fill="none" stroke={ROYAL} strokeWidth="4" strokeLinecap="round" opacity="0.7">
            <path d="M120 134c0 18 -14 22 -14 40" />
            <path d="M170 134c0 18 -14 22 -14 40" />
            <path d="M220 134c0 18 -14 22 -14 40" />
            <path d="M270 134c0 18 -14 22 -14 40" />
          </g>
          <rect x="250" y="160" width="96" height="74" rx="16" fill={NAVY} />
          <text
            x="298"
            y="208"
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="30"
            fontWeight="700"
            fill={WHITE}
          >
            22°
          </text>
          <circle cx="332" cy="174" r="4" fill={GOLD} />
          <rect x="60" y="176" width="64" height="58" rx="14" fill={WHITE} />
          <circle cx="92" cy="205" r="14" fill="none" stroke={GOLD} strokeWidth="4" />
          <path d="M92 196v9l6 4" stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'tech-repair':
      return (
        <g>
          <rect x="80" y="54" width="240" height="150" rx="14" fill={NAVY} />
          <rect x="94" y="68" width="212" height="122" rx="6" fill={ROYAL} opacity="0.35" />
          <path d="M180 204h40l8 24h-56z" fill={NAVY} />
          <rect x="150" y="226" width="100" height="10" rx="5" fill={NAVY} />
          <path
            d="M150 130l20 20 40-46"
            fill="none"
            stroke={WHITE}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g transform="rotate(-38 300 170)">
            <rect x="290" y="100" width="20" height="110" rx="6" fill={GOLD} />
            <rect x="296" y="210" width="8" height="34" rx="3" fill={WHITE} />
          </g>
          <g transform="rotate(40 110 180)">
            <rect x="102" y="130" width="16" height="100" rx="8" fill={WHITE} />
            <path d="M96 118a18 18 0 1 0 28 0v14h-28z" fill={WHITE} />
          </g>
        </g>
      );
    default:
      return (
        <g>
          <path
            d="M90 140 L200 54 L310 140"
            fill="none"
            stroke={GOLD}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="116" y="130" width="168" height="104" rx="8" fill={WHITE} />
          <rect x="180" y="170" width="40" height="64" rx="6" fill={NAVY} />
          <rect x="206" y="196" width="8" height="16" rx="3" fill={GOLD} />
          <circle cx="146" cy="160" r="14" fill={GOLD} opacity="0.85" />
          <rect x="236" y="150" width="34" height="24" rx="6" fill={BLUE} />
          <g fill="none" stroke={ROYAL} strokeWidth="5" strokeLinecap="round">
            <path d="M178 112a32 32 0 0 1 44 0" />
            <path d="M188 122a18 18 0 0 1 24 0" />
          </g>
        </g>
      );
  }
}

export function ServiceArt({ slug, className = '', label }: { slug: string; className?: string; label?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--art-bg1)" />
          <stop offset="1" stopColor="var(--art-bg2)" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#g${id})`} />
      <g fill="none" stroke="var(--art-line)" strokeWidth="2">
        <path d="M-10 260 V190 Q-10 150 30 138 Q70 150 70 190 V260" />
        <path d="M330 260 V190 Q330 150 370 138 Q410 150 410 190 V260" />
        <path d={`M0 22 ${Array.from({ length: 20 }, () => 'h10 v-8 h10 v8').join(' ')}`} />
      </g>
      <Device slug={slug} />
    </svg>
  );
}
