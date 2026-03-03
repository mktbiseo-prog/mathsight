import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createDashedLine,
  createLabel,
  createBarChart,
  NEON_CYAN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

function g() {
  const group = new THREE.Group();
  group.name = "concept-content";
  return group;
}

export const sequences: ConceptData = {
  unitId: "sequences",
  title: "수열",
  steps: [
    {
      label: "등차수열",
      latex: "a_n = a_1 + (n-1)d",
      description: "등차수열은 일정한 차이(공차 d)로 증가합니다.",
      params: [
        { name: "a1", label: "첫째항 a₁", min: 1, max: 5, step: 0.5, default: 1 },
        { name: "d", label: "공차 d", min: -2, max: 3, step: 0.5, default: 1 },
        { name: "n", label: "항의 수 n", min: 2, max: 12, step: 1, default: 6 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const a1 = params.a1 ?? 1;
        const d = params.d ?? 1;
        const n = params.n ?? 6;

        const values: number[] = [];
        for (let i = 0; i < n; i++) values.push(a1 + i * d);

        const bars = createBarChart(values, 0.7, 0.15, NEON_CYAN, 0.6);
        bars.position.x = -(n * 0.85) / 2;
        r.add(bars);

        const stride = 0.85;
        for (let i = 0; i < n; i++) {
          const x = -(n * stride) / 2 + i * stride + 0.35;
          r.add(createLabel(values[i].toFixed(1), new THREE.Vector3(x, values[i] + 0.4, 0), "#0072B2", 0.8));
        }

        const sum = (n / 2) * (2 * a1 + (n - 1) * d);
        r.add(createLabel(`S = ${sum.toFixed(1)}`, new THREE.Vector3(2, Math.max(...values) + 1.2, 0), "#009E73"));

        scene.scene.add(r);
      },
    },
    {
      label: "등비수열",
      latex: "a_n = a_1 \\cdot r^{n-1}",
      description: "등비수열은 일정한 비(공비 r)로 곱해집니다.",
      params: [
        { name: "a1", label: "첫째항 a₁", min: 0.5, max: 3, step: 0.5, default: 1 },
        { name: "r", label: "공비 r", min: 0.2, max: 2.5, step: 0.1, default: 2 },
        { name: "n", label: "항의 수 n", min: 2, max: 10, step: 1, default: 6 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const a1 = params.a1 ?? 1;
        const ratio = params.r ?? 2;
        const n = params.n ?? 6;

        const values: number[] = [];
        for (let i = 0; i < n; i++) values.push(a1 * Math.pow(ratio, i));

        const clamped = values.map((v) => Math.min(v, 15));
        const bars = createBarChart(clamped, 0.7, 0.15, NEON_ORANGE, 0.6);
        bars.position.x = -(n * 0.85) / 2;
        r.add(bars);

        const stride = 0.85;
        for (let i = 0; i < n; i++) {
          const x = -(n * stride) / 2 + i * stride + 0.35;
          r.add(createLabel(
            values[i] < 100 ? values[i].toFixed(1) : values[i].toExponential(1),
            new THREE.Vector3(x, Math.min(values[i], 15) + 0.4, 0),
            "#D55E00", 0.7,
          ));
        }
        r.add(createLabel(`r = ${ratio.toFixed(1)}`, new THREE.Vector3(3, Math.min(Math.max(...clamped), 15) + 1.5, 0), "#D55E00"));

        scene.scene.add(r);
      },
    },
    {
      label: "시그마 합",
      latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
      description: "1부터 n까지의 합은 n(n+1)/2입니다.",
      params: [
        { name: "n", label: "n", min: 2, max: 10, step: 1, default: 5 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const n = params.n ?? 5;
        const sc = 0.6;

        for (let i = 1; i <= n; i++) {
          for (let j = 0; j < i; j++) {
            const block = new THREE.Mesh(
              new THREE.PlaneGeometry(sc * 0.9, sc * 0.9),
              new THREE.MeshBasicMaterial({ color: NEON_CYAN, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
            );
            block.position.set((i - 1) * sc, j * sc + sc / 2, 0);
            r.add(block);
          }
        }
        for (let i = 1; i <= n; i++) {
          for (let j = i; j <= n; j++) {
            const block = new THREE.Mesh(
              new THREE.PlaneGeometry(sc * 0.9, sc * 0.9),
              new THREE.MeshBasicMaterial({ color: NEON_MAGENTA, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
            );
            block.position.set((i - 1) * sc, j * sc - sc / 2, 0);
            r.add(block);
          }
        }

        const sum = (n * (n + 1)) / 2;
        r.add(createLabel(`Σ = ${sum}`, new THREE.Vector3(n * sc + 0.5, n * sc / 2, 0), "#009E73"));
        r.add(createLabel(`${n}×${n + 1}/2`, new THREE.Vector3(n * sc + 0.5, n * sc / 2 - 0.8, 0), "#009E73", 1.0));

        scene.scene.add(r);
      },
    },
    {
      label: "등비급수 수렴",
      latex: "S = \\frac{a}{1-r}\\quad (|r| < 1)",
      description: "|r| < 1일 때 등비급수는 a/(1-r)에 수렴합니다.",
      params: [
        { name: "r", label: "공비 r", min: -0.95, max: 1.5, step: 0.05, default: 0.5 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const ratio = params.r ?? 0.5;
        const a = 1;
        const maxTerms = 20;

        const sums: number[] = [];
        let partial = 0;
        for (let k = 0; k < maxTerms; k++) {
          partial += a * Math.pow(ratio, k);
          sums.push(partial);
        }

        const pts: THREE.Vector3[] = [];
        for (let k = 0; k < maxTerms; k++) {
          const x = k * 0.5;
          if (!isFinite(sums[k]) || Math.abs(sums[k]) > 50) break;
          r.add(createPoint(x, sums[k], 0, NEON_CYAN, 0.1));
          pts.push(new THREE.Vector3(x, sums[k], 0));
        }

        if (pts.length > 1) {
          r.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: NEON_CYAN, transparent: true, opacity: 0.5 }),
          ));
        }

        if (Math.abs(ratio) < 1) {
          const S = a / (1 - ratio);
          r.add(createDashedLine(new THREE.Vector3(0, S, 0), new THREE.Vector3(10, S, 0), 0x00ff88, 0.2, 0.1));
          r.add(createLabel(`S = ${S.toFixed(3)}`, new THREE.Vector3(5, S + 0.5, 0), "#00ff88"));
        } else {
          r.add(createLabel("|r| ≥ 1 → 발산", new THREE.Vector3(3, 5, 0), "#ff4444"));
        }
        r.add(createLabel(`r = ${ratio.toFixed(2)}`, new THREE.Vector3(0, -1, 0), "#0072B2"));

        scene.scene.add(r);
      },
    },
  ],
};
