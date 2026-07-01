"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { DEFAULT_PHASES, AVAILABLE_MODELS } from "@/lib/default-prompts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  RotateCcw,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export function ConfigPanel() {
  const {
    phases,
    params,
    showConfig,
    setShowConfig,
    updatePhasePrompt,
    updatePhaseSystemInstruction,
    setParams,
    resetPhasesToDefaults,
  } = useAppStore();

  const [localPrompts, setLocalPrompts] = useState(
    phases.map((p) => ({ prompt: p.prompt, systemInstruction: p.systemInstruction }))
  );

  const handleSavePrompts = () => {
    localPrompts.forEach((lp, i) => {
      updatePhasePrompt(i, lp.prompt);
      updatePhaseSystemInstruction(i, lp.systemInstruction);
    });
    setShowConfig(false);
    toast.success("Prompts guardados", { description: "Los cambios se aplicarán en la próxima generación." });
  };

  const handleResetPrompts = () => {
    setLocalPrompts(
      DEFAULT_PHASES.map((p) => ({ prompt: p.prompt, systemInstruction: p.systemInstruction }))
    );
    resetPhasesToDefaults();
    toast.info("Prompts restaurados", { description: "Se restauraron los prompts de fábrica." });
  };

  return (
    <Sheet open={showConfig} onOpenChange={setShowConfig}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Configuración
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="model" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="model">Modelo y Parámetros</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Modelo de IA</Label>
              <Select
                value={params.model}
                onValueChange={(v) => setParams({ model: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div>
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Temperatura: {params.temperature.toFixed(1)}
              </Label>
              <p className="text-xs text-muted-foreground">
                Más baja = más preciso. Más alta = más creativo.
              </p>
              <Slider
                value={[params.temperature]}
                onValueChange={([v]) => setParams({ temperature: v })}
                min={0}
                max={2}
                step={0.1}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Preciso (0)</span>
                <span>Creativo (2)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Top P: {params.topP.toFixed(1)}
              </Label>
              <Slider
                value={[params.topP]}
                onValueChange={([v]) => setParams({ topP: v })}
                min={0}
                max={1}
                step={0.05}
              />
            </div>

            <div className="space-y-2">
              <Label>Tokens máximos de salida</Label>
              <Input
                type="number"
                value={params.maxOutputTokens}
                onChange={(e) => setParams({ maxOutputTokens: parseInt(e.target.value) || 8192 })}
                min={256}
                max={65536}
                step={1024}
              />
              <p className="text-xs text-muted-foreground">
                Máximo de tokens en la respuesta. Recomendado: 8192
              </p>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Edita los prompts y system instructions de cada fase.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetPrompts}>
                <RotateCcw className="size-3.5" />
                Restaurar
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-6 pr-4">
                {phases.map((phase, i) => (
                  <div key={phase.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{phase.title}</h4>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">System Instruction (Rol)</Label>
                      <Textarea
                        value={localPrompts[i].systemInstruction}
                        onChange={(e) => {
                          const updated = [...localPrompts];
                          updated[i] = { ...updated[i], systemInstruction: e.target.value };
                          setLocalPrompts(updated);
                        }}
                        className="min-h-[80px] resize-y text-xs"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Prompt (usa {"{ctx}"} para contexto fuente, {"{ref}"} para contenido de fase anterior)
                      </Label>
                      <Textarea
                        value={localPrompts[i].prompt}
                        onChange={(e) => {
                          const updated = [...localPrompts];
                          updated[i] = { ...updated[i], prompt: e.target.value };
                          setLocalPrompts(updated);
                        }}
                        className="min-h-[150px] resize-y text-xs"
                        rows={6}
                      />
                    </div>

                    {i < phases.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="sticky bottom-0 mt-4 border-t border-border bg-background pt-4">
              <Button className="w-full" onClick={handleSavePrompts}>
                <Save className="size-4" />
                Guardar Prompts
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}