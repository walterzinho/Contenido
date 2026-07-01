"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Zap,
  Search,
  Image,
  Share2,
  Check,
  Circle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhaseStatus } from "@/lib/types";

const ICONS = [Newspaper, Zap, Search, Image, Share2];

function StatusIcon({ status }: { status: PhaseStatus }) {
  switch (status) {
    case "done":
      return <Check className="size-4 text-emerald-500" />;
    case "generating":
      return <Loader2 className="size-4 text-amber-500 animate-spin" />;
    case "error":
      return <AlertCircle className="size-4 text-destructive" />;
    default:
      return <Circle className="size-3.5 text-muted-foreground/40" />;
  }
}

function phaseEnabled(index: number, statuses: PhaseStatus[], content: string[]): boolean {
  if (index === 0) return true;
  return statuses[index - 1] === "done" && content[index - 1]?.trim().length > 0;
}

export function PhaseSidebar({ className }: { className?: string }) {
  const {
    phases,
    currentPhase,
    setCurrentPhase,
    statuses,
    content,
    generatePhase,
    apiKey,
    sourceContext,
  } = useAppStore();

  const enabled = (i: number) => phaseEnabled(i, statuses, content);
  const canGenerate = (i: number) =>
    apiKey.trim() &&
    (i === 0 ? sourceContext.trim() : enabled(i)) &&
    statuses[i] !== "generating";

  return (
    <nav className={cn("flex flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="flex flex-row gap-2 overflow-x-auto p-1 lg:flex-col lg:overflow-visible">
          {phases.map((phase, i) => {
            const Icon = ICONS[i] || Sparkles;
            const isActive = currentPhase === i;
            const isDisabled = !enabled(i) && statuses[i] !== "done" && statuses[i] !== "generating";

            return (
              <div key={phase.id} className="flex-shrink-0 lg:flex-shrink">
                <button
                  onClick={() => {
                    if (!isDisabled) setCurrentPhase(i);
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "group relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all",
                    "hover:bg-accent/50",
                    isActive && "bg-accent ring-1 ring-ring",
                    isDisabled && "cursor-not-allowed opacity-50",
                    !isDisabled && !isActive && "cursor-pointer"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors",
                      isActive ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-medium leading-tight", isActive && "text-emerald-600 dark:text-emerald-400")}>
                        {phase.shortTitle}
                      </span>
                      <StatusIcon status={statuses[i]} />
                    </div>
                    <p className="mt-0.5 hidden text-xs text-muted-foreground lg:block">
                      {phase.description}
                    </p>
                    {statuses[i] === "done" && (
                      <Badge variant="secondary" className="mt-1 hidden text-[10px] lg:inline-flex">
                        Generada
                      </Badge>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t border-border p-3 pt-4">
        <Button
          className="w-full"
          onClick={() => generatePhase(currentPhase)}
          disabled={!canGenerate(currentPhase)}
          size="lg"
        >
          <Sparkles className="size-4" />
          Generar {phases[currentPhase].shortTitle}
        </Button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          {statuses[currentPhase] === "generating"
            ? "Procesando con IA..."
            : currentPhase > 0 && !enabled(currentPhase)
            ? `Genera primero ${phases[0].shortTitle}`
            : "Revisa antes de pasar a la siguiente fase"}
        </p>
      </div>
    </nav>
  );
}