import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Upload, Search, FileText, FileArchive, FileCode, Image, Workflow, GitBranch, PenTool, Folder, FolderOpen, ChevronRight, HardDrive } from "lucide-react";
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
const folders = Array.from(new Set(files.map((f) => f.folder)));

function Files() {
  const [folder, setFolder] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const inDir = files.filter((f) => (folder ? f.folder === folder : true) && f.name.toLowerCase().includes(q.toLowerCase()));
  const shownFiles = folder || q ? inDir : [];
  const shownFolders = folder || q ? [] : folders;

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Files repository</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] tracking-tight text-ink"><span className="font-bold">Open knowledge,</span> <span className="font-serif">free to download, fork and build on.</span></h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:bg-leaf-800"><Upload className="h-4 w-4" /> Upload file</button>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-paper/90 shadow-soft lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-border bg-muted/40 p-4 lg:border-b-0 lg:border-r">
          <button onClick={() => setFolder(null)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${folder === null ? "bg-ink text-primary-foreground" : "text-ink hover:bg-accent"}`}>
            <HardDrive className="h-4 w-4" /> Repository
          </button>
          <ul className="mt-1 ml-4 border-l border-dashed border-border pl-2">
            {folders.map((f) => (
              <li key={f}>
                <button onClick={() => setFolder(f)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${folder === f ? "bg-accent font-medium text-ink" : "text-muted-foreground hover:text-ink"}`}>
                  {folder === f ? <FolderOpen className="h-4 w-4 text-leaf-600" /> : <Folder className="h-4 w-4" />} {f}
                  <span className="ml-auto text-xs opacity-60">{files.filter((x) => x.folder === f).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
            <nav className="flex items-center gap-1 text-sm">
              <button onClick={() => setFolder(null)} className="text-muted-foreground hover:text-ink">Repository</button>
              {folder && <><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-medium text-ink">{folder}</span></>}
            </nav>
            <div className="ml-auto flex w-full items-center gap-2 rounded-full border border-border bg-paper px-3 sm:w-72">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in this folder…" className="h-9 flex-1 bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground sm:grid-cols-[1fr_140px_80px_70px_40px]">
            <span>Name</span><span className="hidden sm:block">Author</span><span className="hidden sm:block">Size</span><span className="hidden sm:block">Date</span><span />
          </div>
          <div className="divide-y divide-dashed divide-border border-t border-border">
            {shownFolders.map((f) => (
              <button key={f} onDoubleClick={() => setFolder(f)} onClick={() => setFolder(f)} className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 text-left hover:bg-accent/50 sm:grid-cols-[1fr_140px_80px_70px_40px]">
                <span className="flex items-center gap-3 text-ink"><Folder className="h-5 w-5 fill-leaf-200 text-leaf-600" /> {f}</span>
                <span className="hidden text-sm text-muted-foreground sm:block">—</span>
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">{files.filter((x) => x.folder === f).length} items</span>
                <span className="hidden sm:block" />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            {shownFiles.map((f) => {
              const I = icons[f.type];
              return (
                <div key={f.name} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 hover:bg-accent/40 sm:grid-cols-[1fr_140px_80px_70px_40px]">
                  <span className="flex min-w-0 items-center gap-3 text-ink"><I className="h-5 w-5 shrink-0 text-leaf-600" /><span className="truncate">{f.name}</span><span className="hidden rounded bg-muted px-1.5 font-mono text-[0.6rem] text-muted-foreground md:inline">{f.license}</span></span>
                  <span className="hidden truncate text-sm text-muted-foreground sm:block">{f.author}</span>
                  <span className="hidden font-mono text-xs text-muted-foreground sm:block">{f.size}</span>
                  <span className="hidden font-mono text-xs text-muted-foreground sm:block">{f.date}</span>
                  <button aria-label="Download"><Download className="h-4 w-4 text-muted-foreground hover:text-ink" /></button>
                </div>
              );
            })}
            {shownFolders.length + shownFiles.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted-foreground">Nothing here yet.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
