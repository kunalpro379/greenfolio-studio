export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  authors: string[];
  readTime: string;
  seed: number;
};

export const posts: Post[] = [
  { slug: "edge-agents", title: "Designing edge-native agents that never forget context", excerpt: "How we moved agent memory to the edge, cut cold starts by 70%, and kept every conversation consistent across regions.", date: "Oct 30, 2026", tag: "Engineering", authors: ["Aarav Mehta", "Lina Park"], readTime: "9 min", seed: 1 },
  { slug: "kv-cache", title: "Cross-request KV cache isolation, explained with diagrams", excerpt: "A configuration mismatch exposed cache pages across requests. Here's how we found it and the architecture that prevents it now.", date: "Oct 27, 2026", tag: "Security", authors: ["Kevin Flansburg"], readTime: "12 min", seed: 2 },
  { slug: "range-requests", title: "Serving large files without range-request tuning", excerpt: "Naive byte-range caching wastes gigabytes. We rebuilt our cache layer to coordinate partial fetches automatically.", date: "Oct 23, 2026", tag: "Infrastructure", authors: ["Matthew Gumport"], readTime: "7 min", seed: 3 },
  { slug: "source-control", title: "Redesigning source control for a hundred merges a minute", excerpt: "As merges per day grew tenfold, source control became our bottleneck. We migrated to an in-house system in five months.", date: "Oct 13, 2026", tag: "Engineering", authors: ["Mamta Patil", "Dan Jones", "Sven Sauleau"], readTime: "14 min", seed: 4 },
  { slug: "system-design-queues", title: "A field guide to queues in system design interviews", excerpt: "Kafka, SQS, Redis streams — when each one wins, drawn out box by box with real tradeoffs.", date: "Oct 9, 2026", tag: "System Design", authors: ["Rupert Carr"], readTime: "11 min", seed: 5 },
  { slug: "offline-q3", title: "What took the Internet offline in Q3 2026", excerpt: "Power failures, natural disasters and shutdowns — an examination of global disruptions observed this quarter.", date: "Oct 5, 2026", tag: "Research", authors: ["Lai Yi Ohlsen"], readTime: "8 min", seed: 6 },
  { slug: "bpmn-flows", title: "Modeling payment flows with BPMN before writing code", excerpt: "Why our team now draws every money-moving process first, and how it caught three bugs before launch.", date: "Sep 28, 2026", tag: "Product", authors: ["Celso Martinho"], readTime: "6 min", seed: 7 },
  { slug: "isometric-infra", title: "Drawing your infrastructure in isometric, on purpose", excerpt: "Isometric diagrams make on-call onboarding faster. Our template, our mistakes, and a free starter kit.", date: "Sep 21, 2026", tag: "Design", authors: ["Michelle Chen", "Bas Westerbaan"], readTime: "5 min", seed: 8 },
  { slug: "markdown-first", title: "Markdown-first writing for engineering teams", excerpt: "Plain text, versioned docs, diagrams as code. A pragmatic setup that scales from one writer to five hundred.", date: "Sep 14, 2026", tag: "Writing", authors: ["Enrique Somoza"], readTime: "4 min", seed: 9 },
];

export type RepoFile = { name: string; type: "PDF" | "ZIP" | "MD" | "DRAWIO" | "PNG" | "BPMN" | "EXCALIDRAW"; size: string; author: string; downloads: number; date: string; license: string; folder: string };

export const files: RepoFile[] = [
  { name: "Distributed Systems Cheatsheet.pdf", type: "PDF", size: "2.4 MB", author: "Aarav Mehta", downloads: 4210, date: "Oct 29", license: "CC BY 4.0", folder: "System Design" },
  { name: "URL Shortener Architecture.drawio", type: "DRAWIO", size: "184 KB", author: "Rupert Carr", downloads: 1893, date: "Oct 27", license: "MIT", folder: "Diagrams" },
  { name: "Order Checkout Process.bpmn", type: "BPMN", size: "42 KB", author: "Celso Martinho", downloads: 712, date: "Oct 25", license: "Apache-2.0", folder: "Processes" },
  { name: "Rate limiter sketch.excalidraw", type: "EXCALIDRAW", size: "96 KB", author: "Lina Park", downloads: 2301, date: "Oct 22", license: "MIT", folder: "Diagrams" },
  { name: "CAP theorem notes.md", type: "MD", size: "12 KB", author: "Mamta Patil", downloads: 3120, date: "Oct 20", license: "CC0", folder: "Notes" },
  { name: "Kubernetes starter templates.zip", type: "ZIP", size: "8.1 MB", author: "Dan Jones", downloads: 980, date: "Oct 18", license: "MIT", folder: "Templates" },
  { name: "Isometric cloud icon set.png", type: "PNG", size: "1.2 MB", author: "Michelle Chen", downloads: 5402, date: "Oct 14", license: "CC BY 4.0", folder: "Assets" },
  { name: "Designing Data-Intensive Notes.pdf", type: "PDF", size: "5.7 MB", author: "Sven Sauleau", downloads: 6110, date: "Oct 10", license: "CC BY-SA", folder: "Notes" },
];

export type Book = { slug: string; title: string; subtitle: string; author: string; chapters: string[]; seed: number; progress: number };

export const books: Book[] = [
  { slug: "system-design", title: "System Design, Drawn", subtitle: "From one server to a planet-scale platform", author: "Rupert Carr", chapters: ["Scaling 101", "Caches & CDNs", "Queues", "Databases", "Consistency", "Case studies"], seed: 11, progress: 64 },
  { slug: "edge", title: "The Edge Handbook", subtitle: "Building apps that run everywhere", author: "Aarav Mehta", chapters: ["Why edge", "Workers", "State at the edge", "Observability"], seed: 12, progress: 30 },
  { slug: "writing", title: "Engineers Who Write", subtitle: "A guide to clear technical blogs", author: "Enrique Somoza", chapters: ["Finding the story", "Structure", "Diagrams", "Editing", "Publishing"], seed: 13, progress: 100 },
  { slug: "security", title: "Security in Practice", subtitle: "Threat models you can actually use", author: "Kevin Flansburg", chapters: ["Threat modeling", "Isolation", "Secrets", "Incident response"], seed: 14, progress: 12 },
];
