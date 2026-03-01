import { Eye, EyeOff, X } from "lucide-react";
import { useExploreStore } from "@/store/useExploreStore";
import { cn } from "@/utils/cn";

export function FunctionList() {
  const functions = useExploreStore((s) => s.functions);
  const removeFunction = useExploreStore((s) => s.removeFunction);
  const toggleVis = useExploreStore((s) => s.toggleFunctionVisibility);

  if (functions.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {functions.map((fn) => (
        <div
          key={fn.id}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-mono",
            !fn.visible && "opacity-40",
          )}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: fn.color }}
          />
          <span className="text-gray-700 dark:text-gray-200 truncate max-w-40">
            {fn.expression}
          </span>
          <button
            onClick={() => toggleVis(fn.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {fn.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={() => removeFunction(fn.id)}
            className="text-gray-400 hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
