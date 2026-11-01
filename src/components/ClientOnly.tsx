import { useEffect, useState, type ReactNode } from "react";

export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

export function CanvasLoading() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center text-sm text-muted-foreground">
      Loading canvas…
    </div>
  );
}
