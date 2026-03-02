import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { SceneManager } from "@/engine/SceneManager";
import { createAxes } from "@/engine/AxisHelper";
import { createGraphLine } from "@/engine/GraphMesh";
import { createSurfaceMesh } from "@/engine/SurfaceMesh";
import { evaluatePoints, evaluateSurface } from "@/utils/mathParser";
import { useExploreStore } from "@/store/useExploreStore";
import { useThemeStore } from "@/store/useThemeStore";
import { getNextColor } from "@/engine/NeonMaterial";

const SCENE_BG = { light: 0xFAFAF5, dark: 0x1E1E2E } as const;
const SURFACE_RES = /Mobi|Android|iPad|iPhone/i.test(navigator.userAgent) ? 60 : 100;

export interface Scene3DHandle {
  resetCamera: () => void;
}

export const Scene3D = forwardRef<Scene3DHandle>(function Scene3D(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);

  const functions = useExploreStore((s) => s.functions);
  const sliderParams = useExploreStore((s) => s.sliderParams);
  const viewSettings = useExploreStore((s) => s.viewSettings);
  const theme = useThemeStore((s) => s.theme);

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

  // Update background when theme changes
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;
    manager.setBackground(SCENE_BG[theme]);
  }, [theme]);

  // Detect if any visible function is 3D
  const has3D = functions.some((fn) => fn.visible && fn.is3D);
  const showZ = viewSettings.showZAxis || has3D;

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
      showZAxis: showZ,
      theme,
    });
    manager.scene.add(axes);

    // Camera + controls mode
    if (showZ) {
      manager.camera.position.set(15, 12, 15);
    } else {
      manager.camera.position.set(0, 0, 25);
    }
    manager.controls.enableRotate = true;
    manager.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    manager.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    manager.controls.screenSpacePanning = true;
    manager.camera.lookAt(0, 0, 0);
  }, [viewSettings.showGrid, viewSettings.showAxes, viewSettings.showLabels, viewSettings.xRange, theme, showZ]);

  // Update graphs when functions, slider params, or theme change
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

    const isDark = theme === "dark";

    // Draw visible functions
    for (const fn of functions) {
      if (!fn.visible) continue;
      const renderColor = getNextColor(fn.colorIndex, isDark);

      if (fn.is3D) {
        const surfaceData = evaluateSurface(
          fn.compiled,
          viewSettings.xRange,
          viewSettings.yRange,
          SURFACE_RES,
          paramValues,
        );
        const surface = createSurfaceMesh(surfaceData, renderColor, fn.id);
        manager.scene.add(surface);
      } else {
        const points = evaluatePoints(
          fn.compiled,
          viewSettings.xRange,
          viewSettings.resolution,
          paramValues,
        );
        const line = createGraphLine(points, renderColor, fn.id, fn.colorIndex);
        manager.scene.add(line);
      }
    }
  }, [functions, sliderParams, viewSettings.xRange, viewSettings.yRange, viewSettings.resolution, theme]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
});
