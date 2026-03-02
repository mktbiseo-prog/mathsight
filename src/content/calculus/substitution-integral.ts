import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createShadedRegion,
  createLabel,
  createArrow,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";

export const substitutionIntegral: ConceptData = {
  unitId: "substitution-integral",
  title: "치환적분",
  steps: [
    {
      label: "치환적분의 아이디어",
      latex: "\\int f(g(x)) g'(x) \\, dx = \\int f(u) \\, du",
      description:
        "복잡한 적분을 u = g(x)로 치환하여 간단하게 만듭니다. 예: ∫2x·cos(x²)dx에서 u = x²로 치환.",
      render: ({ scene }) => {
        // Original: 2x * cos(x²)
        const original = createCurve(
          (x) => 2 * x * Math.cos(x * x),
          -30, 30, NEON_CYAN,
        );
        original.name = "concept-original";
        scene.scene.add(original);

        const lbl = createLabel("2x·cos(x²)", new THREE.Vector3(2, 3, 0), "#00f0ff", 1);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        // Arrow indicating transformation
        const arrow = createArrow(
          new THREE.Vector3(3, 0, 0),
          new THREE.Vector3(5, 0, 0),
          NEON_MAGENTA,
          0.4,
          0.15,
        );
        arrow.name = "concept-arrow";
        scene.scene.add(arrow);

        const lblU = createLabel("u = x²", new THREE.Vector3(4, 1, 0), "#ff00ff", 1);
        lblU.name = "concept-lbl-u";
        scene.scene.add(lblU);
      },
    },
    {
      label: "x축 → u축 변환",
      latex: "u = x^2, \\quad du = 2x \\, dx",
      description:
        "x축 좌표를 u = x²으로 변환합니다. 파란색(원래)과 초록색(치환 후)의 넓이가 같은 것에 주목하세요.",
      render: ({ scene }) => {
        // x-space: 2x*cos(x²) on [0, √π]
        const xFn = (x: number) => 2 * x * Math.cos(x * x);
        const xCurve = createCurve(xFn, 0, Math.sqrt(Math.PI), NEON_CYAN);
        xCurve.name = "concept-x-curve";
        // Shift left
        xCurve.position.x = -4;
        scene.scene.add(xCurve);

        const xShade = createShadedRegion(xFn, 0, Math.sqrt(Math.PI), NEON_CYAN, 0.15);
        xShade.name = "concept-x-shade";
        xShade.position.x = -4;
        scene.scene.add(xShade);

        // u-space: cos(u) on [0, π]
        const uFn = (u: number) => Math.cos(u);
        const uCurve = createCurve(uFn, 0, Math.PI, NEON_GREEN);
        uCurve.name = "concept-u-curve";
        uCurve.position.x = 2;
        scene.scene.add(uCurve);

        const uShade = createShadedRegion(uFn, 0, Math.PI, NEON_GREEN, 0.15);
        uShade.name = "concept-u-shade";
        uShade.position.x = 2;
        scene.scene.add(uShade);

        // Labels
        const lblX = createLabel("x 공간", new THREE.Vector3(-3, 2.5, 0), "#00f0ff", 1);
        lblX.name = "concept-lbl-x";
        scene.scene.add(lblX);

        const lblU = createLabel("u 공간", new THREE.Vector3(3.5, 2.5, 0), "#39ff14", 1);
        lblU.name = "concept-lbl-u";
        scene.scene.add(lblU);

        // Arrow
        const arrow = createArrow(
          new THREE.Vector3(-1, 1.5, 0),
          new THREE.Vector3(1.5, 1.5, 0),
          NEON_MAGENTA,
          0.3,
          0.12,
        );
        arrow.name = "concept-arrow";
        scene.scene.add(arrow);

        const lblEq = createLabel("=", new THREE.Vector3(0.3, 1.5, 0), "#ff00ff", 1.5);
        lblEq.name = "concept-lbl-eq";
        scene.scene.add(lblEq);
      },
    },
    {
      label: "부분적분",
      latex: "\\int u \\, dv = uv - \\int v \\, du",
      description:
        "∫x·eˣdx를 부분적분으로 풀어봅니다. u = x, dv = eˣdx로 놓으면 uv - ∫v du를 계산할 수 있습니다.",
      render: ({ scene }) => {
        // x * e^x
        const integrand = createCurve((x) => x * Math.exp(x), -30, 30, NEON_CYAN);
        integrand.name = "concept-integrand";
        scene.scene.add(integrand);

        // Result: x*e^x - e^x = (x-1)e^x
        const result = createCurve((x) => (x - 1) * Math.exp(x), -30, 30, NEON_GREEN);
        result.name = "concept-result";
        scene.scene.add(result);

        const lbl1 = createLabel("x·eˣ", new THREE.Vector3(1.5, 5, 0), "#00f0ff", 0.9);
        lbl1.name = "concept-lbl1";
        scene.scene.add(lbl1);

        const lbl2 = createLabel("(x-1)eˣ", new THREE.Vector3(1.5, 3, 0), "#39ff14", 0.9);
        lbl2.name = "concept-lbl2";
        scene.scene.add(lbl2);
      },
    },
  ],
};
