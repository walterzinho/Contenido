import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PhaseStatus, AppState, GenerationParams } from "./types";
import { DEFAULT_PHASES, DEFAULT_PARAMS } from "./default-prompts";
import { toast } from "sonner";

let _rehydrated = false;
function onRehydrate() {
  _rehydrated = true;
}
export function useHydrated() {
  return _rehydrated;
}

function buildPrompt(phases: AppState["phases"], index: number, sourceContext: string, content: string[]): string {
  let prompt = phases[index].prompt;
  prompt = prompt.replace("{ctx}", sourceContext || "Sin contexto fuente");
  if (index > 0) {
    prompt = prompt.replace("{ref}", content[index - 1] || "Sin contenido previo. Genera contenido genérico.");
  }
  return prompt;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // API
      apiKey: "",
      setApiKey: (key) => set({ apiKey: key }),

      // Source
      sourceContext: "",
      setSourceContext: (ctx) => set({ sourceContext: ctx }),

      // Phase navigation
      currentPhase: 0,
      setCurrentPhase: (phase) => set({ currentPhase: phase }),

      // Phases config
      phases: DEFAULT_PHASES,
      updatePhasePrompt: (index, prompt) =>
        set((s) => {
          const phases = [...s.phases];
          phases[index] = { ...phases[index], prompt };
          return { phases };
        }),
      updatePhaseSystemInstruction: (index, instruction) =>
        set((s) => {
          const phases = [...s.phases];
          phases[index] = { ...phases[index], systemInstruction: instruction };
          return { phases };
        }),
      resetPhasesToDefaults: () =>
        set({
          phases: DEFAULT_PHASES,
          content: ["", "", "", "", ""],
          statuses: ["empty", "empty", "empty", "empty", "empty"] as PhaseStatus[],
        }),

      // Content per phase
      content: ["", "", "", "", ""],
      setContent: (index, value) =>
        set((s) => {
          const content = [...s.content];
          content[index] = value;
          const statuses = [...s.statuses];
          if (value.trim()) statuses[index] = "done";
          return { content, statuses };
        }),

      // Statuses
      statuses: ["empty", "empty", "empty", "empty", "empty"] as PhaseStatus[],
      setStatus: (index, status) =>
        set((s) => {
          const statuses = [...s.statuses];
          statuses[index] = status;
          return { statuses };
        }),

      // Params
      params: DEFAULT_PARAMS,
      setParams: (partial) =>
        set((s) => ({ params: { ...s.params, ...partial } })),

      // Config panel
      showConfig: false,
      setShowConfig: (show) => set({ showConfig: show }),

      // Generate phase
      generatePhase: async (index) => {
        const { apiKey, sourceContext, phases, content, params, setStatus, setContent, setCurrentPhase } = get();

        if (!apiKey.trim()) {
          toast.error("API Key requerida", { description: "Ingresa tu API Key de Gemini en el campo superior." });
          return;
        }

        if (index > 0 && !content[index - 1]?.trim()) {
          toast.error("Fase anterior vacía", { description: `Genera primero la ${phases[index - 1].title} antes de continuar.` });
          return;
        }

        if (index === 0 && !sourceContext.trim()) {
          toast.error("Contexto fuente vacío", { description: "Ingresa el contexto o noticia fuente antes de generar." });
          return;
        }

        setCurrentPhase(index);
        setStatus(index, "generating");
        toast.info(`Generando ${phases[index].shortTitle}...`, { description: "Esto puede tomar unos segundos." });

        const prompt = buildPrompt(phases, index, sourceContext, content);

        // Retry logic with exponential backoff
        const maxRetries = 3;
        let lastError = "";

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const res = await fetch("/api/gemini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                apiKey,
                model: params.model,
                temperature: params.temperature,
                topP: params.topP,
                maxOutputTokens: params.maxOutputTokens,
                systemInstruction: phases[index].systemInstruction,
                prompt,
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              const errMsg = data.error?.message || data.error || `Error HTTP ${res.status}`;
              if (res.status === 429) {
                lastError = "Límite de cuotas alcanzado. Espera unos segundos e intenta de nuevo.";
                if (attempt < maxRetries) {
                  await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
                  continue;
                }
              } else if (res.status === 403) {
                lastError = "API Key inválida o sin permisos. Verifica tu clave.";
                break;
              } else {
                lastError = errMsg;
                if (attempt < maxRetries) {
                  await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
                  continue;
                }
              }
              setStatus(index, "error");
              toast.error(`Error en ${phases[index].shortTitle}`, { description: lastError });
              return;
            }

            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
              const blockReason = data.candidates?.[0]?.finishReason;
              lastError = blockReason ? `Contenido bloqueado: ${blockReason}` : "Respuesta vacía de la API";
              setStatus(index, "error");
              toast.error(`Error en ${phases[index].shortTitle}`, { description: lastError });
              return;
            }

            setContent(index, generatedText);
            toast.success(`${phases[index].shortTitle} generada`, {
              description: index < 4 ? `Continuar a ${phases[index + 1].shortTitle}?` : "Fase final completada",
              action: index < 4
                ? {
                    label: "Siguiente fase",
                    onClick: () => {
                      setCurrentPhase(index + 1);
                    },
                  }
                : undefined,
            });
            return;
          } catch (err) {
            lastError = err instanceof Error ? err.message : "Error de conexión";
            if (attempt < maxRetries) {
              await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
              continue;
            }
          }
        }

        setStatus(index, "error");
        toast.error(`Error en ${phases[index].shortTitle}`, { description: lastError });
      },

      // Copy phase content as plain text
      copyPhaseContent: async (index) => {
        const { content } = get();
        const text = content[index];
        if (!text?.trim()) {
          toast.error("Sin contenido", { description: "No hay contenido para copiar en esta fase." });
          return;
        }
        try {
          await navigator.clipboard.writeText(text);
          toast.success("Copiado al portapapeles", { description: `${get().phases[index].shortTitle} copiada como texto plano.` });
        } catch {
          toast.error("Error al copiar", { description: "Tu navegador no permite copiar al portapapeles." });
        }
      },

      // Export all
      exportAll: (format: "md" | "txt") => {
        const { phases, content, sourceContext } = get();
        let fileContent = "";
        let filename = "";
        let mimeType = "";

        if (format === "md") {
          fileContent = `# Informe de Orquestación\n\n## Contexto Fuente\n${sourceContext}\n\n---\n\n`;
          phases.forEach((p, i) => {
            fileContent += `## ${p.title}\n\n${content[i] || "_Sin generar_"}\n\n---\n\n`;
          });
          filename = "informe-syscogenia.md";
          mimeType = "text/markdown";
        } else {
          fileContent = `INFORME DE ORQUESTACIÓN - SysCoGenIA V6.0\n${"=".repeat(50)}\n\nCONTEXTO FUENTE:\n${sourceContext}\n\n${"=".repeat(50)}\n\n`;
          phases.forEach((p, i) => {
            fileContent += `${"=".repeat(50)}\n${p.title.toUpperCase()}\n${"=".repeat(50)}\n\n${content[i] || "(Sin generar)"}\n\n`;
          });
          filename = "informe-syscogenia.txt";
          mimeType = "text/plain";
        }

        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exportado como ${format.toUpperCase()}`, { description: `Archivo ${filename} descargado.` });
      },

      // Reset all
      resetAll: () =>
        set({
          phases: DEFAULT_PHASES,
          content: ["", "", "", "", ""],
          statuses: ["empty", "empty", "empty", "empty", "empty"] as PhaseStatus[],
          currentPhase: 0,
        }),
    }),
    {
      name: "syscogenia-v6",
      skipHydration: true,
      onRehydrateStorage: () => onRehydrate,
      partialize: (state) => ({
        apiKey: state.apiKey,
        sourceContext: state.sourceContext,
        phases: state.phases,
        content: state.content,
        statuses: state.statuses,
        params: state.params,
      }),
    }
  )
);