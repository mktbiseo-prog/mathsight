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
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

export const expLog: ConceptData = {
  unitId: "exp-log",
  title: "지수·로그함수",
  steps: [
    // Step 1: 밑 변화에 따른 지수함수
    {
      label: "밑 변화",
      latex: "y = a^x",
      description:
        "밑 a의 값이 변하면 지수함수의 성장 속도가 달라집니다. a > 1이면 증가, 0 < a < 1이면 감소합니다.",
      params: [
        { name: "base", label: "밑 a", min: 0.2, max: 5, step: 0.1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const a = params.base ?? 2;

        // y = a^x
        const curve = createCurve(
          (x) => Math.pow(a, x),
          -5, 5,
          NEON_CYAN,
          400,
        );
        curve.name = "concept-exp";
        scene.scene.add(curve);

        // Reference: y = e^x (lighter)
        const refCurve = createCurve(
          (x) => Math.exp(x),
          -5, 5,
          0x555577,
          300,
        );
        refCurve.name = "concept-ref";
        scene.scene.add(refCurve);

        // y-intercept at (0, 1) — always passes through
        scene.scene.add(createPoint(0, 1, 0, NEON_GREEN, 0.15));

        // Horizontal asymptote y = 0
        scene.scene.add(createDashedLine(
          new THREE.Vector3(-10, 0, 0),
          new THREE.Vector3(10, 0, 0),
          0x666688,
        ));

        scene.scene.add(createLabel(`y = ${a.toFixed(1)}^x`, new THREE.Vector3(2, Math.min(Math.pow(a, 2) + 0.5, 8), 0), "#0072B2"));
        scene.scene.add(createLabel("(0, 1)", new THREE.Vector3(0.8, 1.5, 0), "#009E73"));
        scene.scene.add(createLabel("y = e^x", new THREE.Vector3(-3, 1.5, 0), "#555577"));
      },
    },

    // Step 2: 역함수 대칭
    {
      label: "역함수 대칭",
      latex: "y = a^x \\quad\\leftrightarrow\\quad y = \\log_a x",
      description:
        "지수함수와 로그함수는 y = x 직선을 기준으로 대칭입니다. 서로 역함수 관계임을 확인하세요.",
      params: [
        { name: "base", label: "밑 a", min: 1.1, max: 5, step: 0.1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const a = params.base ?? 2;

        // y = a^x
        const exp = createCurve(
          (x) => Math.pow(a, x),
          -5, 5,
          NEON_CYAN,
        );
        exp.name = "concept-exp";
        scene.scene.add(exp);

        // y = log_a(x)
        const log = createCurve(
          (x) => x > 0 ? Math.log(x) / Math.log(a) : NaN,
          0.01, 20,
          NEON_MAGENTA,
        );
        log.name = "concept-log";
        scene.scene.add(log);

        // y = x line
        const yEqualsX = createDashedLine(
          new THREE.Vector3(-5, -5, 0),
          new THREE.Vector3(10, 10, 0),
          0xffff00,
          0.3,
          0.15,
        );
        yEqualsX.name = "concept-yx";
        scene.scene.add(yEqualsX);

        // Key symmetric points
        scene.scene.add(createPoint(0, 1, 0, NEON_GREEN, 0.12));
        scene.scene.add(createPoint(1, 0, 0, NEON_GREEN, 0.12));

        scene.scene.add(createLabel(`y = ${a.toFixed(1)}^x`, new THREE.Vector3(2, Math.pow(a, 2) + 0.5, 0), "#0072B2"));
        scene.scene.add(createLabel(`y = log_${a.toFixed(1)}(x)`, new THREE.Vector3(5, 2, 0), "#CC79A7"));
        scene.scene.add(createLabel("y = x", new THREE.Vector3(5, 5.5, 0), "#ffff00"));
      },
    },

    // Step 3: 자연로그 e
    {
      label: "자연상수 e",
      latex: "e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\approx 2.718",
      description:
        "n이 커질수록 (1 + 1/n)^n은 e에 수렴합니다. 점들이 e ≈ 2.718에 모이는 것을 관찰하세요.",
      params: [
        { name: "n", label: "n 값", min: 1, max: 100, step: 1, default: 10 },
      ],
      render: ({ scene, params }) => {
        const maxN = params.n ?? 10;

        // Plot points (k, (1+1/k)^k) for k = 1..maxN
        for (let k = 1; k <= maxN; k++) {
          const val = Math.pow(1 + 1 / k, k);
          const x = (k / maxN) * 8; // scale x to fit
          scene.scene.add(createPoint(x, val, 0, NEON_ORANGE, 0.08));
        }

        // Horizontal asymptote y = e
        scene.scene.add(createDashedLine(
          new THREE.Vector3(0, Math.E, 0),
          new THREE.Vector3(9, Math.E, 0),
          0x00ff88,
          0.2,
          0.1,
        ));

        // Current value
        const currentVal = Math.pow(1 + 1 / maxN, maxN);
        const cx = 8;
        scene.scene.add(createPoint(cx, currentVal, 0, NEON_GREEN, 0.18));

        scene.scene.add(createLabel(`n=${maxN}`, new THREE.Vector3(cx + 0.5, currentVal - 0.3, 0), "#009E73"));
        scene.scene.add(createLabel(`= ${currentVal.toFixed(5)}`, new THREE.Vector3(cx + 0.5, currentVal + 0.3, 0), "#009E73"));
        scene.scene.add(createLabel("e ≈ 2.71828", new THREE.Vector3(3, Math.E + 0.4, 0), "#00ff88"));
      },
    },
  ],
};
