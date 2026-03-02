import { create } from "zustand";
import type { GraphFunction, SliderParam, ViewSettings } from "@/types/explore";
import { parseExpression, hasYVariable } from "@/utils/mathParser";
import { getNextColor } from "@/engine/NeonMaterial";

interface ExploreStore {
  functions: GraphFunction[];
  addFunction: (expression: string) => void;
  removeFunction: (id: string) => void;
  toggleFunctionVisibility: (id: string) => void;

  sliderParams: Record<string, SliderParam>;
  setSliderValue: (name: string, value: number) => void;

  viewSettings: ViewSettings;
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleLabels: () => void;
  toggleZAxis: () => void;

  inputValue: string;
  setInputValue: (v: string) => void;

  parseError: string | null;
}

let colorIndex = 0;

export const useExploreStore = create<ExploreStore>((set, get) => ({
  functions: [],

  addFunction: (expression: string) => {
    const result = parseExpression(expression);
    if (!result.success) {
      set({ parseError: result.error });
      return;
    }

    const idx = colorIndex++;
    const color = getNextColor(idx);
    const fn: GraphFunction = {
      id: crypto.randomUUID(),
      expression,
      normalizedExpr: result.normalizedExpr,
      compiled: result.compiled,
      color,
      colorIndex: idx,
      visible: true,
      parameters: result.parameters,
      is3D: hasYVariable(result.normalizedExpr),
    };

    // Add new slider params (keep existing values)
    const currentParams = get().sliderParams;
    const newParams = { ...currentParams };
    for (const paramName of result.parameters) {
      if (!(paramName in newParams)) {
        newParams[paramName] = {
          name: paramName,
          value: 1,
          min: -10,
          max: 10,
          step: 0.1,
        };
      }
    }

    set({
      functions: [...get().functions, fn],
      sliderParams: newParams,
      inputValue: "",
      parseError: null,
    });
  },

  removeFunction: (id: string) => {
    const fns = get().functions.filter((f) => f.id !== id);

    // Recalculate which params are still needed
    const usedParams = new Set(fns.flatMap((f) => f.parameters));
    const currentParams = get().sliderParams;
    const newParams: Record<string, SliderParam> = {};
    for (const [name, param] of Object.entries(currentParams)) {
      if (usedParams.has(name)) {
        newParams[name] = param;
      }
    }

    set({ functions: fns, sliderParams: newParams });
  },

  toggleFunctionVisibility: (id: string) => {
    set({
      functions: get().functions.map((f) =>
        f.id === id ? { ...f, visible: !f.visible } : f,
      ),
    });
  },

  sliderParams: {},

  setSliderValue: (name: string, value: number) => {
    const params = get().sliderParams;
    if (!(name in params)) return;
    set({
      sliderParams: {
        ...params,
        [name]: { ...params[name], value },
      },
    });
  },

  viewSettings: {
    showGrid: true,
    showAxes: true,
    showLabels: true,
    showZAxis: false,
    xRange: [-100, 100],
    yRange: [-100, 100],
    resolution: 5000,
  },

  toggleGrid: () =>
    set({
      viewSettings: { ...get().viewSettings, showGrid: !get().viewSettings.showGrid },
    }),
  toggleAxes: () =>
    set({
      viewSettings: { ...get().viewSettings, showAxes: !get().viewSettings.showAxes },
    }),
  toggleLabels: () =>
    set({
      viewSettings: {
        ...get().viewSettings,
        showLabels: !get().viewSettings.showLabels,
      },
    }),
  toggleZAxis: () =>
    set({
      viewSettings: {
        ...get().viewSettings,
        showZAxis: !get().viewSettings.showZAxis,
      },
    }),

  inputValue: "",
  setInputValue: (v: string) => set({ inputValue: v, parseError: null }),

  parseError: null,
}));
