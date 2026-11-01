import { useState } from "react";
import { Server, Database, Cloud, Users, Trash2, Eraser } from "lucide-react";

const N = 10;
const TW = 64, TH = 32;
const kinds = {
  server: { label: "Server", icon: Server, h: 34, top: "var(--leaf-300)", left: "var(--leaf-500)", right: "var(--leaf-700)" },
  database: { label: "Database", icon: Database, h: 22, top: "var(--leaf-200)", left: "var(--leaf-400)", right: "var(--leaf-600)" },
  cloud: { label: "Cloud / CDN", icon: Cloud, h: 12, top: "var(--leaf-100)", left: "var(--leaf-300)", right: "var(--leaf-500)" },
  users: { label: "Users", icon: Users, h: 48, top: "var(--leaf-400)", left: "var(--leaf-700)", right: "var(--leaf-900)" },
} as const;
type Kind = keyof typeof kinds;
type Node = { x: number; y: number; kind: Kind };

const iso = (x: number, y: number) => ({ cx: (x - y) * (TW / 2), cy: (x + y) * (TH / 2) });

export default function IsoflowCanvas() {
  const [tool, setTool] = useState<Kind | "erase">("server");
  const [nodes, setNodes] = useState<Node[]>([
    { x: 2, y: 3, kind: "users" }, { x: 4, y: 3, kind: "cloud" }, { x: 6, y: 3, kind: "server" }, { x: 6, y: 5, kind: "server" }, { x: 8, y: 4, kind: "database" },
  ]);
  const at = (x: number, y: number) => nodes.find((n) => n.x === x && n.y === y);
  const click = (x: number, y: number) => {
    const rest = nodes.filter((n) => !(n.x === x && n.y === y));
    setNodes(tool === "erase" ? rest : [...rest, { x, y, kind: tool }]);
  };
  const sorted = [...nodes].sort((a, b) => a.x + a.y - (b.x + b.y));
  const ox = N * (TW / 2) + 20, oy = 80;

  return (
    <div className="flex h-full bg-polygons">
      <aside className="flex w-48 shrink-0 flex-col gap-1 border-r border-border bg-paper/90 p-3">
        <p className="eyebrow mb-2">Blocks</p>
        {(Object.keys(kinds) as Kind[]).map((k) => {
          const K = kinds[k];
          return (
            <button key={k} onClick={() => setTool(k)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${tool === k ? "bg-ink text-primary-foreground" : "text-ink hover:bg-accent"}`}>
              <K.icon className="h-4 w-4" /> {K.label}
            </button>
          );
        })}
        <button onClick={() => setTool("erase")} className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${tool === "erase" ? "bg-ink text-primary-foreground" : "text-ink hover:bg-accent"}`}><Eraser className="h-4 w-4" /> Erase</button>
        <button onClick={() => setNodes([])} className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent"><Trash2 className="h-4 w-4" /> Clear all</button>
      </aside>
      <div className="flex-1 overflow-auto">
        <svg viewBox={`0 0 ${N * TW + 40} ${N * TH + 160}`} className="mx-auto h-full max-h-full w-full">
          <g transform={`translate(${ox},${oy})`}>
            {Array.from({ length: N * N }, (_, i) => {
              const x = i % N, y = Math.floor(i / N);
              const { cx, cy } = iso(x, y);
              return (
                <path key={i} onClick={() => click(x, y)} d={`M${cx} ${cy}l${TW / 2} ${TH / 2}l${-TW / 2} ${TH / 2}l${-TW / 2} ${-TH / 2}z`}
                  fill={at(x, y) ? "var(--leaf-100)" : "var(--paper)"} stroke="var(--border)" className="cursor-pointer hover:fill-[var(--leaf-50)]" />
              );
            })}
            {sorted.map((n) => {
              const K = kinds[n.kind];
              const { cx, cy } = iso(n.x, n.y);
              const w = TW / 2 - 8, hh = TH / 2 - 4, top = cy + 4 + hh - K.h;
              return (
                <g key={`${n.x}-${n.y}`} onClick={() => click(n.x, n.y)} className="cursor-pointer">
                  <path d={`M${cx - w} ${top + hh}l${w} ${hh}v${K.h}l${-w} ${-hh}z`} fill={K.left} />
                  <path d={`M${cx + w} ${top + hh}l${-w} ${hh}v${K.h}l${w} ${-hh}z`} fill={K.right} />
                  <path d={`M${cx} ${top}l${w} ${hh}l${-w} ${hh}l${-w} ${-hh}z`} fill={K.top} stroke="var(--leaf-700)" strokeWidth="0.5" />
                  <text x={cx} y={cy + TH + 16} textAnchor="middle" className="fill-[var(--ink)] font-mono text-[9px]">{K.label}</text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
