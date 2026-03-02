import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createRiemannRects,
  createShadedRegion,
  createLabel,
  createDashedLine,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";
import * as THREE from "three";

const fn = (x: number) => x * x; // x²

export const definiteIntegral: ConceptData = {
  unitId: "definite-integral",
  title: "정적분과 넓이",
  steps: [
    {
      label: "넓이 문제",
      latex: "\\int_0^2 x^2 \\, dx = \\, ?",
      description:
        "y = x²과 x축 사이의 넓이를 구하는 문제입니다. 구간 [0, 2]에서의 넓이를 어떻게 구할 수 있을까요?",
      render: ({ scene }) => {
        const curve = createCurve(fn, -1, 3, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const shade = createShadedRegion(fn, 0, 2, NEON_CYAN, 0.15);
        shade.name = "concept-shade";
        scene.scene.add(shade);

        const lbl = createLabel("넓이 = ?", new THREE.Vector3(1, 1.5, 0), "#00f0ff", 1.2);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        // Boundary dashed lines
        const l1 = createDashedLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0.3, 0),
          0x666688,
        );
        l1.name = "concept-l1";
        scene.scene.add(l1);

        const l2 = createDashedLine(
          new THREE.Vector3(2, 0, 0),
          new THREE.Vector3(2, 4, 0),
          0x666688,
        );
        l2.name = "concept-l2";
        scene.scene.add(l2);
      },
    },
    {
      label: "리만합 (적은 직사각형)",
      latex: "S_n = \\sum_{k=1}^{n} f(x_k^*) \\Delta x",
      description:
        "곡선 아래 영역을 직사각형으로 나누어 넓이를 근사합니다. 직사각형 개수를 늘려보세요.",
      params: [
        { name: "n", label: "n (개수)", min: 2, max: 50, step: 1, default: 4 },
      ],
      render: ({ scene, params }) => {
        const curve = createCurve(fn, -1, 3, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const n = Math.round(params.n ?? 4);
        const rects = createRiemannRects(fn, 0, 2, n, NEON_GREEN, 0.3);
        rects.name = "concept-rects";
        scene.scene.add(rects);

        // Calculate approximate area
        const dx = 2 / n;
        let area = 0;
        for (let i = 0; i < n; i++) {
          area += fn(i * dx + dx / 2) * dx;
        }
        const lbl = createLabel(
          `S${n} ≈ ${area.toFixed(3)}`,
          new THREE.Vector3(1, 4.5, 0),
          "#39ff14",
          1.2,
        );
        lbl.name = "concept-area-lbl";
        scene.scene.add(lbl);
      },
    },
    {
      label: "n → ∞ (수렴)",
      latex: "\\lim_{n \\to \\infty} S_n = \\int_0^2 x^2 \\, dx",
      description:
        "직사각형 개수를 무한히 늘리면 리만합이 정적분값으로 수렴합니다. n을 크게 늘려보세요!",
      params: [
        { name: "n", label: "n (개수)", min: 5, max: 200, step: 5, default: 10 },
      ],
      render: ({ scene, params }) => {
        const curve = createCurve(fn, -1, 3, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const n = Math.round(params.n ?? 10);
        const rects = createRiemannRects(fn, 0, 2, n, NEON_CYAN, 0.25);
        rects.name = "concept-rects";
        scene.scene.add(rects);

        const dx = 2 / n;
        let area = 0;
        for (let i = 0; i < n; i++) {
          area += fn(i * dx + dx / 2) * dx;
        }

        const exact = 8 / 3;
        const error = Math.abs(area - exact);
        const lbl = createLabel(
          `S${n} = ${area.toFixed(4)}  (오차: ${error.toFixed(4)})`,
          new THREE.Vector3(1, 5, 0),
          "#00f0ff",
          1,
        );
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        const exactLbl = createLabel(
          `정확한 값: 8/3 ≈ ${exact.toFixed(4)}`,
          new THREE.Vector3(1, 4, 0),
          "#ff00ff",
          1,
        );
        exactLbl.name = "concept-exact-lbl";
        scene.scene.add(exactLbl);
      },
    },
    {
      label: "정적분 결과",
      latex: "\\int_0^2 x^2 \\, dx = \\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{8}{3}",
      description:
        "미적분학의 기본정리에 의해, 부정적분 x³/3을 구간 끝점에서 평가하면 정확한 넓이 8/3을 얻습니다.",
      render: ({ scene }) => {
        const curve = createCurve(fn, -1, 3, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const shade = createShadedRegion(fn, 0, 2, NEON_MAGENTA, 0.25);
        shade.name = "concept-shade";
        scene.scene.add(shade);

        const lbl = createLabel("8/3 ≈ 2.667", new THREE.Vector3(1, 2, 0), "#ff00ff", 1.5);
        lbl.name = "concept-result-lbl";
        scene.scene.add(lbl);
      },
    },
  ],
};
