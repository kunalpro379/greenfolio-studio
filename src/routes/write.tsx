import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Quote, Code, SquareCode, Link2, Image, List, ListOrdered,
  ListChecks, Table, Minus, Paperclip, PenTool, Eye, Columns2, Pencil, X, FileText, Plus, Highlighter, Sigma,
} from "lucide-react";
import { ClientOnly, CanvasLoading } from "@/components/ClientOnly";

const ExcalidrawCanvas = lazy(() => import("@/components/ExcalidrawCanvas"));

export const Route = createFileRoute("/write")({
  head: () => ({
    meta: [
      { title: "Write a story — Verdant" },
      { name: "description", content: "Write in markdown, attach documents and sketch diagrams with Excalidraw." },
      { property: "og:title", content: "Write a story — Verdant" },
      { property: "og:description", content: "A distraction-free markdown editor with diagrams and attachments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Write,
});

const starter = `Start with a hook. Tell readers **why** this matters.

## A section heading

- Write in *markdown*
- Use \`inline code\` and code blocks
- Add a diagram with the pen button

> Good writing is clear thinking made visible.
`;

type Mode = "write" | "split" | "preview";

function Write() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState(starter);
  const [mode, setMode] = useState<Mode>("split");
  const [files, setFiles] = useState<File[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [tags, setTags] = useState<string[]>(["System Design"]);
  const ta = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = body.slice(s, e) || placeholder;
    setBody(body.slice(0, s) + before + sel + after + body.slice(e));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + sel.length); });
  };
  const line = (prefix: string) => {
    const el = ta.current;
    if (!el) return;
    const s = body.lastIndexOf("\n", el.selectionStart - 1) + 1;
    setBody(body.slice(0, s) + prefix + body.slice(s));
    requestAnimationFrame(() => el.focus());
  };
  const insert = (text: string) => {
    const el = ta.current;
    const s = el?.selectionStart ?? body.length;
    setBody(body.slice(0, s) + text + body.slice(s));
  };

  const groups = [
    [
      { icon: Heading1, label: "Heading 1", run: () => line("# ") },
      { icon: Heading2, label: "Heading 2", run: () => line("## ") },
      { icon: Heading3, label: "Heading 3", run: () => line("### ") },
    ],
    [
      { icon: Bold, label: "Bold", run: () => wrap("**") },
      { icon: Italic, label: "Italic", run: () => wrap("*") },
      { icon: Strikethrough, label: "Strikethrough", run: () => wrap("~~") },
      { icon: Highlighter, label: "Highlight", run: () => wrap("==") },
    ],
    [
      { icon: Quote, label: "Quote", run: () => line("> ") },
      { icon: Code, label: "Inline code", run: () => wrap("`") },
      { icon: SquareCode, label: "Code block", run: () => wrap("\n```ts\n", "\n```\n", "code") },
      { icon: Sigma, label: "Math", run: () => wrap("$$", "$$", "E = mc^2") },
    ],
    [
      { icon: List, label: "Bullet list", run: () => line("- ") },
      { icon: ListOrdered, label: "Numbered list", run: () => line("1. ") },
      { icon: ListChecks, label: "Checklist", run: () => line("- [ ] ") },
      { icon: Table, label: "Table", run: () => insert("\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n") },
      { icon: Minus, label: "Divider", run: () => insert("\n---\n") },
    ],
    [
      { icon: Link2, label: "Link", run: () => wrap("[", "](https://)", "link text") },
      { icon: Image, label: "Image", run: () => insert("\n![alt text](https://)\n") },
      { icon: Paperclip, label: "Attach document", run: () => fileInput.current?.click() },
      { icon: PenTool, label: "Draw diagram", run: () => setDrawing(true) },
    ],
  ];

  const words = body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <main className="min-h-screen">
      <div className="sticky top-16 z-30 border-b border-border bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-2.5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-ink">Draft</span>
            <span>·</span>
            <span>Saved</span>
            <span className="hidden font-mono text-xs sm:inline">{words} words · {Math.max(1, Math.round(words / 220))} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-border p-0.5">
              {([["write", Pencil], ["split", Columns2], ["preview", Eye]] as const).map(([m, I]) => (
                <button key={m} onClick={() => setMode(m)} aria-label={m} className={`rounded-full p-1.5 ${mode === m ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-ink"}`}><I className="h-4 w-4" /></button>
              ))}
            </div>
            <button className="rounded-full bg-primary px-5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-leaf-800">Publish</button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-1 px-6 pb-2.5">
          {groups.map((g, gi) => (
            <div key={gi} className="flex items-center gap-0.5 border-r border-border pr-1.5 last:border-0">
              {g.map((t) => (
                <button key={t.label} onClick={t.run} title={t.label} aria-label={t.label} className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-ink">
                  <t.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`mx-auto grid max-w-[1200px] gap-8 px-6 py-12 ${mode === "split" ? "lg:grid-cols-2" : "max-w-[760px]"}`}>
        {mode !== "preview" && (
          <div>
            <textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" rows={1} className="w-full resize-none bg-transparent font-serif text-5xl leading-tight text-ink outline-none placeholder:text-muted-foreground/50" />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tags.map((t) => (
                <span key={t} className="pill !py-1 text-xs">{t}<button onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-3 w-3" /></button></span>
              ))}
              <button onClick={() => setTags([...tags, ["Edge", "Databases", "Security", "Design"][tags.length % 4]!])} className="pill !py-1 text-xs text-muted-foreground"><Plus className="h-3 w-3" /> Tag</button>
            </div>
            <textarea ref={ta} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell your story…" className="mt-8 min-h-[60vh] w-full resize-none bg-transparent font-mono text-[15px] leading-7 text-ink outline-none" />
          </div>
        )}
        {mode !== "write" && (
          <div className={mode === "split" ? "rounded-2xl border border-border bg-paper p-8 shadow-soft" : ""}>
            <p className="eyebrow mb-4">Preview</p>
            <h1 className="font-serif text-4xl leading-tight text-ink">{title || "Untitled story"}</h1>
            <div className="prose-blog mt-6"><ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown></div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1200px] px-6">
        <input ref={fileInput} type="file" multiple hidden onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])} />
        <div onClick={() => fileInput.current?.click()} className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-paper/60 p-8 text-center transition hover:border-leaf-400 hover:bg-accent/40">
          <Paperclip className="mx-auto h-6 w-6 text-leaf-600" />
          <p className="mt-2 font-medium text-ink">Attach documents</p>
          <p className="text-sm text-muted-foreground">PDF, DOCX, ZIP, images — drop or click to browse</p>
        </div>
        {files.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-paper p-3">
                <FileText className="h-5 w-5 text-leaf-600" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm text-ink">{f.name}</p><p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</p></div>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove"><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {drawing && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/40 p-4 backdrop-blur-sm md:p-10">
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-lift">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="font-semibold text-ink">Draw a diagram</p>
              <div className="flex gap-2">
                <button onClick={() => { insert("\n![diagram](excalidraw://diagram-1)\n"); setDrawing(false); }} className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground">Insert into story</button>
                <button onClick={() => setDrawing(false)} className="pill !p-1.5" aria-label="Close"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="relative flex-1">
              <ClientOnly fallback={<CanvasLoading />}><Suspense fallback={<CanvasLoading />}><div className="absolute inset-0"><ExcalidrawCanvas /></div></Suspense></ClientOnly>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
