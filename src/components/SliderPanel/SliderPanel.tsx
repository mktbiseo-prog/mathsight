import { SlidersHorizontal } from "lucide-react";
import { useExploreStore } from "@/store/useExploreStore";

export function SliderPanel() {
  const sliderParams = useExploreStore((s) => s.sliderParams);
  const setSliderValue = useExploreStore((s) => s.setSliderValue);

  const params = Object.values(sliderParams);
  if (params.length === 0) return null;

  return (
    <div className="space-y-3 p-4 rounded-xl bg-white/90 dark:bg-surface-card/90 backdrop-blur border border-border-warm dark:border-white/6 shadow-lg">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
        <SlidersHorizontal size={14} />
        매개변수
      </h3>
      {params.map((param) => (
        <div key={param.name} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-mono font-bold text-primary">{param.name}</span>
            <span className="font-mono text-gray-500 dark:text-gray-400 tabular-nums">
              {param.value.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={param.value}
            onChange={(e) => setSliderValue(param.name, parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600">
            <span>{param.min}</span>
            <span>{param.max}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
