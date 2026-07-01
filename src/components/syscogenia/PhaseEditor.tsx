"use client";

import { useState, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Pencil,
  Check,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PhaseEditor() {
  const {
    phases,
    currentPhase,
    content,
    setContent,
    statuses,
    setCurrentPhase,
    generatePhase,
    copyPhaseContent,
    apiKey,
    sourceContext,
  } = useAppStore();

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const phase = phases[currentPhase];
  const phaseContent = content[currentPhase];
  const status = statuses[currentPhase];
  const isLoading = status === "generating";
  const isDone = status === "done";
  const hasError = status === "error";
  const isEmpty = status === "empty" || !phaseContent?.trim();

  const startEdit = useCallback(() => {
    setEditValue(phaseContent);
    setEditing(true);
  }, [phaseContent]);

  const saveEdit = useCallback(() => {
    setContent(currentPhase, editValue);
    setEditing(false);
  }, [currentPhase, editValue, setContent]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
  }, []);

  const goNext = useCallback(() => {
    if (currentPhase < 4) {
      setCurrentPhase(currentPhase + 1);
      setEditing(false);
    }
  }, [currentPhase, setCurrentPhase]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Phase header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">{phase.title}</h2>
          <Badge variant={isDone ? "default" : "secondary"} className={cn(isDone && "bg-emerald-600 text-white hover:bg-emerald-600")}>
            {status === "generating" && "Generando..."}
            {status === "done" && "Completada"}
            {status === "error" && "Error"}
            {status === "empty" && "Pendiente"}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {isDone && !editing && (
            <>
              <Button variant="ghost" size="icon" onClick={startEdit} title="Editar contenido">
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => copyPhaseContent(currentPhase)} title="Copiar texto plano">
                <Copy className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => generatePhase(currentPhase)} title="Regenerar">
                <ArrowRight className="size-4" />
              </Button>
            </>
          )}
          {editing && (
            <>
              <Button variant="ghost" size="icon" onClick={saveEdit} title="Guardar cambios">
                <Check className="size-4 text-emerald-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={cancelEdit} title="Cancelar">
                <X className="size-4 text-destructive" />
              </Button>
            </>
          )}
          {isDone && currentPhase < 4 && !editing && (
            <Button variant="outline" size="sm" onClick={goNext} className="ml-2">
              Siguiente fase
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="space-y-4 p-6">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2 pt-4 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Generando contenido con IA...</span>
            </div>
          </div>
        )}

        {hasError && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <p className="text-sm text-destructive">
              Hubo un error al generar esta fase. Intenta de nuevo.
            </p>
            <Button variant="outline" size="sm" onClick={() => generatePhase(currentPhase)}>
              <ArrowRight className="size-4" />
              Reintentar
            </Button>
          </div>
        )}

        {isEmpty && !isLoading && !hasError && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ArrowRight className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {currentPhase === 0
                ? "Ingresa el contexto fuente y haz clic en Generar."
                : `Esperando generación de ${phase.shortTitle}.`}
            </p>
            {currentPhase === 0 && (
              <p className="max-w-sm text-xs text-muted-foreground/70">
                Pega una noticia, enlace o información de referencia en el campo &quot;Contexto Fuente&quot; de la parte superior.
              </p>
            )}
          </div>
        )}

        {editing && (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-full min-h-[400px] resize-none rounded-none border-0 p-4 font-mono text-sm focus-visible:ring-0 sm:p-6"
            placeholder="Escribe o edita el contenido de esta fase..."
          />
        )}

        {isDone && !editing && !isLoading && (
          <ScrollArea className="h-full">
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 sm:p-6 prose-headings:font-semibold prose-h2:text-lg prose-h3:text-base prose-p:leading-relaxed prose-li:leading-relaxed">
              <ReactMarkdown>{phaseContent}</ReactMarkdown>
            </div>
          </ScrollArea>
        )}
      </div>
    </main>
  );
}