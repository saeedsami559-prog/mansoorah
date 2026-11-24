/**
 * Omani architectural line art: a crenellated parapet (sharafat) over a row of pointed arches,
 * drawn as faint strokes for hero bands and the footer.
 */
export function ArchesMotif({
  className = '',
  opacity = 0.14,
  color = '#ffffff',
}: {
  className?: string;
  opacity?: number;
  color?: string;
}) {
  const arches = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg className={className} viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="2">
        {/* crenellations */}
        <path d={`M0 40 ${Array.from({ length: 48 }, () => 'h15 v-14 h15 v14').join(' ')}`} transform="translate(0 6)" />
        <path d="M0 52 H1440" />
        <path d="M0 60 H1440" strokeOpacity={opacity * 0.6} />
        {arches.map((i) => {
          const x = i * 120;
          return (
            <g key={i}>
              <path d={`M${x + 14} 220 V128 Q${x + 14} 86 ${x + 60} 72 Q${x + 106} 86 ${x + 106} 128 V220`} />
              <path
                d={`M${x + 30} 220 V134 Q${x + 30} 102 ${x + 60} 92 Q${x + 90} 102 ${x + 90} 134 V220`}
                strokeOpacity={opacity * 0.6}
              />
              <circle cx={x + 60} cy={116} r="5" strokeOpacity={opacity * 0.8} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Small house-line illustration used in the hero. */
export function HouseLineArt({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 520 360" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="2" strokeLinejoin="round">
        <path d="M30 330 H490" />
        <path d="M70 330 V170 H330 V330" />
        <path d="M60 170 H340" />
        <path d={`M60 170 ${Array.from({ length: 14 }, () => 'v-12 h10 v12 h10').join(' ')}`} />
        <path d="M330 330 V210 H460 V330" />
        <path d="M322 210 H468" />
        <path d={`M322 210 ${Array.from({ length: 7 }, () => 'v-10 h10 v10 h11').join(' ')}`} />
        <path d="M170 330 V262 Q170 230 200 222 Q230 230 230 262 V330" />
        <path d="M100 250 V222 Q100 204 118 198 Q136 204 136 222 V250 Z" />
        <path d="M264 250 V222 Q264 204 282 198 Q300 204 300 222 V250 Z" />
        <path d="M370 290 V258 Q370 240 395 232 Q420 240 420 258 V290 Z" />
        <path d="M200 120 V170" />
        <path d="M188 120 h24 l-12 -22 z" />
      </g>
    </svg>
  );
}
