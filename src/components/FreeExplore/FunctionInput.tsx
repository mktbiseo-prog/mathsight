import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { useExploreStore } from "@/store/useExploreStore";
import { cn } from "@/utils/cn";

export function FunctionInput() {
  const inputValue = useExploreStore((s) => s.inputValue);
  const setInputValue = useExploreStore((s) => s.setInputValue);
  const addFunction = useExploreStore((s) => s.addFunction);
  const parseError = useExploreStore((s) => s.parseError);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addFunction(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="y = x^2, sin(x), a*x^2 + b*x + c ..."
        className={cn(
          "w-full pl-4 pr-12 py-2.5 rounded-xl",
          "bg-white dark:bg-surface-card border",
          parseError
            ? "border-red-500 dark:border-red-500"
            : "border-gray-300 dark:border-white/10",
          "text-gray-900 dark:text-white font-mono text-sm",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/30",
        )}
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
      >
        <Plus className="w-5 h-5" />
      </button>
      {parseError && (
        <p className="absolute -bottom-5 left-2 text-xs text-red-400 truncate max-w-full">
          {parseError}
        </p>
      )}
    </form>
  );
}
