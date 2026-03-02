import { create } from "zustand";

interface ConceptStore {
  activeStep: number;
  setActiveStep: (step: number) => void;
  nextStep: (maxSteps: number) => void;
  prevStep: () => void;
  params: Record<string, number>;
  setParam: (name: string, value: number) => void;
  resetParams: (defaults: Record<string, number>) => void;
  reset: () => void;
}

export const useConceptStore = create<ConceptStore>((set, get) => ({
  activeStep: 0,
  setActiveStep: (step) => set({ activeStep: step }),
  nextStep: (maxSteps) => {
    const { activeStep } = get();
    if (activeStep < maxSteps - 1) set({ activeStep: activeStep + 1 });
  },
  prevStep: () => {
    const { activeStep } = get();
    if (activeStep > 0) set({ activeStep: activeStep - 1 });
  },
  params: {},
  setParam: (name, value) =>
    set({ params: { ...get().params, [name]: value } }),
  resetParams: (defaults) => set({ params: defaults }),
  reset: () => set({ activeStep: 0, params: {} }),
}));
