"use client";

import { useEffect, useState } from "react";
import { HeaderBar } from "@/components/syscogenia/HeaderBar";
import { PhaseSidebar } from "@/components/syscogenia/PhaseSidebar";
import { PhaseEditor } from "@/components/syscogenia/PhaseEditor";
import { ConfigPanel } from "@/components/syscogenia/ConfigPanel";
import { ExportDropdown } from "@/components/syscogenia/ExportDropdown";
import { useAppStore, useHydrated } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const hydrated = useHydrated();
  const showConfig = useAppStore((s) => s.showConfig);

  useEffect(() => {
    useAppStore.persist.rehydrate().then(() => setMounted(true));
  }, []);

  // Show nothing until client-side hydration completes
  if (!mounted || !hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando SysCoGenIA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderBar />
      <PhaseProgressBar />
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="flex-shrink-0 border-b border-border lg:w-64 lg:border-b-0 lg:border-r">
          <div className="lg:h-full lg:p-3">
            <PhaseSidebar />
          </div>
        </aside>
        <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-4">
          <div className="mb-2 flex items-center justify-end">
            <ExportDropdown />
          </div>
          <div className="min-h-0 flex-1">
            <PhaseEditor />
          </div>
        </div>
      </div>
      <ConfigPanel />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

function PhaseProgressBar() {
  const statuses = useAppStore((s) => s.statuses);
  const phases = useAppStore((s) => s.phases);
  const doneCount = statuses.filter((s) => s === "done").length;

  return (
    <div className="border-b border-border bg-muted/30 px-4 py-2 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {statuses.map((status, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  status === "done"
                    ? "bg-emerald-500"
                    : status === "generating"
                    ? "bg-amber-500 animate-pulse"
                    : status === "error"
                    ? "bg-destructive"
                    : "bg-muted-foreground/20"
                }`}
                title={`${phases[i].shortTitle}: ${
                  status === "done" ? "Completada" : status === "generating" ? "Generando..." : status === "error" ? "Error" : "Pendiente"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {doneCount}/5 fases
          </span>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {doneCount === 5
            ? "Pipeline completo — listo para exportar"
            : doneCount === 0
            ? "Comienza generando la Noticia"
            : `Siguiente: ${phases[doneCount].shortTitle}`}
        </span>
      </div>
    </div>
  );
}