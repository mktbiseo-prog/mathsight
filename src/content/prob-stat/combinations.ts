import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createLabel,
  createBarChart,
  NEON_CYAN,
  NEON_GREEN,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function nCr(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function nPr(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  return factorial(n) / factorial(n - r);
}

export const combinations: ConceptData = {
  unitId: "combinations",
  title: "순열과 조합",
  steps: [
    // Step 1: 순열 nPr
    {
      label: "순열 nPr",
      latex: "P(n,r) = \\frac{n!}{(n-r)!}",
      description:
        "n개에서 r개를 뽑아 순서대로 나열하는 방법의 수입니다. 컬러 블록의 배열 경우의 수를 확인하세요.",
      params: [
        { name: "n", label: "n (전체)", min: 2, max: 8, step: 1, default: 4 },
        { name: "r", label: "r (선택)", min: 1, max: 8, step: 1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const n = params.n ?? 4;
        const r = Math.min(params.r ?? 2, n);
        const total = nPr(n, r);

        // Show n colored blocks
        const colors = [0x1976D2, 0xD32F2F, 0x2E7D32, 0xF57F17, 0x7B1FA2, 0xE65100, 0x00796B, 0xC62828];
        for (let i = 0; i < n; i++) {
          const geom = new THREE.PlaneGeometry(0.7, 0.7);
          const mat = new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: i < r ? 0.9 : 0.25,
            side: THREE.DoubleSide,
          });
          const block = new THREE.Mesh(geom, mat);
          block.position.set(i * 0.9 - (n * 0.9) / 2, 2, 0);
          scene.scene.add(block);
        }

        scene.scene.add(createLabel(
          `P(${n}, ${r}) = ${total}`,
          new THREE.Vector3(0, 0.5, 0),
          "#0072B2",
        ));
        scene.scene.add(createLabel(
          `${n}! / ${n - r}! = ${factorial(n)} / ${factorial(n - r)}`,
          new THREE.Vector3(0, -0.5, 0),
          "#555577",
          1.0,
        ));
      },
    },

    // Step 2: 조합 nCr
    {
      label: "조합 nCr",
      latex: "C(n,r) = \\frac{n!}{r!(n-r)!}",
      description:
        "순서를 고려하지 않고 r개를 뽑는 방법의 수. 순열에서 r!로 나누면 됩니다.",
      params: [
        { name: "n", label: "n (전체)", min: 2, max: 10, step: 1, default: 5 },
        { name: "r", label: "r (선택)", min: 0, max: 10, step: 1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const n = params.n ?? 5;
        const r = Math.min(params.r ?? 2, n);
        const pVal = nPr(n, r);
        const cVal = nCr(n, r);

        // Bar comparison
        const maxBar = Math.max(pVal, 1);
        const pBar = [pVal / maxBar * 5];
        const cBar = [cVal / maxBar * 5];

        const barsP = createBarChart(pBar, 1.5, 0, NEON_ORANGE, 0.6);
        barsP.position.set(-2, 0, 0);
        scene.scene.add(barsP);

        const barsC = createBarChart(cBar, 1.5, 0, NEON_GREEN, 0.6);
        barsC.position.set(1, 0, 0);
        scene.scene.add(barsC);

        scene.scene.add(createLabel(`P = ${pVal}`, new THREE.Vector3(-1.2, pBar[0] + 0.5, 0), "#D55E00"));
        scene.scene.add(createLabel(`C = ${cVal}`, new THREE.Vector3(1.8, cBar[0] + 0.5, 0), "#009E73"));
        scene.scene.add(createLabel(
          `C = P / ${r}! = ${pVal} / ${factorial(r)}`,
          new THREE.Vector3(0, -1, 0),
          "#555577",
          1.0,
        ));
      },
    },

    // Step 3: 파스칼 삼각형
    {
      label: "파스칼 삼각형",
      latex: "C(n,r) = C(n-1,r-1) + C(n-1,r)",
      description:
        "파스칼 삼각형의 각 숫자는 바로 위 두 숫자의 합입니다. 이것이 조합의 재귀 관계를 보여줍니다.",
      params: [
        { name: "rows", label: "행 수", min: 3, max: 10, step: 1, default: 6 },
      ],
      render: ({ scene, params }) => {
        const rows = params.rows ?? 6;
        const spacing = 1.2;

        for (let n = 0; n < rows; n++) {
          for (let r = 0; r <= n; r++) {
            const val = nCr(n, r);
            const x = (r - n / 2) * spacing;
            const y = (rows / 2 - n) * spacing;

            scene.scene.add(createPoint(x, y, 0, NEON_CYAN, 0.3));
            scene.scene.add(createLabel(
              String(val),
              new THREE.Vector3(x, y, 0),
              "#0072B2",
              0.7,
            ));
          }
        }

        scene.scene.add(createLabel(
          "C(n,r) = C(n-1,r-1) + C(n-1,r)",
          new THREE.Vector3(0, (rows / 2 + 1) * spacing, 0),
          "#009E73",
          1.0,
        ));
      },
    },

    // Step 4: 이항분포
    {
      label: "이항분포",
      latex: "P(X=k) = C(n,k)\\,p^k(1-p)^{n-k}",
      description:
        "이항분포 B(n, p)의 확률 분포. n과 p를 변화시키면 분포 모양이 달라집니다. n이 크면 정규분포에 가까워집니다.",
      params: [
        { name: "n", label: "시행 횟수 n", min: 2, max: 20, step: 1, default: 10 },
        { name: "p", label: "성공 확률 p", min: 0.05, max: 0.95, step: 0.05, default: 0.5 },
      ],
      render: ({ scene, params }) => {
        const n = params.n ?? 10;
        const p = params.p ?? 0.5;

        const probs: number[] = [];
        for (let k = 0; k <= n; k++) {
          probs.push(nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k));
        }

        // Scale for visualization
        const maxP = Math.max(...probs);
        const scaled = probs.map((v) => (v / maxP) * 5);

        const bars = createBarChart(scaled, 0.5, 0.08, NEON_CYAN, 0.6);
        bars.name = "concept-bars";
        bars.position.x = -((n + 1) * 0.58) / 2;
        scene.scene.add(bars);

        // Mean and variance
        const mean = n * p;
        const variance = n * p * (1 - p);

        scene.scene.add(createLabel(
          `B(${n}, ${p.toFixed(2)})`,
          new THREE.Vector3(0, 6.5, 0),
          "#0072B2",
        ));
        scene.scene.add(createLabel(
          `E[X] = ${mean.toFixed(1)}, Var = ${variance.toFixed(2)}`,
          new THREE.Vector3(0, -1, 0),
          "#009E73",
          1.0,
        ));
      },
    },
  ],
};
