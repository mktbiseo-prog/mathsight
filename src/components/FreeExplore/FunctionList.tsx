import { Eye, EyeOff, X } from "lucide-react";
import { useExploreStore } from "@/store/useExploreStore";
import { useThemeStore } from "@/store/useThemeStore";
import { getNextColor } from "@/engine/NeonMaterial";
import { cn } from "@/utils/cn";

export function FunctionList() {
  const functions = useExploreStore((s) => s.functions);
  const removeFunction = useExploreStore((s) => s.removeFunction);
  const toggleVis = useExploreStore((s) => s.toggleFunctionVisibility);
  const theme = useThemeStore((s) => s.theme);

  if (functions.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {functions.map((fn) => (
        <div
          key={fn.id}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "bg-bg-card dark:bg-white/5 border border-border-warm dark:border-white/10 text-sm font-mono",
            !fn.visible && "opacity-40",
          )}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: getNextColor(fn.colorIndex, theme === "dark") }}
          />
          {fn.is3D && (
            <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/20">
              3D
            </span>
          )}
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
            className="text-gray-400 hover:text-error"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
