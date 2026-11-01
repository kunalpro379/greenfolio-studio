import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { PenTool, Workflow, GitBranch, Box, LayoutTemplate, Maximize2, Save, Share2 } from "lucide-react";
import { ClientOnly, CanvasLoading } from "@/components/ClientOnly";

const ExcalidrawCanvas = lazy(() => import("@/components/ExcalidrawCanvas"));
const BpmnCanvas = lazy(() => import("@/components/BpmnCanvas"));
const IsoflowCanvas = lazy(() => import("@/components/IsoflowCanvas"));

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture Studio — Verdant" },
      { name: "description", content: "Draw system design diagrams with Excalidraw, draw.io, BPMN, Isoflow and DrawCMS." },
      { property: "og:title", content: "Architecture Studio — Verdant" },
      { property: "og:description", content: "Every diagram tool for system design in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Architecture,
});

const tools = [
  { id: "excalidraw", name: "Excalidraw", icon: PenTool, desc: "Sketch an idea" },
  { id: "drawio", name: "draw.io", icon: Workflow, desc: "Map a cloud network" },
  { id: "bpmn", name: "BPMN", icon: GitBranch, desc: "Model a process" },
  { id: "isoflow", name: "Isoflow", icon: Box, desc: "Build an isometric map" },
  { id: "drawcms", name: "DrawCMS", icon: LayoutTemplate, desc: "Publish diagrams as content" },
] as const;
type ToolId = (typeof tools)[number]["id"];

function Frame({ src, title }: { src: string; title: string }) {
  return <iframe src={src} title={title} className="h-full w-full border-0 bg-paper" allow="clipboard-read; clipboard-write" />;
}

function Architecture() {
  const [tool, setTool] = useState<ToolId>("excalidraw");
  const [name, setName] = useState("Untitled system design");
  const canvas = {
    excalidraw: <ExcalidrawCanvas />,
    drawio: <Frame title="draw.io" src="https://embed.diagrams.net/?ui=min&spin=1&libraries=1&noExitBtn=1&saveAndExit=0" />,
    bpmn: <BpmnCanvas />,
    isoflow: <IsoflowCanvas />,
    drawcms: (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-polygons p-8 text-center">
        <LayoutTemplate className="h-10 w-10 text-leaf-600" />
        <p className="max-w-md font-serif text-2xl text-ink">DrawCMS doesn't allow being opened inside other sites.</p>
        <p className="max-w-md text-sm text-muted-foreground">Open it in a new tab, build your diagram, then export and drop it into Files.</p>
        <a href="https://drawcms.com" target="_blank" rel="noreferrer" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-leaf-800">Open DrawCMS ↗</a>
      </div>
    ),
  }[tool];

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-12">
      <p className="eyebrow">Architecture studio</p>
      <h1 className="mt-3 max-w-4xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] tracking-tight text-ink">
        <span className="font-bold">Draw the system.</span> <span className="font-serif">Pick the right tool for every diagram — sketches, clouds, processes and isometric maps.</span>
      </h1>

      <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-serif text-[clamp(1.3rem,2.2vw,1.9rem)] text-muted-foreground">
        <span>I want to</span>
        {tools.map((t, i) => (
          <span key={t.id} className="inline-flex items-baseline gap-3">
            <button onClick={() => setTool(t.id)} title={t.name} className={`relative transition ${tool === t.id ? "text-ink" : "hover:text-leaf-700"}`}>
              {t.desc.toLowerCase()}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-leaf-500 transition-all duration-500 ${tool === t.id ? "w-full" : "w-0"}`} />
            </button>
            {i < tools.length - 1 && <span className="text-border">/</span>}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        {(() => { const t = tools.find((x) => x.id === tool)!; return <><t.icon className="h-3.5 w-3.5 text-leaf-600" /> Opening {t.name}</>; })()}
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-paper shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <input value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1 bg-transparent font-medium text-ink outline-none" />
          <div className="flex gap-2">
            <button className="pill !py-1 text-xs"><Save className="h-3.5 w-3.5" /> Save to Files</button>
            <button className="pill !py-1 text-xs"><Share2 className="h-3.5 w-3.5" /> Share</button>
            <button className="pill !p-1.5" aria-label="Fullscreen"><Maximize2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <div className="relative h-[72vh]">
          <ClientOnly fallback={<CanvasLoading />}>
            <Suspense fallback={<CanvasLoading />}><div key={tool} className="absolute inset-0">{canvas}</div></Suspense>
          </ClientOnly>
        </div>
      </div>
    </main>
  );
}
