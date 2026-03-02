import { useRef } from "react";
import { Grid3X3, Axis3D, Type, RotateCcw } from "lucide-react";
import { Scene3D } from "@/components/FreeExplore/Scene3D";
import type { Scene3DHandle } from "@/components/FreeExplore/Scene3D";
import { FunctionInput } from "@/components/FreeExplore/FunctionInput";
import { FunctionList } from "@/components/FreeExplore/FunctionList";
import { SliderPanel } from "@/components/SliderPanel/SliderPanel";
import { useExploreStore } from "@/store/useExploreStore";
import { cn } from "@/utils/cn";

function ToolButton({
  active,
  onClick,
  icon,
  tooltip,
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "p-2 rounded-lg transition-colors",
        active
          ? "bg-primary-light dark:bg-white/15 text-primary dark:text-white"
          : "text-gray-400 dark:text-gray-500 hover:bg-primary-light/50 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-300",
      )}
    >
      {icon}
    </button>
  );
}

export function FreeExplorePage() {
  const sceneRef = useRef<Scene3DHandle>(null);
  const viewSettings = useExploreStore((s) => s.viewSettings);
  const toggleGrid = useExploreStore((s) => s.toggleGrid);
  const toggleAxes = useExploreStore((s) => s.toggleAxes);
  const toggleLabels = useExploreStore((s) => s.toggleLabels);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-3 space-y-2 border-b border-border-warm dark:border-white/6 bg-white/90 dark:bg-surface-dark/90 backdrop-blur">
        <div className="flex gap-3 items-start max-w-6xl mx-auto">
          <div className="flex-1 space-y-2">
            <FunctionInput />
            <FunctionList />
          </div>
          <div className="flex gap-0.5 shrink-0">
            <ToolButton
              active={viewSettings.showGrid}
              onClick={toggleGrid}
              icon={<Grid3X3 size={18} />}
              tooltip="격자"
            />
            <ToolButton
              active={viewSettings.showAxes}
              onClick={toggleAxes}
              icon={<Axis3D size={18} />}
              tooltip="축"
            />
            <ToolButton
              active={viewSettings.showLabels}
              onClick={toggleLabels}
              icon={<Type size={18} />}
              tooltip="라벨"
            />
            <ToolButton
              onClick={() => sceneRef.current?.resetCamera()}
              icon={<RotateCcw size={18} />}
              tooltip="카메라 리셋"
            />
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative">
        <Scene3D ref={sceneRef} />

        {/* Slider panel overlay */}
        <div className="absolute right-4 bottom-4 w-56 max-h-[50%] overflow-y-auto">
          <SliderPanel />
        </div>
      </div>
    </div>
  );
}
