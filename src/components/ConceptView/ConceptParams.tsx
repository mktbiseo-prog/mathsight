import { useConceptStore } from "@/store/useConceptStore";
import type { ParamDef } from "@/types/concept";

interface ConceptParamsProps {
  paramDefs: ParamDef[];
}

export function ConceptParams({ paramDefs }: ConceptParamsProps) {
  const params = useConceptStore((s) => s.params);
  const setParam = useConceptStore((s) => s.setParam);

  if (paramDefs.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 p-3 rounded-xl bg-white/90 dark:bg-surface-card/90 backdrop-blur-md border border-border-warm dark:border-white/6 shadow-lg">
      {paramDefs.map((def) => (
        <div key={def.name} className="flex items-center gap-2 min-w-[180px]">
          <label className="text-xs text-gray-600 dark:text-gray-300 font-mono shrink-0 w-16">
            {def.label}
          </label>
          <input
            type="range"
            min={def.min}
            max={def.max}
            step={def.step}
            value={params[def.name] ?? def.default}
            onChange={(e) => setParam(def.name, parseFloat(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-xs text-primary font-mono w-10 text-right">
            {(params[def.name] ?? def.default).toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}
