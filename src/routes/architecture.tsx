import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { PenTool, Workflow, GitBranch, Box, LayoutTemplate, Maximize2, Save, Share2 } from "lucide-react";
import { ClientOnly, CanvasLoading } from "@/components/ClientOnly";

const ExcalidrawCanvas = lazy(() => import("@/components/ExcalidrawCanvas"));
const BpmnCanvas = lazy(() => import("@/components/BpmnCanvas"));

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
  { id: "excalidraw", name: "Excalidraw", icon: PenTool, desc: "Hand-drawn whiteboard sketches" },
  { id: "drawio", name: "draw.io", icon: Workflow, desc: "Precise cloud & network diagrams" },
  { id: "bpmn", name: "BPMN", icon: GitBranch, desc: "Business process modeling" },
  { id: "isoflow", name: "Isoflow", icon: Box, desc: "Isometric infrastructure maps" },
  { id: "drawcms", name: "DrawCMS", icon: LayoutTemplate, desc: "Diagrams as content" },
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
    isoflow: <Frame title="Isoflow" src="https://isoflow.io/app" />,
    drawcms: <Frame title="DrawCMS" src="https://drawcms.com" />,
  }[tool];

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-12">
      <p className="eyebrow">Architecture studio</p>
      <h1 className="mt-3 max-w-4xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] tracking-tight text-ink">
        <span className="font-bold">Draw the system.</span> <span className="font-serif">Pick the right tool for every diagram — sketches, clouds, processes and isometric maps.</span>
      </h1>

      <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tools.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)} className={`rounded-2xl border p-4 text-left transition ${tool === t.id ? "border-leaf-500 bg-ink text-primary-foreground shadow-lift" : "border-border bg-paper/80 hover:bg-accent/50"}`}>
            <t.icon className={`h-5 w-5 ${tool === t.id ? "text-leaf-300" : "text-leaf-600"}`} />
            <p className="mt-3 font-semibold">{t.name}</p>
            <p className={`text-xs ${tool === t.id ? "text-leaf-200" : "text-muted-foreground"}`}>{t.desc}</p>
          </button>
        ))}
      </div>

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
