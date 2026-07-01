export type PhaseStatus = "empty" | "generating" | "done" | "error";

export interface PhaseConfig {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  prompt: string;
  systemInstruction: string;
}

export interface GenerationParams {
  model: string;
  temperature: number;
  topP: number;
  maxOutputTokens: number;
}

export interface AppState {
  // API
  apiKey: string;
  setApiKey: (key: string) => void;

  // Source context
  sourceContext: string;
  setSourceContext: (ctx: string) => void;

  // Current phase
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;

  // Phase configs (prompts + system instructions)
  phases: PhaseConfig[];
  updatePhasePrompt: (index: number, prompt: string) => void;
  updatePhaseSystemInstruction: (index: number, instruction: string) => void;
  resetPhasesToDefaults: () => void;

  // Generated content per phase
  content: string[];
  setContent: (index: number, value: string) => void;

  // Phase statuses
  statuses: PhaseStatus[];
  setStatus: (index: number, status: PhaseStatus) => void;

  // Generation params
  params: GenerationParams;
  setParams: (params: Partial<GenerationParams>) => void;

  // Config panel
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;

  // Actions
  generatePhase: (index: number) => Promise<void>;
  copyPhaseContent: (index: number) => Promise<void>;
  exportAll: (format: "md" | "txt") => void;
  resetAll: () => void;
}