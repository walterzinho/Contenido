"use client";

import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Settings,
  RotateCcw,
  KeyRound,
  FileText,
} from "lucide-react";

export function HeaderBar() {
  const {
    apiKey,
    setApiKey,
    sourceContext,
    setSourceContext,
    showConfig,
    setShowConfig,
    resetAll,
  } = useAppStore();

  return (
    <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">SysCoGenIA</h1>
              <p className="text-xs text-muted-foreground">V6.0 — Orquestador de Contenido</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="text-destructive hover:text-destructive"
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="size-4" />
            <span className="hidden sm:inline">Configurar</span>
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="apiKey" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <KeyRound className="size-3" />
            API Key de Gemini
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Ingresa tu API Key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sourceCtx" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="size-3" />
            Contexto Fuente (Fase 1)
          </Label>
          <Textarea
            id="sourceCtx"
            placeholder="Pega aquí la noticia, enlace o contexto de origen..."
            value={sourceContext}
            onChange={(e) => setSourceContext(e.target.value)}
            className="h-9 min-h-[36px] resize-none text-sm sm:min-h-[36px]"
            rows={1}
          />
        </div>
      </div>
    </header>
  );
}