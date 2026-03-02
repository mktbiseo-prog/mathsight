import { ChevronLeft, ChevronRight } from "lucide-react";
import { KaTeX } from "@/components/common/KaTeX";
import { useConceptStore } from "@/store/useConceptStore";
import { cn } from "@/utils/cn";
import type { ConceptData } from "@/types/concept";

interface ConceptPlayerProps {
  concept: ConceptData;
}

export function ConceptPlayer({ concept }: ConceptPlayerProps) {
  const activeStep = useConceptStore((s) => s.activeStep);
  const setActiveStep = useConceptStore((s) => s.setActiveStep);
  const nextStep = useConceptStore((s) => s.nextStep);
  const prevStep = useConceptStore((s) => s.prevStep);

  const current = concept.steps[activeStep];
  const total = concept.steps.length;

  return (
    <div className="flex flex-col h-full">
      {/* Step list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {concept.steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-lg transition-all border-l-2",
              activeStep === i
                ? "border-l-primary bg-primary-light dark:bg-primary/10"
                : "border-l-transparent hover:bg-gray-50 dark:hover:bg-white/5",
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                  activeStep === i
                    ? "bg-primary/15 text-primary"
                    : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  activeStep === i
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Current step detail */}
      {current && (
        <div className="shrink-0 border-t border-border-warm dark:border-white/6 p-4 space-y-3">
          <div className="overflow-x-auto">
            <KaTeX latex={current.latex} display className="text-base" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {current.description}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="shrink-0 border-t border-border-warm dark:border-white/6 p-3 flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={activeStep === 0}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          {activeStep + 1} / {total}
        </span>
        <button
          onClick={() => nextStep(total)}
          disabled={activeStep === total - 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
