import * as THREE from "three";
import type { SceneManager } from "./SceneManager";
import type { ParsedProblem } from "./step-generator";
import type { SolveResult } from "./sympy-bridge";
import {
  createCurve,
  createPoint,
  createShadedRegion,
  createDashedLine,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "./ConceptMeshes";
import { morphOpacity } from "./animations";
import { exprToFn, parseNumericResult } from "./expr-to-fn";

// ── Types ──

export interface VizResult {
  success: boolean;
  /** Elements grouped by the step index they belong to */
  stepElements: Map<number, string[]>;
}

// ── Helpers ──

function addNamed(scene: THREE.Scene, obj: THREE.Object3D, name: string) {
  obj.name = name;
  scene.add(obj);
}

function setOpacity(obj: THREE.Object3D, opacity: number) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => {
          m.transparent = true;
          m.opacity = opacity;
        });
      } else {
        mat.transparent = true;
        mat.opacity = opacity;
      }
    }
    if (child instanceof THREE.Sprite) {
      child.material.opacity = opacity;
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  1. SOLVE (방정식)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderSolve(
  manager: SceneManager,
  problem: ParsedProblem,
  solution: SolveResult,
): VizResult {
  const fn = exprToFn(problem.expression, problem.variable);
  if (!fn) return { success: false, stepElements: new Map() };

  const stepElements = new Map<number, string[]>();

  // f(x) 곡선
  addNamed(manager.scene, createCurve(fn, -30, 30, NEON_CYAN), "solver-curve-main");
  addNamed(
    manager.scene,
    createLabel("f(x)", new THREE.Vector3(8, fn(8) + 1.5, 0), "#0072B2"),
    "solver-label-fx",
  );
  stepElements.set(0, ["solver-curve-main", "solver-label-fx"]);

  // 근 표시
  const symPyResults = Array.isArray(solution.resultSymPy)
    ? solution.resultSymPy
    : solution.resultSymPy
      ? [solution.resultSymPy]
      : [];

  const rootNames: string[] = [];
  symPyResults.forEach((r, i) => {
    const rx = parseNumericResult(r);
    if (rx === null) return;

    addNamed(manager.scene, createPoint(rx, 0, 0, NEON_MAGENTA, 0.25), `solver-root-${i}`);
    addNamed(
      manager.scene,
      createLabel(`x=${Number(rx.toFixed(3))}`, new THREE.Vector3(rx, -1.5, 0), "#CC79A7"),
      `solver-root-label-${i}`,
    );

    // 곡선에서 x축까지 점선
    const yCurve = fn(rx);
    if (Math.abs(yCurve) > 0.05) {
      addNamed(
        manager.scene,
        createDashedLine(new THREE.Vector3(rx, yCurve, 0), new THREE.Vector3(rx, 0, 0), NEON_MAGENTA),
        `solver-root-dash-${i}`,
      );
      rootNames.push(`solver-root-dash-${i}`);
    }
    rootNames.push(`solver-root-${i}`, `solver-root-label-${i}`);
  });

  if (rootNames.length > 0) {
    stepElements.set(solution.steps.length - 1, rootNames);
  }

  return { success: true, stepElements };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  2. DIFF (미분)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderDiff(
  manager: SceneManager,
  problem: ParsedProblem,
  solution: SolveResult,
): VizResult {
  const fn = exprToFn(problem.expression, problem.variable);
  if (!fn) return { success: false, stepElements: new Map() };

  const stepElements = new Map<number, string[]>();

  // 원함수
  addNamed(manager.scene, createCurve(fn, -30, 30, NEON_CYAN), "solver-curve-main");
  addNamed(
    manager.scene,
    createLabel("f(x)", new THREE.Vector3(8, fn(8) + 1.5, 0), "#0072B2"),
    "solver-label-fx",
  );
  stepElements.set(0, ["solver-curve-main", "solver-label-fx"]);

  // 도함수
  const resultExpr =
    typeof solution.resultSymPy === "string"
      ? solution.resultSymPy
      : Array.isArray(solution.resultSymPy)
        ? solution.resultSymPy[0]
        : null;

  if (resultExpr) {
    const dfn = exprToFn(resultExpr, problem.variable);
    if (dfn) {
      addNamed(manager.scene, createCurve(dfn, -30, 30, NEON_GREEN), "solver-curve-deriv");
      addNamed(
        manager.scene,
        createLabel("f'(x)", new THREE.Vector3(8, dfn(8) + 1.5, 0), "#009E73"),
        "solver-label-dfx",
      );
      stepElements.set(solution.steps.length - 1, ["solver-curve-deriv", "solver-label-dfx"]);
    }
  }

  return { success: true, stepElements };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  3. INTEGRATE (적분)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderIntegrate(
  manager: SceneManager,
  problem: ParsedProblem,
  solution: SolveResult,
): VizResult {
  const fn = exprToFn(problem.expression, problem.variable);
  if (!fn) return { success: false, stepElements: new Map() };

  const stepElements = new Map<number, string[]>();
  const isDefinite = problem.lower !== undefined && problem.upper !== undefined;

  // 원함수
  addNamed(manager.scene, createCurve(fn, -30, 30, NEON_CYAN), "solver-curve-main");
  addNamed(
    manager.scene,
    createLabel("f(x)", new THREE.Vector3(8, fn(8) + 1.5, 0), "#0072B2"),
    "solver-label-fx",
  );
  stepElements.set(0, ["solver-curve-main", "solver-label-fx"]);

  if (isDefinite) {
    const lo = parseNumericResult(problem.lower!) ?? 0;
    const hi = parseNumericResult(problem.upper!) ?? 1;

    // 면적 칠하기
    addNamed(manager.scene, createShadedRegion(fn, lo, hi, NEON_GREEN, 0.3), "solver-shaded");

    // 경계선
    const loY = Math.max(Math.abs(fn(lo)), 2) + 1;
    const hiY = Math.max(Math.abs(fn(hi)), 2) + 1;
    addNamed(
      manager.scene,
      createDashedLine(new THREE.Vector3(lo, -1, 0), new THREE.Vector3(lo, loY, 0), NEON_GREEN),
      "solver-bound-lo",
    );
    addNamed(
      manager.scene,
      createDashedLine(new THREE.Vector3(hi, -1, 0), new THREE.Vector3(hi, hiY, 0), NEON_GREEN),
      "solver-bound-hi",
    );

    // 면적 값 라벨
    const resultSymPy =
      typeof solution.resultSymPy === "string" ? solution.resultSymPy : null;
    const areaVal = resultSymPy ? parseNumericResult(resultSymPy) : null;
    if (areaVal !== null) {
      const mid = (lo + hi) / 2;
      addNamed(
        manager.scene,
        createLabel(`S = ${areaVal.toFixed(4)}`, new THREE.Vector3(mid, Math.max(fn(mid) / 2, 0.5), 0), "#009E73"),
        "solver-area-label",
      );
    }

    stepElements.set(solution.steps.length - 1, [
      "solver-shaded",
      "solver-bound-lo",
      "solver-bound-hi",
      "solver-area-label",
    ]);
  } else {
    // 부정적분: 역도함수 곡선
    const resultExpr =
      typeof solution.resultSymPy === "string" ? solution.resultSymPy : null;
    if (resultExpr) {
      const Fn = exprToFn(resultExpr, problem.variable);
      if (Fn) {
        addNamed(manager.scene, createCurve(Fn, -30, 30, NEON_GREEN), "solver-curve-anti");
        addNamed(
          manager.scene,
          createLabel("F(x)", new THREE.Vector3(8, Fn(8) + 1.5, 0), "#009E73"),
          "solver-label-Fx",
        );
        stepElements.set(solution.steps.length - 1, ["solver-curve-anti", "solver-label-Fx"]);
      }
    }
  }

  return { success: true, stepElements };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  4. LIMIT (극한)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderLimit(
  manager: SceneManager,
  problem: ParsedProblem,
  solution: SolveResult,
): VizResult {
  const fn = exprToFn(problem.expression, problem.variable);
  if (!fn) return { success: false, stepElements: new Map() };

  const stepElements = new Map<number, string[]>();
  const pointVal = parseNumericResult(problem.point ?? "0") ?? 0;
  const limitSymPy =
    typeof solution.resultSymPy === "string" ? solution.resultSymPy : null;
  const limitVal = limitSymPy ? parseNumericResult(limitSymPy) : null;

  // f(x) 곡선
  addNamed(manager.scene, createCurve(fn, -30, 30, NEON_CYAN), "solver-curve-main");
  stepElements.set(0, ["solver-curve-main"]);

  // 극한점에 빈 원(링)
  const yAtPoint = limitVal ?? fn(pointVal + 0.001);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.25, 32),
    new THREE.MeshBasicMaterial({ color: NEON_MAGENTA, side: THREE.DoubleSide }),
  );
  ring.position.set(pointVal, yAtPoint, 0);
  addNamed(manager.scene, ring, "solver-limit-ring");

  if (limitVal !== null) {
    // 극한값 수평 점선
    addNamed(
      manager.scene,
      createDashedLine(new THREE.Vector3(-30, limitVal, 0), new THREE.Vector3(30, limitVal, 0), NEON_MAGENTA, 0.15, 0.1),
      "solver-limit-hline",
    );
    // 수직 점선
    addNamed(
      manager.scene,
      createDashedLine(new THREE.Vector3(pointVal, 0, 0), new THREE.Vector3(pointVal, limitVal, 0), NEON_MAGENTA),
      "solver-limit-vline",
    );
    // 라벨
    addNamed(
      manager.scene,
      createLabel(`L = ${limitVal.toFixed(4)}`, new THREE.Vector3(pointVal + 2.5, limitVal + 1, 0), "#CC79A7"),
      "solver-limit-label",
    );

    stepElements.set(solution.steps.length - 1, [
      "solver-limit-ring",
      "solver-limit-hline",
      "solver-limit-vline",
      "solver-limit-label",
    ]);
  }

  return { success: true, stepElements };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  5. SIMPLIFY (간소화)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderSimplify(
  manager: SceneManager,
  problem: ParsedProblem,
  solution: SolveResult,
): VizResult {
  const fn = exprToFn(problem.expression, problem.variable);
  if (!fn) return { success: false, stepElements: new Map() };

  const stepElements = new Map<number, string[]>();

  // 원래 식
  addNamed(manager.scene, createCurve(fn, -30, 30, NEON_CYAN), "solver-curve-main");
  addNamed(
    manager.scene,
    createLabel("원래 식", new THREE.Vector3(8, fn(8) + 2, 0), "#0072B2"),
    "solver-label-original",
  );
  stepElements.set(0, ["solver-curve-main", "solver-label-original"]);

  // 간소화 식
  const resultExpr =
    typeof solution.resultSymPy === "string" ? solution.resultSymPy : null;
  if (resultExpr) {
    const fn2 = exprToFn(resultExpr, problem.variable);
    if (fn2) {
      addNamed(manager.scene, createCurve(fn2, -30, 30, NEON_GREEN), "solver-curve-simplified");
      addNamed(
        manager.scene,
        createLabel("간소화", new THREE.Vector3(8, fn2(8) - 2, 0), "#009E73"),
        "solver-label-simplified",
      );
      addNamed(
        manager.scene,
        createLabel("= 동치", new THREE.Vector3(0, fn(0) + 2.5, 0), "#009E73", 2),
        "solver-label-equiv",
      );
      stepElements.set(solution.steps.length - 1, [
        "solver-curve-simplified",
        "solver-label-simplified",
        "solver-label-equiv",
      ]);
    }
  }

  return { success: true, stepElements };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Dispatcher
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function renderVisualization(
  manager: SceneManager,
  problem: ParsedProblem,
  solution: SolveResult,
): VizResult {
  switch (problem.type) {
    case "solve":
      return renderSolve(manager, problem, solution);
    case "diff":
      return renderDiff(manager, problem, solution);
    case "integrate":
      return renderIntegrate(manager, problem, solution);
    case "limit":
      return renderLimit(manager, problem, solution);
    case "simplify":
      return renderSimplify(manager, problem, solution);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Step emphasis (opacity-based)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function applyStepEmphasis(
  manager: SceneManager,
  stepElements: Map<number, string[]>,
  activeStepIndex: number,
) {
  const allSolverObjects: THREE.Object3D[] = [];
  manager.scene.traverse((obj) => {
    if (obj.name.startsWith("solver-")) {
      allSolverObjects.push(obj);
    }
  });

  if (activeStepIndex < 0) {
    allSolverObjects.forEach((obj) => setOpacity(obj, 1));
    return;
  }

  const emphasized = new Set<string>();
  emphasized.add("solver-curve-main");
  emphasized.add("solver-label-fx");

  for (const [stepIdx, names] of stepElements) {
    if (stepIdx <= activeStepIndex) {
      names.forEach((n) => emphasized.add(n));
    }
  }

  allSolverObjects.forEach((obj) => {
    morphOpacity(obj, emphasized.has(obj.name) ? 1 : 0.15, 0.3);
  });
}
