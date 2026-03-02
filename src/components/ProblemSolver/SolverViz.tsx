import { useRef, useEffect } from "react";
import * as THREE from "three";
import { SceneManager } from "@/engine/SceneManager";
import { createAxes } from "@/engine/AxisHelper";
import {
  renderVisualization,
  applyStepEmphasis,
  type VizResult,
} from "@/engine/solver-visualizer";
import { fadeInObjects, killSceneAnimations } from "@/engine/animations";
import { useThemeStore } from "@/store/useThemeStore";
import { KaTeX } from "@/components/common/KaTeX";
import type { ParsedProblem } from "@/engine/step-generator";
import type { SolveResult } from "@/engine/sympy-bridge";

const SCENE_BG = { light: 0xfafaf5, dark: 0x1e1e2e } as const;

interface SolverVizProps {
  problem: ParsedProblem | null;
  solution: SolveResult | null;
  activeStepIndex: number;
}

export function SolverViz({ problem, solution, activeStepIndex }: SolverVizProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const vizResultRef = useRef<VizResult | null>(null);
  const theme = useThemeStore((s) => s.theme);

  // ── Initialize SceneManager ──
  useEffect(() => {
    if (!containerRef.current) return;
    const manager = new SceneManager(containerRef.current);
    managerRef.current = manager;
    manager.setBackground(SCENE_BG[theme]);

    const axes = createAxes({
      range: [-30, 30],
      showGrid: true,
      showAxes: true,
      showLabels: true,
      theme,
    });
    manager.scene.add(axes);

    return () => {
      manager.dispose();
      managerRef.current = null;
      vizResultRef.current = null;
    };
  }, []);

  // ── Theme change ──
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

  // ── Render visualization when problem/solution changes ──
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    killSceneAnimations();
    manager.removeByPrefix("solver-");
    vizResultRef.current = null;

    if (!problem || !solution) {
      manager.resetCamera();
      return;
    }

    const viz = renderVisualization(manager, problem, solution);
    vizResultRef.current = viz;

    // Fade in new solver objects
    const solverObjects: THREE.Object3D[] = [];
    manager.scene.traverse((obj) => {
      if (obj.name.startsWith("solver-")) solverObjects.push(obj);
    });
    fadeInObjects(solverObjects, 0.5, 0.06);
  }, [problem, solution]);

  // ── Step emphasis ──
  useEffect(() => {
    const manager = managerRef.current;
    const viz = vizResultRef.current;
    if (!manager || !viz || !viz.success) return;
    applyStepEmphasis(manager, viz.stepElements, activeStepIndex);
  }, [activeStepIndex]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ touchAction: "none" }}
        role="img"
        aria-label="풀이 시각화"
      />

      {/* KaTeX 결과 오버레이 */}
      {solution && (
        <div className="absolute top-4 left-4 right-4 pointer-events-none">
          <div className="inline-block px-4 py-2 rounded-xl bg-white/80 dark:bg-surface-card/80 backdrop-blur-sm border border-border-warm dark:border-white/6">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              결과
            </p>
            <KaTeX latex={solution.resultLatex} className="text-lg" />
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {!problem && !solution && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400 dark:text-gray-500 space-y-2">
            <p className="text-lg">수식을 입력하면</p>
            <p className="text-lg">그래프가 여기에 표시됩니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
