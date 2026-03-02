import { useState, type FormEvent } from "react";
import { Calculator } from "lucide-react";
import type { ParsedProblem } from "@/engine/step-generator";
import { parseProblemInput } from "@/engine/step-generator";
import { KaTeX } from "@/components/common/KaTeX";
import { cn } from "@/utils/cn";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  solve: { label: "방정식", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" },
  diff: { label: "미분", color: "bg-success/10 text-success dark:bg-success/20 dark:text-success" },
  integrate: { label: "적분", color: "bg-graph-1/10 text-graph-1 dark:bg-graph-1/20 dark:text-graph-1" },
  limit: { label: "극한", color: "bg-amber/10 text-amber dark:bg-amber/20 dark:text-amber" },
  simplify: { label: "간소화", color: "bg-graph-4/10 text-graph-4 dark:bg-graph-4/20 dark:text-graph-4" },
};

interface MathInputProps {
  onSubmit: (parsed: ParsedProblem) => void;
  disabled?: boolean;
}

export function MathInput({ onSubmit, disabled }: MathInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const parsed = value.trim() ? parseProblemInput(value) : null;
  const detectedType =
    parsed && !("error" in parsed) ? TYPE_LABELS[parsed.type] : null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    const result = parseProblemInput(value.trim());
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    onSubmit(result);
    setValue("");
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="x^2 - 4 = 0, diff(x^3), integrate(sin(x)) ..."
          disabled={disabled}
          className={cn(
            "w-full pl-4 pr-24 py-3 rounded-xl",
            "bg-white dark:bg-surface-card border",
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-white/10",
            "text-gray-900 dark:text-white font-mono text-sm",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {detectedType && (
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                detectedType.color,
              )}
            >
              {detectedType.label}
            </span>
          )}
          <button
            type="submit"
            disabled={disabled}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 disabled:opacity-50"
          >
            <Calculator className="w-5 h-5" />
          </button>
        </div>
      </form>

      {error && <p className="text-xs text-red-400 px-1">{error}</p>}

      {parsed && !("error" in parsed) && parsed.displayLatex && (
        <div className="px-1">
          <KaTeX
            latex={parsed.displayLatex}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
      )}
    </div>
  );
}
