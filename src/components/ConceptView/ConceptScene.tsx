import { useRef, useEffect } from "react";
import * as THREE from "three";
import { SceneManager } from "@/engine/SceneManager";
import { createAxes } from "@/engine/AxisHelper";
import { fadeInObjects, fadeOutObjects, killSceneAnimations } from "@/engine/animations";
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
  const prevStepRef = useRef(-1);

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

    // Add default axes (with Z axis for 3D concepts)
    const axes = createAxes({
      range: [-30, 30],
      showGrid: true,
      showAxes: true,
      showLabels: true,
      showZAxis: concept.is3D,
      theme,
    });
    manager.scene.add(axes);

    // Set isometric camera for 3D concepts
    if (concept.is3D) {
      manager.camera.position.set(10, 8, 10);
      manager.camera.lookAt(0, 0, 0);
    }

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
      showZAxis: concept.is3D,
      theme,
    });
    manager.scene.add(axes);
  }, [theme, concept.is3D]);

  // Render current step with fade animations
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    killSceneAnimations();

    const isStepChange = prevStepRef.current !== activeStep;
    prevStepRef.current = activeStep;

    const step = concept.steps[activeStep];
    if (!step) return;

    // Collect existing concept objects
    const oldObjects: THREE.Object3D[] = [];
    manager.scene.traverse((obj) => {
      if (obj.name.startsWith("concept-")) oldObjects.push(obj);
    });

    const doRender = () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      manager.removeByPrefix("concept-");
      const result = step.render({ scene: manager, params });
      if (typeof result === "function") {
        cleanupRef.current = result;
      }
      // Collect new objects
      const newObjects: THREE.Object3D[] = [];
      manager.scene.traverse((obj) => {
        if (obj.name.startsWith("concept-")) newObjects.push(obj);
      });
      return newObjects;
    };

    if (isStepChange && oldObjects.length > 0) {
      // Step change: fade out old → remove → render new → fade in
      fadeOutObjects(oldObjects, 0.25).then(() => {
        const newObjects = doRender();
        fadeInObjects(newObjects, 0.4, 0.06);
      });
    } else {
      // First render or params change: instant replace + quick fade in
      const newObjects = doRender();
      fadeInObjects(newObjects, isStepChange ? 0.4 : 0.15, isStepChange ? 0.06 : 0);
    }

    return () => { killSceneAnimations(); };
  }, [activeStep, params, concept]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
      role="img"
      aria-label="3D 수학 시각화"
    />
  );
}
