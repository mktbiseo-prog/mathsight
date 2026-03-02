import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createArrow,
  createDashedLine,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

export const vectorOperations: ConceptData = {
  unitId: "vector-operations",
  title: "벡터의 연산과 내적",
  steps: [
    {
      label: "벡터의 덧셈",
      latex: "\\vec{a} + \\vec{b} = (a_1+b_1,\\, a_2+b_2)",
      description:
        "두 벡터의 덧셈은 평행사변형법으로 시각화할 수 있습니다. a와 b를 조절해보세요.",
      params: [
        { name: "ax", label: "a_x", min: -4, max: 4, step: 0.5, default: 3 },
        { name: "ay", label: "a_y", min: -4, max: 4, step: 0.5, default: 1 },
        { name: "bx", label: "b_x", min: -4, max: 4, step: 0.5, default: 1 },
        { name: "by", label: "b_y", min: -4, max: 4, step: 0.5, default: 3 },
      ],
      render: ({ scene, params }) => {
        const ax = params.ax ?? 3, ay = params.ay ?? 1;
        const bx = params.bx ?? 1, by = params.by ?? 3;
        const O = new THREE.Vector3(0, 0, 0);

        // Vector a
        const arrowA = createArrow(O, new THREE.Vector3(ax, ay, 0), NEON_CYAN, 0.3, 0.12);
        arrowA.name = "concept-a";
        scene.scene.add(arrowA);

        // Vector b
        const arrowB = createArrow(O, new THREE.Vector3(bx, by, 0), NEON_GREEN, 0.3, 0.12);
        arrowB.name = "concept-b";
        scene.scene.add(arrowB);

        // Sum vector a + b
        const sum = createArrow(O, new THREE.Vector3(ax + bx, ay + by, 0), NEON_MAGENTA, 0.3, 0.12);
        sum.name = "concept-sum";
        scene.scene.add(sum);

        // Parallelogram dashed lines
        const d1 = createDashedLine(
          new THREE.Vector3(ax, ay, 0),
          new THREE.Vector3(ax + bx, ay + by, 0),
          0x666688,
        );
        d1.name = "concept-d1";
        scene.scene.add(d1);

        const d2 = createDashedLine(
          new THREE.Vector3(bx, by, 0),
          new THREE.Vector3(ax + bx, ay + by, 0),
          0x666688,
        );
        d2.name = "concept-d2";
        scene.scene.add(d2);

        const lblA = createLabel("a", new THREE.Vector3(ax / 2 + 0.3, ay / 2 - 0.3, 0), "#00f0ff", 0.8);
        lblA.name = "concept-lbl-a";
        scene.scene.add(lblA);

        const lblB = createLabel("b", new THREE.Vector3(bx / 2 - 0.3, by / 2 + 0.3, 0), "#39ff14", 0.8);
        lblB.name = "concept-lbl-b";
        scene.scene.add(lblB);

        const lblS = createLabel("a+b", new THREE.Vector3((ax + bx) / 2 + 0.5, (ay + by) / 2, 0), "#ff00ff", 0.8);
        lblS.name = "concept-lbl-sum";
        scene.scene.add(lblS);
      },
    },
    {
      label: "스칼라배",
      latex: "k\\vec{a} = (ka_1,\\, ka_2)",
      description:
        "벡터에 스칼라를 곱하면 방향은 같고 크기가 변합니다. k < 0이면 방향이 반대가 됩니다.",
      params: [
        { name: "k", label: "k", min: -3, max: 3, step: 0.1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const k = params.k ?? 2;
        const ax = 2, ay = 1;
        const O = new THREE.Vector3(0, 0, 0);

        // Original vector
        const arrowA = createArrow(O, new THREE.Vector3(ax, ay, 0), NEON_CYAN, 0.3, 0.12);
        arrowA.name = "concept-a";
        scene.scene.add(arrowA);

        // Scaled vector
        const color = k >= 0 ? NEON_GREEN : NEON_ORANGE;
        const arrowKA = createArrow(O, new THREE.Vector3(k * ax, k * ay, 0), color, 0.3, 0.12);
        arrowKA.name = "concept-ka";
        scene.scene.add(arrowKA);

        const lblA = createLabel("a", new THREE.Vector3(ax + 0.3, ay + 0.3, 0), "#00f0ff", 0.8);
        lblA.name = "concept-lbl-a";
        scene.scene.add(lblA);

        const lblK = createLabel(
          `${k.toFixed(1)}a`,
          new THREE.Vector3(k * ax + 0.4, k * ay + 0.3, 0),
          k >= 0 ? "#39ff14" : "#ff6600",
          0.8,
        );
        lblK.name = "concept-lbl-k";
        scene.scene.add(lblK);
      },
    },
    {
      label: "내적",
      latex: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta",
      description:
        "내적은 두 벡터가 얼마나 같은 방향인지를 나타냅니다. θ가 90°이면 내적은 0 (수직).",
      params: [
        { name: "theta", label: "θ (도)", min: 0, max: 180, step: 5, default: 45 },
      ],
      render: ({ scene, params }) => {
        const theta = ((params.theta ?? 45) * Math.PI) / 180;
        const lenA = 3, lenB = 2.5;
        const O = new THREE.Vector3(0, 0, 0);

        const ax = lenA, ay = 0;
        const bx = lenB * Math.cos(theta), by = lenB * Math.sin(theta);

        const arrowA = createArrow(O, new THREE.Vector3(ax, ay, 0), NEON_CYAN, 0.3, 0.12);
        arrowA.name = "concept-a";
        scene.scene.add(arrowA);

        const arrowB = createArrow(O, new THREE.Vector3(bx, by, 0), NEON_GREEN, 0.3, 0.12);
        arrowB.name = "concept-b";
        scene.scene.add(arrowB);

        // Angle arc
        const arcPts: THREE.Vector3[] = [];
        const arcR = 0.8;
        for (let i = 0; i <= 30; i++) {
          const t = (i / 30) * theta;
          arcPts.push(new THREE.Vector3(arcR * Math.cos(t), arcR * Math.sin(t), 0));
        }
        const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPts);
        const arcMat = new THREE.LineBasicMaterial({ color: NEON_MAGENTA });
        const arc = new THREE.Line(arcGeom, arcMat);
        arc.name = "concept-arc";
        scene.scene.add(arc);

        const dot = lenA * lenB * Math.cos(theta);
        const lbl = createLabel(
          `a·b = ${dot.toFixed(1)}`,
          new THREE.Vector3(2, 3, 0),
          "#ff00ff",
          1,
        );
        lbl.name = "concept-dot-lbl";
        scene.scene.add(lbl);

        const lblTheta = createLabel(
          `θ = ${(params.theta ?? 45).toFixed(0)}°`,
          new THREE.Vector3(1.2, 0.6, 0),
          "#ff00ff",
          0.7,
        );
        lblTheta.name = "concept-theta-lbl";
        scene.scene.add(lblTheta);
      },
    },
    {
      label: "정사영",
      latex: "\\text{proj}_{\\vec{a}} \\vec{b} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|^2} \\vec{a}",
      description:
        "벡터 b를 a 위에 정사영하면, b에서 a 방향 성분만 추출합니다. θ를 바꿔 정사영 크기를 관찰하세요.",
      params: [
        { name: "theta", label: "θ (도)", min: 0, max: 180, step: 5, default: 30 },
      ],
      render: ({ scene, params }) => {
        const theta = ((params.theta ?? 30) * Math.PI) / 180;
        const lenA = 4, lenB = 3;
        const O = new THREE.Vector3(0, 0, 0);

        const ax = lenA, ay = 0;
        const bx = lenB * Math.cos(theta), by = lenB * Math.sin(theta);

        // a vector (along x-axis)
        const arrowA = createArrow(O, new THREE.Vector3(ax, ay, 0), NEON_CYAN, 0.3, 0.12);
        arrowA.name = "concept-a";
        scene.scene.add(arrowA);

        // b vector
        const arrowB = createArrow(O, new THREE.Vector3(bx, by, 0), NEON_GREEN, 0.3, 0.12);
        arrowB.name = "concept-b";
        scene.scene.add(arrowB);

        // Projection
        const projLen = lenB * Math.cos(theta);
        const projVec = new THREE.Vector3(projLen, 0, 0);
        const arrowProj = createArrow(O, projVec, NEON_MAGENTA, 0.25, 0.1);
        arrowProj.name = "concept-proj";
        scene.scene.add(arrowProj);

        // Perpendicular dashed line from b endpoint to projection
        const perpLine = createDashedLine(
          new THREE.Vector3(bx, by, 0),
          new THREE.Vector3(projLen, 0, 0),
          0xff6600,
        );
        perpLine.name = "concept-perp";
        scene.scene.add(perpLine);

        // Right angle marker
        const rmSize = 0.3;
        const rmPts = [
          new THREE.Vector3(projLen, rmSize, 0),
          new THREE.Vector3(projLen - rmSize, rmSize, 0),
          new THREE.Vector3(projLen - rmSize, 0, 0),
        ];
        const rmGeom = new THREE.BufferGeometry().setFromPoints(rmPts);
        const rmMat = new THREE.LineBasicMaterial({ color: 0xff6600 });
        const rm = new THREE.Line(rmGeom, rmMat);
        rm.name = "concept-rm";
        scene.scene.add(rm);

        const lblProj = createLabel(
          `정사영 = ${projLen.toFixed(1)}`,
          new THREE.Vector3(projLen / 2, -0.8, 0),
          "#ff00ff",
          0.8,
        );
        lblProj.name = "concept-lbl-proj";
        scene.scene.add(lblProj);
      },
    },
  ],
};
