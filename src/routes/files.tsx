import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Upload, Search, LayoutGrid, List, FileText, FileArchive, FileCode, Image, Workflow, GitBranch, PenTool, Folder } from "lucide-react";
import { files, type RepoFile } from "@/lib/data";

export const Route = createFileRoute("/files")({
  head: () => ({
    meta: [
      { title: "Open Files Repository — Verdant" },
      { name: "description", content: "Browse and share open-source PDFs, diagrams, templates and notes." },
      { property: "og:title", content: "Open Files Repository — Verdant" },
      { property: "og:description", content: "Open PDFs, diagrams, templates and notes from the community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Files,
});

const icons: Record<RepoFile["type"], typeof FileText> = { PDF: FileText, ZIP: FileArchive, MD: FileCode, PNG: Image, DRAWIO: Workflow, BPMN: GitBranch, EXCALIDRAW: PenTool };
const folders = ["All", ...Array.from(new Set(files.map((f) => f.folder)))];

function Files() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [folder, setFolder] = useState("All");
  const [q, setQ] = useState("");
  const shown = files.filter((f) => (folder === "All" || f.folder === folder) && f.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Files repository</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] tracking-tight text-ink"><span className="font-bold">Open knowledge,</span> <span className="font-serif">free to download, fork and build on.</span></h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:bg-leaf-800"><Upload className="h-4 w-4" /> Upload file</button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="eyebrow mb-3">Folders</p>
          <ul className="space-y-1">
            {folders.map((f) => (
              <li key={f}>
                <button onClick={() => setFolder(f)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${folder === f ? "bg-ink text-primary-foreground" : "text-ink hover:bg-accent"}`}>
                  <Folder className="h-4 w-4" /> {f}
                  <span className="ml-auto text-xs opacity-60">{f === "All" ? files.length : files.filter((x) => x.folder === f).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-paper px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files, PDFs, diagrams…" className="h-10 flex-1 bg-transparent text-sm outline-none" />
            </div>
            <div className="flex rounded-full border border-border bg-paper p-0.5">
              {([["grid", LayoutGrid], ["list", List]] as const).map(([v, I]) => (
                <button key={v} onClick={() => setView(v)} aria-label={v} className={`rounded-full p-2 ${view === v ? "bg-ink text-primary-foreground" : "text-muted-foreground"}`}><I className="h-4 w-4" /></button>
              ))}
            </div>
          </div>

          {view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((f, i) => {
                const I = icons[f.type];
                return (
                  <div key={f.name} className="group rounded-2xl border border-border bg-paper p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="flex h-32 items-center justify-center rounded-xl bg-leaf-50 bg-polygons">
                      <I className="h-10 w-10 text-leaf-600" />
                    </div>
                    <p className="eyebrow mt-4 !text-[0.65rem]">{f.type} · {f.size} · {f.license}</p>
                    <h3 className="mt-1 truncate font-semibold text-ink">{f.name}</h3>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{f.author}</span>
                      <button className="pill !py-1 text-xs"><Download className="h-3.5 w-3.5" /> {f.downloads.toLocaleString()}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-paper">
              {shown.map((f) => {
                const I = icons[f.type];
                return (
                  <div key={f.name} className="flex items-center gap-4 border-b border-dashed border-border px-5 py-4 last:border-0 hover:bg-accent/40">
                    <I className="h-5 w-5 text-leaf-600" />
                    <span className="flex-1 truncate text-ink">{f.name}</span>
                    <span className="hidden w-28 text-sm text-muted-foreground md:block">{f.author}</span>
                    <span className="hidden w-16 font-mono text-xs text-muted-foreground sm:block">{f.size}</span>
                    <span className="hidden w-16 font-mono text-xs text-muted-foreground sm:block">{f.date}</span>
                    <button aria-label="Download"><Download className="h-4 w-4 text-muted-foreground hover:text-ink" /></button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
