/**
 * Generated, illustrated avatar (never a photo of a real person).
 * Men wear an Omani kumma, women a hijab. `tone` varies background and skin colours.
 */
const BGS = ['#1C5AA6', '#0B2C6E', '#0070C0', '#2E6FB7', '#174A8B', '#3B7BC8', '#0F3D80', '#2A5FA0', '#1E4F94', '#2C7AC0'];
const SKINS = ['#C68A5E', '#B57A50', '#D49C70', '#A86E46', '#C9906A', '#BC8258', '#D8A47C', '#B07448', '#C48A62', '#A97650'];
const HIJABS = ['#5B6B85', '#7A4B5E', '#3E5C76', '#6B5B95', '#2F5D62'];

export function Avatar({
  name,
  tone = 0,
  gender = 'm',
  size = 64,
  className = '',
  decorative = true,
}: {
  name: string;
  tone?: number;
  gender?: 'm' | 'f';
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const bg = BGS[tone % BGS.length];
  const skin = SKINS[tone % SKINS.length];
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={`shrink-0 rounded-full ${className}`}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : name}
      focusable="false"
    >
      <circle cx="48" cy="48" r="48" fill={bg} />
      <circle cx="48" cy="48" r="40" fill="#fff" opacity="0.06" />
      {gender === 'm' ? (
        <>
          {/* dishdasha shoulders */}
          <path d="M14 96c2-18 16-28 34-28s32 10 34 28z" fill="#F4F7FB" />
          <path d="M48 70v14" stroke="#D9E2EF" strokeWidth="2" />
          <circle cx="48" cy="84" r="2" fill="#D4A84B" />
          {/* neck + face */}
          <rect x="41" y="56" width="14" height="14" rx="5" fill={skin} />
          <ellipse cx="48" cy="46" rx="15" ry="17" fill={skin} />
          {/* beard */}
          <path d="M34 48c1 11 7 17 14 17s13-6 14-17c-3 5-8 6-14 6s-11-1-14-6z" fill="#2B2420" opacity="0.85" />
          {/* kumma cap */}
          <path d="M32 38c0-11 7-17 16-17s16 6 16 17c-5-2-10-3-16-3s-11 1-16 3z" fill="#F4F7FB" />
          <path d="M34 34c4-1.5 9-2.2 14-2.2s10 .7 14 2.2" stroke="#D4A84B" strokeWidth="1.6" fill="none" />
          <path d="M37 29c3-1 7-1.5 11-1.5s8 .5 11 1.5" stroke="#1C5AA6" strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
          <circle cx="42" cy="47" r="1.6" fill="#1b1b1b" />
          <circle cx="54" cy="47" r="1.6" fill="#1b1b1b" />
        </>
      ) : (
        <>
          {/* hijab and abaya */}
          <path d="M12 96c2-20 17-30 36-30s34 10 36 30z" fill="#1E2A44" />
          <path d="M28 52c0-16 9-27 20-27s20 11 20 27c0 10-4 19-8 23H36c-4-4-8-13-8-23z" fill={HIJABS[tone % HIJABS.length]} />
          <ellipse cx="48" cy="50" rx="12" ry="14" fill={skin} />
          <path d="M36 42c2-8 7-12 12-12s10 4 12 12c-4-3-8-4-12-4s-8 1-12 4z" fill={HIJABS[tone % HIJABS.length]} />
          <circle cx="43" cy="50" r="1.5" fill="#1b1b1b" />
          <circle cx="53" cy="50" r="1.5" fill="#1b1b1b" />
          <path d="M44 57c2.5 1.6 5.5 1.6 8 0" stroke="#7a4a32" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <circle cx="62" cy="64" r="2.2" fill="#D4A84B" />
        </>
      )}
    </svg>
  );
}

/** Initials avatar used for the team (illustrated, no photos). */
export function InitialsAvatar({ text, tone = 0, size = 72 }: { text: string; tone?: number; size?: number }) {
  const bg = BGS[tone % BGS.length];
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} className="shrink-0 rounded-full" aria-hidden="true" focusable="false">
      <circle cx="48" cy="48" r="48" fill={bg} />
      <path
        d="M18 60 L48 34 L78 60"
        fill="none"
        stroke="#D4A84B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <text
        x="48"
        y="78"
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#fff"
      >
        {text}
      </text>
    </svg>
  );
}
