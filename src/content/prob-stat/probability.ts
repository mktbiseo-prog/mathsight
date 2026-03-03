import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

function g() {
  const group = new THREE.Group();
  group.name = "concept-content";
  return group;
}

export const probability: ConceptData = {
  unitId: "probability",
  title: "확률",
  steps: [
    {
      label: "확률의 정의",
      latex: "P(A) = \\frac{\\text{사건 A의 경우의 수}}{\\text{전체 경우의 수}}",
      description: "확률은 전체 중 원하는 결과가 나올 비율입니다.",
      params: [
        { name: "favorable", label: "유리한 경우의 수", min: 0, max: 6, step: 1, default: 3 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const fav = params.favorable ?? 3;
        const total = 6;

        for (let i = 0; i < total; i++) {
          const block = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.8),
            new THREE.MeshBasicMaterial({
              color: i < fav ? NEON_GREEN : 0x555577,
              transparent: true,
              opacity: i < fav ? 0.8 : 0.3,
              side: THREE.DoubleSide,
            }),
          );
          block.position.set(i * 1.0 - 2.5, 1.5, 0);
          r.add(block);
          r.add(createLabel(String(i + 1), new THREE.Vector3(i * 1.0 - 2.5, 1.5, 0), i < fav ? "#009E73" : "#777", 0.7));
        }

        const prob = fav / total;
        r.add(createLabel(`P = ${fav}/${total} = ${prob.toFixed(3)}`, new THREE.Vector3(0, -0.5, 0), "#0072B2"));

        scene.scene.add(r);
      },
    },
    {
      label: "큰 수의 법칙",
      latex: "\\bar{X}_n \\xrightarrow{n \\to \\infty} \\mu",
      description: "시행 횟수가 많아질수록 실험 평균은 이론적 기댓값에 수렴합니다.",
      params: [
        { name: "trials", label: "시행 횟수", min: 10, max: 500, step: 10, default: 100 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const trials = params.trials ?? 100;
        const expected = 3.5;
        const sc = 8 / trials;

        let sum = 0;
        const pts: THREE.Vector3[] = [];
        const rng = (seed: number) => {
          let s = seed;
          return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s % 6) + 1; };
        };
        const roll = rng(42);

        for (let i = 1; i <= trials; i++) {
          sum += roll();
          const avg = sum / i;
          pts.push(new THREE.Vector3(i * sc, avg, 0));
        }

        if (pts.length > 1) {
          r.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: NEON_CYAN }),
          ));
        }

        r.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, expected, 0),
            new THREE.Vector3(trials * sc, expected, 0),
          ]),
          new THREE.LineBasicMaterial({ color: 0xff8888 }),
        ));

        r.add(createLabel(`E[X] = ${expected}`, new THREE.Vector3(trials * sc / 2, expected + 0.5, 0), "#ff8888"));
        r.add(createLabel(`n = ${trials}`, new THREE.Vector3(trials * sc, pts[pts.length - 1].y + 0.5, 0), "#0072B2"));

        scene.scene.add(r);
      },
    },
    {
      label: "조건부 확률",
      latex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
      description: "B가 일어났을 때 A가 일어날 확률.",
      params: [
        { name: "pAB", label: "P(A∩B) (%)", min: 5, max: 50, step: 5, default: 20 },
        { name: "pB", label: "P(B) (%)", min: 10, max: 80, step: 5, default: 40 },
      ],
      render: ({ scene, params }) => {
        const r = g();
        const pAB = (params.pAB ?? 20) / 100;
        const pB = Math.max((params.pB ?? 40) / 100, pAB + 0.01);
        const pAgivenB = pAB / pB;
        const scFactor = 3;

        r.add(new THREE.Mesh(
          new THREE.RingGeometry(pB * scFactor - 0.05, pB * scFactor, 64),
          new THREE.MeshBasicMaterial({ color: NEON_ORANGE, side: THREE.DoubleSide }),
        ));
        const aRing = new THREE.Mesh(
          new THREE.RingGeometry(0.3 * scFactor - 0.05, 0.3 * scFactor, 64),
          new THREE.MeshBasicMaterial({ color: NEON_CYAN, side: THREE.DoubleSide }),
        );
        aRing.position.set(-0.5, 0, 0);
        r.add(aRing);

        r.add(createPoint(0, 0, 0, NEON_GREEN, pAB * scFactor));

        r.add(createLabel("A", new THREE.Vector3(-1.5, 1.5, 0), "#0072B2"));
        r.add(createLabel("B", new THREE.Vector3(2, 1.5, 0), "#D55E00"));
        r.add(createLabel("A∩B", new THREE.Vector3(0, -0.5, 0), "#009E73", 0.8));
        r.add(createLabel(
          `P(A|B) = ${pAB.toFixed(2)} / ${pB.toFixed(2)} = ${pAgivenB.toFixed(3)}`,
          new THREE.Vector3(0, -2.5, 0), "#009E73",
        ));

        scene.scene.add(r);
      },
    },
  ],
};
