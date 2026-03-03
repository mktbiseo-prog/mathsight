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

function g() {
  const group = new THREE.Group();
  group.name = "concept-content";
  return group;
}

export const expLog: ConceptData = {
  unitId: "exp-log",
  title: "지수·로그함수",
  steps: [
    {
      label: "밑 변화",
      latex: "y = a^x",
      description:
        "밑 a의 값이 변하면 지수함수의 성장 속도가 달라집니다. a > 1이면 증가, 0 < a < 1이면 감소합니다.",
      params: [
        { name: "base", label: "밑 a", min: 0.2, max: 5, step: 0.1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const a = params.base ?? 2;

        r.add(createCurve((x) => Math.pow(a, x), -5, 5, NEON_CYAN, 400));
        r.add(createCurve((x) => Math.exp(x), -5, 5, 0x555577, 300));
        r.add(createPoint(0, 1, 0, NEON_GREEN, 0.15));
        r.add(createDashedLine(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0), 0x666688));

        r.add(createLabel(`y = ${a.toFixed(1)}^x`, new THREE.Vector3(2, Math.min(Math.pow(a, 2) + 0.5, 8), 0), "#0072B2"));
        r.add(createLabel("(0, 1)", new THREE.Vector3(0.8, 1.5, 0), "#009E73"));
        r.add(createLabel("y = e^x", new THREE.Vector3(-3, 1.5, 0), "#555577"));

        scene.scene.add(r);
      },
    },
    {
      label: "역함수 대칭",
      latex: "y = a^x \\quad\\leftrightarrow\\quad y = \\log_a x",
      description:
        "지수함수와 로그함수는 y = x 직선을 기준으로 대칭입니다.",
      params: [
        { name: "base", label: "밑 a", min: 1.1, max: 5, step: 0.1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const a = params.base ?? 2;

        r.add(createCurve((x) => Math.pow(a, x), -5, 5, NEON_CYAN));
        r.add(createCurve((x) => x > 0 ? Math.log(x) / Math.log(a) : NaN, 0.01, 20, NEON_MAGENTA));
        r.add(createDashedLine(new THREE.Vector3(-5, -5, 0), new THREE.Vector3(10, 10, 0), 0xffff00, 0.3, 0.15));

        r.add(createPoint(0, 1, 0, NEON_GREEN, 0.12));
        r.add(createPoint(1, 0, 0, NEON_GREEN, 0.12));

        r.add(createLabel(`y = ${a.toFixed(1)}^x`, new THREE.Vector3(2, Math.pow(a, 2) + 0.5, 0), "#0072B2"));
        r.add(createLabel(`y = log(x)`, new THREE.Vector3(5, 2, 0), "#CC79A7"));
        r.add(createLabel("y = x", new THREE.Vector3(5, 5.5, 0), "#ffff00"));

        scene.scene.add(r);
      },
    },
    {
      label: "자연상수 e",
      latex: "e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\approx 2.718",
      description:
        "n이 커질수록 (1 + 1/n)^n은 e에 수렴합니다.",
      params: [
        { name: "n", label: "n 값", min: 1, max: 100, step: 1, default: 10 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const maxN = params.n ?? 10;

        for (let k = 1; k <= maxN; k++) {
          const val = Math.pow(1 + 1 / k, k);
          const x = (k / maxN) * 8;
          r.add(createPoint(x, val, 0, NEON_ORANGE, 0.08));
        }

        r.add(createDashedLine(new THREE.Vector3(0, Math.E, 0), new THREE.Vector3(9, Math.E, 0), 0x00ff88, 0.2, 0.1));

        const currentVal = Math.pow(1 + 1 / maxN, maxN);
        r.add(createPoint(8, currentVal, 0, NEON_GREEN, 0.18));
        r.add(createLabel(`n=${maxN}`, new THREE.Vector3(8.5, currentVal - 0.3, 0), "#009E73"));
        r.add(createLabel(`= ${currentVal.toFixed(5)}`, new THREE.Vector3(8.5, currentVal + 0.3, 0), "#009E73"));
        r.add(createLabel("e ≈ 2.71828", new THREE.Vector3(3, Math.E + 0.4, 0), "#00ff88"));

        scene.scene.add(r);
      },
    },
  ],
};
