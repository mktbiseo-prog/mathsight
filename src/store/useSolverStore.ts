import { create } from "zustand";
import type { SolveResult, PyodideStatus } from "@/engine/sympy-bridge";
import type { ParsedProblem } from "@/engine/step-generator";

interface HistoryEntry {
  problem: ParsedProblem;
  solution: SolveResult;
}

interface SolverStore {
  pyodideStatus: PyodideStatus;
  loadingMessage: string;
  loadingPercent: number;
  setPyodideProgress: (
    status: PyodideStatus,
    message: string,
    percent: number,
  ) => void;

  inputValue: string;
  setInputValue: (v: string) => void;

  currentProblem: ParsedProblem | null;
  solution: SolveResult | null;
  isComputing: boolean;
  error: string | null;

  activeStepIndex: number;
  setActiveStepIndex: (i: number) => void;

  history: HistoryEntry[];

  startComputation: (problem: ParsedProblem) => void;
  setSolution: (result: SolveResult) => void;
  setError: (error: string) => void;
  clearSolution: () => void;
}

export const useSolverStore = create<SolverStore>((set, get) => ({
  pyodideStatus: "idle",
  loadingMessage: "",
  loadingPercent: 0,
  setPyodideProgress: (status, message, percent) =>
    set({ pyodideStatus: status, loadingMessage: message, loadingPercent: percent }),

  inputValue: "",
  setInputValue: (v) => set({ inputValue: v, error: null }),

  currentProblem: null,
  solution: null,
  isComputing: false,
  error: null,

  activeStepIndex: -1,
  setActiveStepIndex: (i) => set({ activeStepIndex: i }),

  history: [],

  startComputation: (problem) =>
    set({
      currentProblem: problem,
      solution: null,
      isComputing: true,
      error: null,
      activeStepIndex: -1,
    }),

  setSolution: (result) => {
    const problem = get().currentProblem;
    const history = problem
      ? [{ problem, solution: result }, ...get().history].slice(0, 20)
      : get().history;
    set({ solution: result, isComputing: false, history });
  },

  setError: (error) => set({ error, isComputing: false }),

  clearSolution: () =>
    set({
      currentProblem: null,
      solution: null,
      error: null,
      activeStepIndex: -1,
    }),
}));
