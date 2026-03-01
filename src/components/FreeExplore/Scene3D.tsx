import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { SceneManager } from "@/engine/SceneManager";
import { createAxes } from "@/engine/AxisHelper";
import { createGraphLine } from "@/engine/GraphMesh";
import { evaluatePoints } from "@/utils/mathParser";
import { useExploreStore } from "@/store/useExploreStore";

export interface Scene3DHandle {
  resetCamera: () => void;
}

export const Scene3D = forwardRef<Scene3DHandle>(function Scene3D(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);

  const functions = useExploreStore((s) => s.functions);
  const sliderParams = useExploreStore((s) => s.sliderParams);
  const viewSettings = useExploreStore((s) => s.viewSettings);

  useImperativeHandle(ref, () => ({
    resetCamera: () => managerRef.current?.resetCamera(),
  }));

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    const manager = new SceneManager(containerRef.current);
    managerRef.current = manager;
    return () => {
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  // Update axes/grid
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;
    manager.removeByName("axis-helper");
    const axes = createAxes({
      range: viewSettings.xRange,
      showGrid: viewSettings.showGrid,
      showAxes: viewSettings.showAxes,
      showLabels: viewSettings.showLabels,
    });
    manager.scene.add(axes);
  }, [viewSettings.showGrid, viewSettings.showAxes, viewSettings.showLabels, viewSettings.xRange]);

  // Update graphs when functions or slider params change
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    // Remove all existing graphs
    manager.removeByPrefix("graph-");

    // Build param values
    const paramValues: Record<string, number> = {};
    for (const [name, param] of Object.entries(sliderParams)) {
      paramValues[name] = param.value;
    }

    // Draw visible functions
    for (const fn of functions) {
      if (!fn.visible) continue;
      const points = evaluatePoints(
        fn.compiled,
        viewSettings.xRange,
        viewSettings.resolution,
        paramValues,
      );
      const line = createGraphLine(points, fn.color, fn.id);
      manager.scene.add(line);
    }
  }, [functions, sliderParams, viewSettings.xRange, viewSettings.resolution]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
});
