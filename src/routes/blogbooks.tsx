import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookPlus, Check, ArrowUp, ArrowDown, Plus, X, PenLine } from "lucide-react";
import { books, posts } from "@/lib/data";
import { CoverArt } from "@/components/CoverArt";

export const Route = createFileRoute("/blogbooks")({
  head: () => ({
    meta: [
      { title: "Blogbooks & Guides — Verdant" },
      { name: "description", content: "Bind blog posts into guided books readers can follow chapter by chapter." },
      { property: "og:title", content: "Blogbooks & Guides — Verdant" },
      { property: "og:description", content: "Turn blog posts into chapter-by-chapter guides." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Blogbooks,
});

function Blogbooks() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"pick" | "write">("pick");
  const [picked, setPicked] = useState<string[]>([posts[0]!.slug, posts[4]!.slug]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [dTitle, setDTitle] = useState("");
  const [dBody, setDBody] = useState("");
  const [title, setTitle] = useState("My System Design Guide");
  const toggle = (s: string) => setPicked(picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s]);
  const move = (i: number, d: number) => { const r = [...picked]; const j = i + d; if (j < 0 || j >= r.length) return; [r[i], r[j]] = [r[j]!, r[i]!]; setPicked(r); };
  const label = (s: string) => drafts[s] ?? posts.find((p) => p.slug === s)?.title;
  const addDraft = () => { if (!dTitle.trim()) return; const id = `draft-${Date.now()}`; setDrafts({ ...drafts, [id]: dTitle.trim() }); setPicked([...picked, id]); setDTitle(""); setDBody(""); };

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-12">
      <p className="eyebrow">Blogbooks</p>
      <div className="flex flex-wrap items-end justify-between gap-6"><h1 className="mt-3 max-w-4xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] tracking-tight text-ink"><span className="font-bold">Bind your posts</span> <span className="font-serif">into guides people actually finish.</span></h1>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:bg-leaf-800"><BookPlus className="h-4 w-4" /> Create blogbook</button></div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((b, i) => (
          <article key={b.slug} className="group animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-r-xl rounded-l-sm shadow-lift transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
              <CoverArt seed={b.seed} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-y-0 left-0 w-3 bg-ink/25" />
              <div className="absolute inset-x-4 bottom-4 rounded-lg bg-paper/92 p-4 backdrop-blur">
                <h3 className="font-serif text-xl leading-tight text-ink">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.author}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{b.subtitle}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-leaf-500" style={{ width: `${b.progress}%` }} /></div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{b.chapters.length} chapters · {b.progress}% read</p>
          </article>
        ))}
      </div>

      {open && <section className="mt-24 grid animate-rise gap-8 rounded-3xl border border-border bg-paper/85 p-8 shadow-soft lg:grid-cols-[1fr_380px] md:p-12">
        <div>
          <div className="flex items-center gap-3"><BookPlus className="h-6 w-6 text-leaf-600" /><h2 className="text-2xl font-bold text-ink">Create a blogbook</h2><button onClick={() => setOpen(false)} aria-label="Close" className="pill ml-auto !p-1.5"><X className="h-4 w-4" /></button></div>
          <p className="mt-2 text-muted-foreground">Pick posts to become chapters. Or write brand-new chapters right here. Order them, add a title, and publish your guide.</p>
          <div className="mt-6 flex gap-1 rounded-full border border-border bg-paper p-1 w-fit">
            {([["pick", "Bind existing posts"], ["write", "Write a new chapter"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 text-sm ${tab === k ? "bg-ink text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
          {tab === "write" ? (
            <div className="mt-6 rounded-2xl border border-border bg-paper p-5">
              <input value={dTitle} onChange={(e) => setDTitle(e.target.value)} placeholder="Chapter title" className="w-full bg-transparent font-serif text-3xl text-ink outline-none placeholder:text-muted-foreground/60" />
              <textarea value={dBody} onChange={(e) => setDBody(e.target.value)} placeholder="Write this chapter in markdown…" rows={10} className="mt-4 w-full resize-y bg-transparent font-mono text-sm leading-relaxed text-ink outline-none placeholder:text-muted-foreground/60" />
              <button onClick={addDraft} className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-leaf-800"><PenLine className="h-4 w-4" /> Add as chapter</button>
            </div>
          ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {posts.map((p) => {
              const on = picked.includes(p.slug);
              return (
                <button key={p.slug} onClick={() => toggle(p.slug)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${on ? "border-leaf-500 bg-accent" : "border-border hover:bg-muted"}`}>
                  <CoverArt seed={p.seed} className="h-12 w-16 shrink-0 rounded" />
                  <span className="flex-1 text-sm font-medium leading-snug text-ink">{p.title}</span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}</span>
                </button>
              );
            })}
          </div>)}
        </div>
        <div className="rounded-2xl bg-ink p-6 text-primary-foreground">
          <p className="eyebrow !text-leaf-300">Table of contents</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3 w-full bg-transparent font-serif text-3xl leading-tight outline-none" />
          <ol className="mt-6 space-y-2">
            {picked.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-lg bg-primary-foreground/5 px-3 py-2.5 text-sm">
                <span className="font-mono text-xs text-leaf-300">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 truncate">{label(s)}{drafts[s] && <span className="ml-2 font-mono text-[0.6rem] text-leaf-300">NEW</span>}</span>
                <button onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5 text-leaf-300" /></button>
                <button onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5 text-leaf-300" /></button>
                <button onClick={() => setPicked(picked.filter((x) => x !== s))} aria-label="Remove"><X className="h-3.5 w-3.5 text-leaf-300" /></button>
              </li>
            ))}
            {picked.length === 0 && <li className="text-sm text-leaf-200">Select posts to add chapters.</li>}
          </ol>
          <button className="mt-6 w-full rounded-full bg-leaf-300 py-2.5 font-semibold text-ink hover:bg-leaf-200">Publish blogbook</button>
        </div>
      </section>}
    </main>
  );
}
