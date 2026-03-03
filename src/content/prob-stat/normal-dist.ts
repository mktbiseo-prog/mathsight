import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createDashedLine,
  createLabel,
  createShadedRegion,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";

const PI = Math.PI;

function normalPDF(x: number, mu: number, sigma: number): number {
  const coeff = 1 / (sigma * Math.sqrt(2 * PI));
  return coeff * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

export const normalDist: ConceptData = {
  unitId: "normal-dist",
  title: "정규분포",
  steps: [
    {
      label: "정규분포 곡선",
      latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
      description:
        "정규분포는 평균(μ) 주위로 종 모양의 대칭 곡선을 그립니다. μ와 σ를 변화시켜 모양 변화를 관찰하세요.",
      params: [
        { name: "mu", label: "평균 μ", min: -3, max: 3, step: 0.1, default: 0 },
        { name: "sigma", label: "표준편차 σ", min: 0.3, max: 3, step: 0.1, default: 1 },
      ],
      render: ({ scene, params }) => {
        const mu = params.mu ?? 0;
        const sigma = params.sigma ?? 1;

        const curve = createCurve(
          (x) => normalPDF(x, mu, sigma) * 5,
          -8, 8,
          NEON_CYAN,
          400,
        );
        curve.name = "concept-bell";
        scene.scene.add(curve);

        // Mean line
        scene.scene.add(createDashedLine(
          new THREE.Vector3(mu, 0, 0),
          new THREE.Vector3(mu, normalPDF(mu, mu, sigma) * 5 + 0.3, 0),
          0xffff00,
        ));

        // σ markers
        scene.scene.add(createDashedLine(
          new THREE.Vector3(mu - sigma, 0, 0),
          new THREE.Vector3(mu - sigma, normalPDF(mu - sigma, mu, sigma) * 5, 0),
          0xff8888,
          0.15,
          0.1,
        ));
        scene.scene.add(createDashedLine(
          new THREE.Vector3(mu + sigma, 0, 0),
          new THREE.Vector3(mu + sigma, normalPDF(mu + sigma, mu, sigma) * 5, 0),
          0xff8888,
          0.15,
          0.1,
        ));

        scene.scene.add(createLabel(`μ = ${mu.toFixed(1)}`, new THREE.Vector3(mu, normalPDF(mu, mu, sigma) * 5 + 0.6, 0), "#ffff00"));
        scene.scene.add(createLabel(`σ = ${sigma.toFixed(1)}`, new THREE.Vector3(mu + sigma + 0.5, 1, 0), "#ff8888"));
      },
    },
    {
      label: "표준정규분포 변환",
      latex: "Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)",
      description:
        "어떤 정규분포든 Z = (X-μ)/σ 변환으로 N(0,1)이 됩니다. 원래 곡선과 표준화된 곡선을 비교하세요.",
      params: [
        { name: "mu", label: "평균 μ", min: -3, max: 3, step: 0.5, default: 2 },
        { name: "sigma", label: "표준편차 σ", min: 0.5, max: 3, step: 0.1, default: 1.5 },
      ],
      render: ({ scene, params }) => {
        const mu = params.mu ?? 2;
        const sigma = params.sigma ?? 1.5;

        // Original N(μ, σ)
        const original = createCurve(
          (x) => normalPDF(x, mu, sigma) * 5,
          -8, 8,
          NEON_MAGENTA,
          400,
        );
        original.name = "concept-original";
        scene.scene.add(original);

        // Standard N(0, 1)
        const standard = createCurve(
          (x) => normalPDF(x, 0, 1) * 5,
          -8, 8,
          NEON_CYAN,
          400,
        );
        standard.name = "concept-standard";
        scene.scene.add(standard);

        scene.scene.add(createLabel(`N(${mu.toFixed(1)}, ${sigma.toFixed(1)}²)`, new THREE.Vector3(mu + 1, normalPDF(mu, mu, sigma) * 5 + 0.5, 0), "#CC79A7"));
        scene.scene.add(createLabel("N(0, 1)", new THREE.Vector3(1.5, normalPDF(0, 0, 1) * 5 + 0.5, 0), "#0072B2"));
      },
    },
    {
      label: "넓이 = 확률",
      latex: "P(a \\le Z \\le b) = \\int_a^b f(z)\\,dz",
      description:
        "정규분포에서 구간의 넓이가 곧 확률입니다. z₁과 z₂를 조절해 음영 구간의 확률을 확인하세요.",
      params: [
        { name: "zLow", label: "z₁ (하한)", min: -3, max: 3, step: 0.1, default: -1 },
        { name: "zHigh", label: "z₂ (상한)", min: -3, max: 3, step: 0.1, default: 1 },
      ],
      render: ({ scene, params }) => {
        const z1 = params.zLow ?? -1;
        const z2 = params.zHigh ?? 1;
        const lo = Math.min(z1, z2);
        const hi = Math.max(z1, z2);

        // Bell curve
        const curve = createCurve(
          (x) => normalPDF(x, 0, 1) * 5,
          -5, 5,
          NEON_CYAN,
          400,
        );
        curve.name = "concept-bell";
        scene.scene.add(curve);

        // Shaded area
        const shaded = createShadedRegion(
          (x) => normalPDF(x, 0, 1) * 5,
          lo, hi,
          NEON_GREEN,
          0.4,
        );
        shaded.name = "concept-shade";
        scene.scene.add(shaded);

        // Approximate probability using erf
        const erf = (x: number) => {
          const t = 1 / (1 + 0.3275911 * Math.abs(x));
          const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
          const val = 1 - poly * Math.exp(-x * x);
          return x >= 0 ? val : -val;
        };
        const cdf = (z: number) => 0.5 * (1 + erf(z / Math.sqrt(2)));
        const prob = cdf(hi) - cdf(lo);

        scene.scene.add(createLabel(
          `P(${lo.toFixed(1)} ≤ Z ≤ ${hi.toFixed(1)}) = ${(prob * 100).toFixed(1)}%`,
          new THREE.Vector3(0, normalPDF(0, 0, 1) * 5 + 0.8, 0),
          "#009E73",
        ));
      },
    },
  ],
};
