import { useState, type FormEvent } from "react";
import { Calculator } from "lucide-react";
import { koreanToExpr } from "@/utils/koreanMath";
import { KaTeX } from "@/components/common/KaTeX";
import { parseProblemInput } from "@/engine/step-generator";
import { cn } from "@/utils/cn";

interface KoreanInputProps {
  onSubmit: (expr: string) => void;
  disabled?: boolean;
}

const EXAMPLE_CHIPS = [
  "x의 4승 빼기 4 = 0",
  "x의 3승 미분",
  "루트 x",
  "x분의 1",
  "0에서 파이까지 sinx 적분",
  "x가 0으로 갈 때 극한 sinx 나누기 x",
];

export function KoreanInput({ onSubmit, disabled }: KoreanInputProps) {
  const [value, setValue] = useState("");

  const converted = value.trim() ? koreanToExpr(value) : "";
  const parsed = converted ? parseProblemInput(converted) : null;
  const displayLatex = parsed && !("error" in parsed) ? parsed.displayLatex : converted;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!converted || disabled) return;
    onSubmit(converted);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="x의 4승 더하기 2x 빼기 1 = 0"
          disabled={disabled}
          className={cn(
            "w-full pl-4 pr-12 py-3 rounded-xl",
            "bg-white dark:bg-surface-card border border-gray-300 dark:border-white/10",
            "text-gray-900 dark:text-white text-sm",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        />
        <button
          type="submit"
          disabled={disabled || !converted}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 disabled:opacity-30"
        >
          <Calculator className="w-5 h-5" />
        </button>
      </div>

      {/* Example chips */}
      <div className="flex gap-1 flex-wrap">
        {EXAMPLE_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setValue(chip)}
            className={cn(
              "px-2 py-1 rounded-md text-[10px]",
              "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30",
              "text-amber-700 dark:text-amber-400",
              "hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors",
            )}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Preview */}
      {converted && (
        <div className="px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 space-y-1">
          <p className="text-[10px] text-amber-600 dark:text-amber-500 font-medium">변환 결과</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-500 dark:text-gray-400 font-mono">{converted}</code>
            <span className="text-gray-300 dark:text-gray-600">→</span>
            {displayLatex && <KaTeX latex={displayLatex} className="text-sm" />}
          </div>
        </div>
      )}
    </form>
  );
}
