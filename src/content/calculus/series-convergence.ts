import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createDashedLine,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";

export const seriesConvergence: ConceptData = {
  unitId: "series-convergence",
  title: "급수의 수렴/발산",
  steps: [
    {
      label: "수열의 극한",
      latex: "a_n = \\frac{1}{n} \\to 0 \\quad (n \\to \\infty)",
      description:
        "수열 1/n은 n이 커질수록 0에 수렴합니다. 각 점이 0에 가까워지는 것을 관찰하세요.",
      render: ({ scene }) => {
        for (let n = 1; n <= 20; n++) {
          const val = 1 / n;
          const pt = createPoint(n * 0.4, val, 0, NEON_CYAN, 0.08);
          pt.name = `concept-pt-${n}`;
          scene.scene.add(pt);
        }

        // y=0 reference
        const zero = createDashedLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(9, 0, 0),
          0x39ff14,
        );
        zero.name = "concept-zero";
        scene.scene.add(zero);

        const lbl = createLabel("→ 0", new THREE.Vector3(9, 0.3, 0), "#39ff14", 1);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);
      },
    },
    {
      label: "부분합",
      latex: "S_n = \\sum_{k=1}^{n} a_k",
      description:
        "급수의 부분합 Sn을 그려봅니다. 등비급수 Σ(1/2)^k의 부분합이 1에 수렴하는 과정입니다.",
      params: [
        { name: "n", label: "항 수", min: 1, max: 20, step: 1, default: 5 },
      ],
      render: ({ scene, params }) => {
        const n = Math.round(params.n ?? 5);
        let sum = 0;

        for (let k = 1; k <= n; k++) {
          sum += Math.pow(0.5, k);
          const pt = createPoint(k * 0.4, sum, 0, NEON_CYAN, 0.1);
          pt.name = `concept-pt-${k}`;
          scene.scene.add(pt);
        }

        // Connect points with line
        const pts: THREE.Vector3[] = [];
        let s = 0;
        for (let k = 1; k <= n; k++) {
          s += Math.pow(0.5, k);
          pts.push(new THREE.Vector3(k * 0.4, s, 0));
        }
        if (pts.length > 1) {
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          const mat = new THREE.LineBasicMaterial({ color: NEON_CYAN });
          const line = new THREE.Line(geom, mat);
          line.name = "concept-partial-line";
          scene.scene.add(line);
        }

        // Convergence line y=1
        const conv = createDashedLine(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(9, 1, 0),
          0xff00ff,
        );
        conv.name = "concept-conv";
        scene.scene.add(conv);

        const lbl = createLabel(
          `S${n} = ${sum.toFixed(4)}`,
          new THREE.Vector3(n * 0.4 + 1, sum, 0),
          "#00f0ff",
          1,
        );
        lbl.name = "concept-sum-lbl";
        scene.scene.add(lbl);

        const convLbl = createLabel("수렴값 = 1", new THREE.Vector3(7, 1.3, 0), "#ff00ff", 1);
        convLbl.name = "concept-conv-lbl";
        scene.scene.add(convLbl);
      },
    },
    {
      label: "등비급수 공식",
      latex: "\\sum_{k=1}^{\\infty} r^k = \\frac{r}{1-r} \\quad (|r| < 1)",
      description:
        "공비 r의 절댓값이 1보다 작으면 등비급수가 수렴합니다. r을 바꿔가며 수렴 속도를 비교하세요.",
      params: [
        { name: "r", label: "공비 r", min: 0.1, max: 0.95, step: 0.05, default: 0.5 },
      ],
      render: ({ scene, params }) => {
        const r = params.r ?? 0.5;
        const exactSum = r / (1 - r);

        let sum = 0;
        for (let k = 1; k <= 30; k++) {
          sum += Math.pow(r, k);
          const pt = createPoint(k * 0.3, sum, 0, NEON_GREEN, 0.06);
          pt.name = `concept-pt-${k}`;
          scene.scene.add(pt);
        }

        // Convergence line
        const conv = createDashedLine(
          new THREE.Vector3(0, exactSum, 0),
          new THREE.Vector3(10, exactSum, 0),
          0xff00ff,
        );
        conv.name = "concept-conv-line";
        scene.scene.add(conv);

        const lbl = createLabel(
          `r/(1-r) = ${exactSum.toFixed(3)}`,
          new THREE.Vector3(7, exactSum + 0.5, 0),
          "#ff00ff",
          1,
        );
        lbl.name = "concept-conv-lbl";
        scene.scene.add(lbl);
      },
    },
    {
      label: "발산하는 급수",
      latex: "\\sum_{k=1}^{\\infty} \\frac{1}{k} = \\infty \\quad (\\text{조화급수})",
      description:
        "조화급수 Σ(1/k)는 발산합니다. 수렴하는 Σ(1/k²)와 비교하면, 발산/수렴의 차이가 보입니다.",
      render: ({ scene }) => {
        // Harmonic series (diverges)
        let harmonic = 0;
        for (let k = 1; k <= 30; k++) {
          harmonic += 1 / k;
          const pt = createPoint(k * 0.3, harmonic, 0, NEON_MAGENTA, 0.06);
          pt.name = `concept-harm-${k}`;
          scene.scene.add(pt);
        }

        // Basel series (converges to π²/6)
        let basel = 0;
        for (let k = 1; k <= 30; k++) {
          basel += 1 / (k * k);
          const pt = createPoint(k * 0.3, basel, 0, NEON_GREEN, 0.06);
          pt.name = `concept-basel-${k}`;
          scene.scene.add(pt);
        }

        const conv = createDashedLine(
          new THREE.Vector3(0, Math.PI * Math.PI / 6, 0),
          new THREE.Vector3(10, Math.PI * Math.PI / 6, 0),
          0x39ff14,
        );
        conv.name = "concept-conv";
        scene.scene.add(conv);

        const lblH = createLabel("Σ 1/k (발산)", new THREE.Vector3(7, harmonic - 0.5, 0), "#ff00ff", 0.8);
        lblH.name = "concept-lbl-harm";
        scene.scene.add(lblH);

        const lblB = createLabel("Σ 1/k² (수렴)", new THREE.Vector3(7, basel + 0.5, 0), "#39ff14", 0.8);
        lblB.name = "concept-lbl-basel";
        scene.scene.add(lblB);
      },
    },
  ],
};
