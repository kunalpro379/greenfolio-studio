import { Link } from "@tanstack/react-router";
import { PenLine, Search } from "lucide-react";

const nav = [
  { to: "/", label: "Blogs" },
  { to: "/architecture", label: "Architecture" },
  { to: "/files", label: "Files" },
  { to: "/blogbooks", label: "Blogbooks" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-ink">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path d="M16 2l12 7v14l-12 7-12-7V9z" fill="var(--leaf-600)" />
        <path d="M16 9l6 3.5v7L16 23l-6-3.5v-7z" fill="var(--paper)" />
        <path d="M16 13l2.5 1.6-1 2.9h-3l-1-2.9z" fill="var(--leaf-800)" />
      </svg>
      <span className="text-lg font-bold tracking-[0.18em]">VERDANT</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6">
        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="pill" activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "pill !bg-accent !border-leaf-300 font-medium" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Logo />
        <div className="flex items-center justify-end gap-2">
          <button className="pill !px-2.5" aria-label="Search"><Search className="h-4 w-4" /></button>
          <Link to="/write" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition hover:bg-leaf-800">
            <PenLine className="h-4 w-4" /> Post
          </Link>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-6 pb-3 md:hidden">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} className="pill shrink-0">{n.label}</Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const cols = {
    Explore: ["Blogs", "Architecture", "Files", "Blogbooks"],
    Create: ["Write a post", "Draw a diagram", "Upload a file", "Start a book"],
    Community: ["Writers", "Guidelines", "Open source", "Changelog"],
    About: ["Mission", "Careers", "Privacy", "Terms"],
  };
  return (
    <footer className="mt-24 border-t border-dashed border-border bg-paper/70">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">A home for engineers to write, draw, share and bind their knowledge.</p>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <p className="text-sm text-muted-foreground">{h}</p>
            <ul className="mt-4 space-y-2.5">
              {items.map((i) => (
                <li key={i} className="text-[15px] text-ink">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
