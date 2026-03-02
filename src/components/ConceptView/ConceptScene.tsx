import { useRef, useEffect } from "react";
import { SceneManager } from "@/engine/SceneManager";
import { createAxes } from "@/engine/AxisHelper";
import { useConceptStore } from "@/store/useConceptStore";
import { useThemeStore } from "@/store/useThemeStore";
import type { ConceptData } from "@/types/concept";

const SCENE_BG = { light: 0xFAFAF5, dark: 0x1E1E2E } as const;

interface ConceptSceneProps {
  concept: ConceptData;
}

export function ConceptScene({ concept }: ConceptSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const activeStep = useConceptStore((s) => s.activeStep);
  const params = useConceptStore((s) => s.params);
  const theme = useThemeStore((s) => s.theme);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    const manager = new SceneManager(containerRef.current);
    managerRef.current = manager;

    // Set theme-aware background
    manager.setBackground(SCENE_BG[theme]);

    // Add default axes
    const axes = createAxes({
      range: [-30, 30],
      showGrid: true,
      showAxes: true,
      showLabels: true,
      theme,
    });
    manager.scene.add(axes);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      manager.dispose();
      managerRef.current = null;
    };
  }, [concept.unitId]);

  // Update background and axes when theme changes
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;
    manager.setBackground(SCENE_BG[theme]);
    manager.removeByName("axis-helper");
    const axes = createAxes({
      range: [-30, 30],
      showGrid: true,
      showAxes: true,
      showLabels: true,
      theme,
    });
    manager.scene.add(axes);
  }, [theme]);

  // Render current step
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    // Clean up previous step
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Remove concept objects, keep axes
    manager.removeByPrefix("concept-");

    const step = concept.steps[activeStep];
    if (!step) return;

    const result = step.render({ scene: manager, params });
    if (typeof result === "function") {
      cleanupRef.current = result;
    }
  }, [activeStep, params, concept]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
}
