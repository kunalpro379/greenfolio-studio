// Procedural green "grid & shapes" cover art, inspired by risograph editorial tiles.
const bgs = ["var(--leaf-300)", "var(--leaf-200)", "var(--leaf-600)", "var(--leaf-100)", "var(--leaf-400)", "var(--leaf-800)"];
const fgs = ["var(--leaf-700)", "var(--leaf-500)", "var(--leaf-900)", "var(--leaf-200)", "var(--paper)"];

function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function CoverArt({ seed, className = "" }: { seed: number; className?: string }) {
  const r = rand(seed);
  const bg = bgs[seed % bgs.length];
  const fg = fgs[(seed + 1) % fgs.length];
  const fg2 = fgs[(seed + 3) % fgs.length];
  const kind = seed % 4;
  const id = `g${seed}`;
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Cover illustration">
      <defs>
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0H0V12" fill="none" stroke="var(--ink)" strokeOpacity="0.28" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="400" height="300" style={{ fill: bg }} />
      {kind === 0 && (
        <g>
          <circle cx={150 + r() * 60} cy="150" r="110" style={{ fill: fg }} />
          <circle cx={150 + r() * 60} cy="150" r="110" fill={`url(#${id})`} />
          <rect x="250" y="120" width="54" height="60" style={{ fill: fg2 }} />
        </g>
      )}
      {kind === 1 && (
        <g style={{ mixBlendMode: "multiply" }}>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={150 + (i % 2) * 100} cy={110 + Math.floor(i / 2) * 90} r="85" style={{ fill: [fg, fg2, "var(--leaf-400)", "var(--leaf-700)"][i] }} opacity="0.75" />
          ))}
          <rect width="400" height="300" fill={`url(#${id})`} />
        </g>
      )}
      {kind === 2 && (
        <g>
          <rect x="40" y="30" width="320" height="60" style={{ fill: fg }} />
          <rect x="130" y="30" width="140" height="220" style={{ fill: fg }} />
          <rect x="40" y="30" width="320" height="60" fill={`url(#${id})`} />
          <rect x="130" y="30" width="140" height="220" fill={`url(#${id})`} />
          <circle cx="200" cy="200" r="16" style={{ fill: fg2 }} />
          <circle cx={90 + r() * 40} cy="60" r="12" style={{ fill: fg2 }} />
        </g>
      )}
      {kind === 3 && (
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i}>
              <circle cx={70 + (i % 4) * 85} cy={60 + Math.floor(i / 4) * 90} r="24" style={{ fill: r() > 0.25 ? fg : fg2 }} />
              <circle cx={70 + (i % 4) * 85} cy={60 + Math.floor(i / 4) * 90} r="24" fill={`url(#${id})`} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
