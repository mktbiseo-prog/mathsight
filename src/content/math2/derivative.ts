import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createDashedLine,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";

export const derivative: ConceptData = {
  unitId: "derivative",
  title: "미분계수와 도함수",
  steps: [
    {
      label: "평균변화율",
      latex: "\\frac{\\Delta y}{\\Delta x} = \\frac{f(b) - f(a)}{b - a}",
      description:
        "두 점을 잇는 할선(secant line)의 기울기가 평균변화율입니다. 함수 f(x) = x² 위의 두 점을 관찰하세요.",
      params: [
        { name: "a", label: "a", min: -3, max: 2, step: 0.1, default: 1 },
        { name: "b", label: "b", min: -2, max: 4, step: 0.1, default: 3 },
      ],
      render: ({ scene, params }) => {
        const fn = (x: number) => x * x;
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const a = params.a ?? 1;
        const b = params.b ?? 3;
        const fa = fn(a);
        const fb = fn(b);

        // Two points
        const ptA = createPoint(a, fa, 0, NEON_GREEN, 0.15);
        ptA.name = "concept-ptA";
        scene.scene.add(ptA);

        const ptB = createPoint(b, fb, 0, NEON_GREEN, 0.15);
        ptB.name = "concept-ptB";
        scene.scene.add(ptB);

        // Secant line
        const slope = (fb - fa) / (b - a || 0.001);
        const secant = createCurve(
          (x) => fa + slope * (x - a),
          -30, 30,
          NEON_MAGENTA,
        );
        secant.name = "concept-secant";
        scene.scene.add(secant);

        // Delta markers
        const dx = createDashedLine(
          new THREE.Vector3(a, fa, 0),
          new THREE.Vector3(b, fa, 0),
          0xff6600,
        );
        dx.name = "concept-dx";
        scene.scene.add(dx);

        const dy = createDashedLine(
          new THREE.Vector3(b, fa, 0),
          new THREE.Vector3(b, fb, 0),
          0xff6600,
        );
        dy.name = "concept-dy";
        scene.scene.add(dy);

        const lblDx = createLabel("Δx", new THREE.Vector3((a + b) / 2, fa - 0.5, 0), "#ff6600", 1);
        lblDx.name = "concept-lblDx";
        scene.scene.add(lblDx);

        const lblDy = createLabel("Δy", new THREE.Vector3(b + 0.5, (fa + fb) / 2, 0), "#ff6600", 1);
        lblDy.name = "concept-lblDy";
        scene.scene.add(lblDy);
      },
    },
    {
      label: "Δx → 0",
      latex: "f'(a) = \\lim_{\\Delta x \\to 0} \\frac{f(a + \\Delta x) - f(a)}{\\Delta x}",
      description:
        "Δx를 0에 가깝게 줄이면, 할선이 접선에 수렴합니다. 슬라이더로 Δx를 줄여보세요.",
      params: [
        { name: "a", label: "a", min: -3, max: 3, step: 0.1, default: 1 },
        { name: "dx", label: "Δx", min: 0.05, max: 3, step: 0.05, default: 2 },
      ],
      render: ({ scene, params }) => {
        const fn = (x: number) => x * x;
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const a = params.a ?? 1;
        const dx = params.dx ?? 2;
        const b = a + dx;
        const fa = fn(a);
        const fb = fn(b);

        const ptA = createPoint(a, fa, 0, NEON_GREEN, 0.15);
        ptA.name = "concept-ptA";
        scene.scene.add(ptA);

        const ptB = createPoint(b, fb, 0, NEON_MAGENTA, 0.12);
        ptB.name = "concept-ptB";
        scene.scene.add(ptB);

        // Secant
        const slope = (fb - fa) / dx;
        const secant = createCurve(
          (x) => fa + slope * (x - a),
          -30, 30,
          NEON_MAGENTA,
        );
        secant.name = "concept-secant";
        scene.scene.add(secant);

        // True tangent for comparison
        const trueSlope = 2 * a;
        const tangent = createCurve(
          (x) => fa + trueSlope * (x - a),
          -30, 30,
          NEON_GREEN,
        );
        tangent.name = "concept-tangent";
        scene.scene.add(tangent);

        const lbl = createLabel(
          `기울기 ≈ ${slope.toFixed(2)}`,
          new THREE.Vector3(a + 2, fa + 3, 0),
          "#ff00ff",
          1.2,
        );
        lbl.name = "concept-slope-label";
        scene.scene.add(lbl);
      },
    },
    {
      label: "접선의 기울기",
      latex: "f'(a) = 2a \\quad (f(x) = x^2)",
      description:
        "f(x) = x²의 미분계수는 f'(a) = 2a입니다. 점 a를 움직이면 접선의 기울기가 변합니다.",
      params: [
        { name: "a", label: "a", min: -3, max: 3, step: 0.1, default: 1 },
      ],
      render: ({ scene, params }) => {
        const fn = (x: number) => x * x;
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const a = params.a ?? 1;
        const fa = fn(a);
        const slope = 2 * a;

        const pt = createPoint(a, fa, 0, NEON_GREEN, 0.18);
        pt.name = "concept-pt";
        scene.scene.add(pt);

        const tangent = createCurve(
          (x) => fa + slope * (x - a),
          -30, 30,
          NEON_GREEN,
        );
        tangent.name = "concept-tangent";
        scene.scene.add(tangent);

        const lbl = createLabel(
          `f'(${a.toFixed(1)}) = ${slope.toFixed(1)}`,
          new THREE.Vector3(a + 1.5, fa + 2, 0),
          "#39ff14",
          1.2,
        );
        lbl.name = "concept-label";
        scene.scene.add(lbl);
      },
    },
    {
      label: "도함수 그래프",
      latex: "f(x) = x^2 \\Rightarrow f'(x) = 2x",
      description:
        "모든 점에서의 미분계수를 모으면 도함수 f'(x) = 2x를 얻습니다. 원래 함수(파랑)와 도함수(초록)를 비교하세요.",
      render: ({ scene }) => {
        const fn = createCurve((x) => x * x, -30, 30, NEON_CYAN);
        fn.name = "concept-fn";
        scene.scene.add(fn);

        const deriv = createCurve((x) => 2 * x, -30, 30, NEON_GREEN);
        deriv.name = "concept-deriv";
        scene.scene.add(deriv);

        const lblF = createLabel("f(x) = x²", new THREE.Vector3(3, 9, 0), "#00f0ff", 1);
        lblF.name = "concept-lbl-f";
        scene.scene.add(lblF);

        const lblD = createLabel("f'(x) = 2x", new THREE.Vector3(3.5, 6, 0), "#39ff14", 1);
        lblD.name = "concept-lbl-d";
        scene.scene.add(lblD);
      },
    },
  ],
};
