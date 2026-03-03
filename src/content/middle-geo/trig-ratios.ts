import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createDashedLine,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

const PI = Math.PI;

export const trigRatios: ConceptData = {
  unitId: "trig-ratios",
  title: "삼각비",
  steps: [
    // Step 1: 직각삼각형 조작
    {
      label: "직각삼각형",
      latex: "\\sin\\theta = \\frac{\\text{대변}}{\\text{빗변}},\\quad \\cos\\theta = \\frac{\\text{밑변}}{\\text{빗변}}",
      description:
        "각도를 조절하면 직각삼각형의 모양이 바뀝니다. sin, cos, tan 값이 실시간으로 변하는 것을 관찰하세요.",
      params: [
        { name: "angle", label: "각도 θ (°)", min: 5, max: 85, step: 1, default: 30 },
      ],
      render: ({ scene, params }) => {
        const deg = params.angle ?? 30;
        const rad = (deg * PI) / 180;
        const hyp = 4; // hypotenuse length
        const adj = hyp * Math.cos(rad); // adjacent
        const opp = hyp * Math.sin(rad); // opposite

        // Triangle vertices
        const A = new THREE.Vector3(0, 0, 0);
        const B = new THREE.Vector3(adj, 0, 0);
        const C = new THREE.Vector3(adj, opp, 0);

        // Triangle edges
        const lineGeom = new THREE.BufferGeometry().setFromPoints([A, B, C, A]);
        const lineMat = new THREE.LineBasicMaterial({ color: NEON_CYAN });
        const tri = new THREE.Line(lineGeom, lineMat);
        tri.name = "concept-triangle";
        scene.scene.add(tri);

        // Right angle marker
        const sq = 0.3;
        const sqPts = [
          new THREE.Vector3(adj - sq, 0, 0),
          new THREE.Vector3(adj - sq, sq, 0),
          new THREE.Vector3(adj, sq, 0),
        ];
        const sqGeom = new THREE.BufferGeometry().setFromPoints(sqPts);
        scene.scene.add(new THREE.Line(sqGeom, new THREE.LineBasicMaterial({ color: 0x888888 })));

        // Points
        scene.scene.add(createPoint(0, 0, 0, NEON_GREEN, 0.1));
        scene.scene.add(createPoint(adj, 0, 0, NEON_GREEN, 0.1));
        scene.scene.add(createPoint(adj, opp, 0, NEON_GREEN, 0.1));

        // Side labels
        scene.scene.add(createLabel(`밑변 = ${adj.toFixed(2)}`, new THREE.Vector3(adj / 2, -0.5, 0), "#0072B2", 0.9));
        scene.scene.add(createLabel(`대변 = ${opp.toFixed(2)}`, new THREE.Vector3(adj + 0.7, opp / 2, 0), "#D55E00", 0.9));
        scene.scene.add(createLabel(`빗변 = ${hyp.toFixed(1)}`, new THREE.Vector3(adj / 2 - 0.8, opp / 2 + 0.3, 0), "#CC79A7", 0.9));

        // Trig values
        const sinV = Math.sin(rad);
        const cosV = Math.cos(rad);
        const tanV = Math.tan(rad);
        scene.scene.add(createLabel(`sin ${deg}° = ${sinV.toFixed(3)}`, new THREE.Vector3(-2.5, 3, 0), "#D55E00", 0.9));
        scene.scene.add(createLabel(`cos ${deg}° = ${cosV.toFixed(3)}`, new THREE.Vector3(-2.5, 2.3, 0), "#0072B2", 0.9));
        scene.scene.add(createLabel(`tan ${deg}° = ${tanV.toFixed(3)}`, new THREE.Vector3(-2.5, 1.6, 0), "#009E73", 0.9));

        // Angle arc
        const arcPts: THREE.Vector3[] = [];
        for (let i = 0; i <= 30; i++) {
          const a = (i / 30) * rad;
          arcPts.push(new THREE.Vector3(0.6 * Math.cos(a), 0.6 * Math.sin(a), 0));
        }
        const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPts);
        scene.scene.add(new THREE.Line(arcGeom, new THREE.LineBasicMaterial({ color: NEON_ORANGE })));
        scene.scene.add(createLabel(`${deg}°`, new THREE.Vector3(1, 0.4, 0), "#D55E00", 0.8));
      },
    },

    // Step 2: 특수각 비교
    {
      label: "특수각 30°·45°·60°",
      latex: "\\sin 30° = \\frac{1}{2},\\quad \\sin 45° = \\frac{\\sqrt{2}}{2},\\quad \\sin 60° = \\frac{\\sqrt{3}}{2}",
      description:
        "30°, 45°, 60° 삼각형을 나란히 비교합니다. 정확한 삼각비 값을 확인하세요.",
      render: ({ scene }) => {
        const angles = [30, 45, 60];
        const labels = ["30°", "45°", "60°"];
        const colors = [NEON_CYAN, NEON_GREEN, NEON_ORANGE];
        const hyp = 3;

        angles.forEach((deg, i) => {
          const rad = (deg * PI) / 180;
          const adj = hyp * Math.cos(rad);
          const opp = hyp * Math.sin(rad);
          const offsetX = (i - 1) * 4.5;

          const pts = [
            new THREE.Vector3(offsetX, 0, 0),
            new THREE.Vector3(offsetX + adj, 0, 0),
            new THREE.Vector3(offsetX + adj, opp, 0),
            new THREE.Vector3(offsetX, 0, 0),
          ];
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          scene.scene.add(new THREE.Line(geom, new THREE.LineBasicMaterial({ color: colors[i] })));

          scene.scene.add(createLabel(labels[i], new THREE.Vector3(offsetX + 0.5, 0.3, 0), "#fff", 0.8));

          const sinV = Math.sin(rad).toFixed(3);
          const cosV = Math.cos(rad).toFixed(3);
          scene.scene.add(createLabel(`sin=${sinV}`, new THREE.Vector3(offsetX + adj / 2, opp + 0.5, 0), "#D55E00", 0.7));
          scene.scene.add(createLabel(`cos=${cosV}`, new THREE.Vector3(offsetX + adj / 2, -0.5, 0), "#0072B2", 0.7));
        });
      },
    },

    // Step 3: 삼각비-그래프 연동
    {
      label: "삼각비 → 그래프",
      latex: "y = \\sin\\theta,\\quad y = \\cos\\theta",
      description:
        "각도를 변화시키면 삼각비 값이 그래프 위의 점으로 표시됩니다. 삼각비가 곧 삼각함수의 출발점입니다.",
      params: [
        { name: "angle", label: "각도 θ (°)", min: 0, max: 90, step: 1, default: 45 },
      ],
      render: ({ scene, params }) => {
        const deg = params.angle ?? 45;
        const rad = (deg * PI) / 180;

        // Small triangle (left side)
        const hyp = 2;
        const adj = hyp * Math.cos(rad);
        const opp = hyp * Math.sin(rad);
        const ox = -4;
        const pts = [
          new THREE.Vector3(ox, 0, 0),
          new THREE.Vector3(ox + adj, 0, 0),
          new THREE.Vector3(ox + adj, opp, 0),
          new THREE.Vector3(ox, 0, 0),
        ];
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));
        scene.scene.add(createLabel(`${deg}°`, new THREE.Vector3(ox + 0.5, 0.3, 0), "#fff", 0.7));

        // Sin graph (right side)
        const graphPts: THREE.Vector3[] = [];
        for (let i = 0; i <= 90; i++) {
          const a = (i * PI) / 180;
          graphPts.push(new THREE.Vector3(i * 0.06, Math.sin(a) * 3, 0));
        }
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(graphPts),
          new THREE.LineBasicMaterial({ color: NEON_MAGENTA }),
        ));

        // Cos graph
        const cosGraphPts: THREE.Vector3[] = [];
        for (let i = 0; i <= 90; i++) {
          const a = (i * PI) / 180;
          cosGraphPts.push(new THREE.Vector3(i * 0.06, Math.cos(a) * 3, 0));
        }
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(cosGraphPts),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));

        // Current point markers
        const gx = deg * 0.06;
        scene.scene.add(createPoint(gx, Math.sin(rad) * 3, 0, NEON_MAGENTA, 0.15));
        scene.scene.add(createPoint(gx, Math.cos(rad) * 3, 0, NEON_CYAN, 0.15));

        // Connecting dashed lines
        scene.scene.add(createDashedLine(
          new THREE.Vector3(ox + adj, opp, 0),
          new THREE.Vector3(gx, Math.sin(rad) * 3, 0),
          0x555577,
        ));

        scene.scene.add(createLabel("sin", new THREE.Vector3(5.5, Math.sin(rad) * 3 + 0.3, 0), "#CC79A7", 0.8));
        scene.scene.add(createLabel("cos", new THREE.Vector3(5.5, Math.cos(rad) * 3 + 0.3, 0), "#0072B2", 0.8));
      },
    },
  ],
};
