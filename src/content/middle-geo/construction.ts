import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createDashedLine,
  createLabel,
  createCircle2D,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

const PI = Math.PI;

export const construction: ConceptData = {
  unitId: "construction",
  title: "작도",
  steps: [
    // Step 1: 수직이등분선
    {
      label: "수직이등분선",
      latex: "\\text{두 점에서 같은 거리에 있는 점들의 집합}",
      description:
        "선분 AB의 수직이등분선을 작도하는 과정입니다. 반지름을 조절하며 두 원의 교점이 수직이등분선을 만드는 것을 확인하세요.",
      params: [
        { name: "r", label: "컴퍼스 반지름", min: 1.5, max: 4, step: 0.1, default: 2.5 },
      ],
      render: ({ scene, params }) => {
        const r = params.r ?? 2.5;
        const A = new THREE.Vector3(-2, 0, 0);
        const B = new THREE.Vector3(2, 0, 0);

        // Segment AB
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([A, B]),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));

        scene.scene.add(createPoint(-2, 0, 0, NEON_GREEN, 0.12));
        scene.scene.add(createPoint(2, 0, 0, NEON_GREEN, 0.12));

        // Compass circles
        scene.scene.add(createCircle2D(-2, 0, r, NEON_ORANGE));
        scene.scene.add(createCircle2D(2, 0, r, NEON_MAGENTA));

        // Intersection points (if r > half of AB)
        const halfAB = 2;
        if (r > halfAB * 0.5) {
          const h = Math.sqrt(r * r - halfAB * halfAB);
          if (isFinite(h)) {
            scene.scene.add(createPoint(0, h, 0, NEON_GREEN, 0.15));
            scene.scene.add(createPoint(0, -h, 0, NEON_GREEN, 0.15));

            // Perpendicular bisector
            scene.scene.add(createDashedLine(
              new THREE.Vector3(0, -5, 0),
              new THREE.Vector3(0, 5, 0),
              0x00ff88,
              0.2,
              0.1,
            ));

            scene.scene.add(createLabel("수직이등분선", new THREE.Vector3(1.5, 4, 0), "#00ff88", 0.9));
          }
        }

        scene.scene.add(createLabel("A", new THREE.Vector3(-2.3, -0.5, 0), "#009E73", 0.8));
        scene.scene.add(createLabel("B", new THREE.Vector3(2.3, -0.5, 0), "#009E73", 0.8));
        scene.scene.add(createLabel("M", new THREE.Vector3(0.3, -0.5, 0), "#fff", 0.7));
      },
    },

    // Step 2: 정삼각형 작도
    {
      label: "정삼각형 작도",
      latex: "AB = BC = CA",
      description:
        "주어진 선분 AB를 한 변으로 하는 정삼각형을 작도합니다. 두 원의 교점이 세 번째 꼭짓점입니다.",
      render: ({ scene }) => {
        const A = new THREE.Vector3(-2, -1, 0);
        const B = new THREE.Vector3(2, -1, 0);
        const side = 4; // AB length

        // AB segment
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([A, B]),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));

        // Compass circles with radius = AB
        scene.scene.add(createCircle2D(-2, -1, side, NEON_ORANGE));
        scene.scene.add(createCircle2D(2, -1, side, NEON_MAGENTA));

        // Third vertex C (intersection above)
        const h = Math.sqrt(3) / 2 * side;
        const C = new THREE.Vector3(0, -1 + h, 0);
        scene.scene.add(createPoint(C.x, C.y, 0, NEON_GREEN, 0.15));

        // Equilateral triangle
        const triPts = [A, B, C, A];
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(triPts),
          new THREE.LineBasicMaterial({ color: NEON_GREEN }),
        ));

        scene.scene.add(createPoint(-2, -1, 0, NEON_GREEN, 0.12));
        scene.scene.add(createPoint(2, -1, 0, NEON_GREEN, 0.12));

        scene.scene.add(createLabel("A", new THREE.Vector3(-2.5, -1.5, 0), "#009E73", 0.8));
        scene.scene.add(createLabel("B", new THREE.Vector3(2.5, -1.5, 0), "#009E73", 0.8));
        scene.scene.add(createLabel("C", new THREE.Vector3(0.3, C.y + 0.3, 0), "#009E73", 0.8));
        scene.scene.add(createLabel("정삼각형", new THREE.Vector3(0, C.y + 1, 0), "#009E73"));
      },
    },

    // Step 3: 각의 이등분선
    {
      label: "각의 이등분선",
      latex: "\\angle BAP = \\angle CAP",
      description:
        "각의 이등분선은 각을 정확히 반으로 나눕니다. 컴퍼스를 이용한 작도 과정을 단계별로 확인하세요.",
      params: [
        { name: "angle", label: "각도 (°)", min: 20, max: 160, step: 5, default: 80 },
      ],
      render: ({ scene, params }) => {
        const deg = params.angle ?? 80;
        const rad = (deg * PI) / 180;
        const O = new THREE.Vector3(0, 0, 0);
        const len = 5;
        const compR = 2;

        // Two rays of the angle
        const rayA = new THREE.Vector3(len, 0, 0);
        const rayB = new THREE.Vector3(len * Math.cos(rad), len * Math.sin(rad), 0);

        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([O, rayA]),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([O, rayB]),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));

        // Compass arc from O
        const arcPts: THREE.Vector3[] = [];
        for (let i = 0; i <= 40; i++) {
          const a = (i / 40) * rad;
          arcPts.push(new THREE.Vector3(compR * Math.cos(a), compR * Math.sin(a), 0));
        }
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(arcPts),
          new THREE.LineBasicMaterial({ color: NEON_ORANGE }),
        ));

        // Points on rays at compass radius
        const P1 = new THREE.Vector3(compR, 0, 0);
        const P2 = new THREE.Vector3(compR * Math.cos(rad), compR * Math.sin(rad), 0);
        scene.scene.add(createPoint(P1.x, P1.y, 0, NEON_ORANGE, 0.1));
        scene.scene.add(createPoint(P2.x, P2.y, 0, NEON_ORANGE, 0.1));

        // Equal arcs from P1 and P2
        scene.scene.add(createCircle2D(P1.x, P1.y, 1.5, NEON_MAGENTA));
        scene.scene.add(createCircle2D(P2.x, P2.y, 1.5, NEON_GREEN));

        // Bisector
        const bisAngle = rad / 2;
        const bisEnd = new THREE.Vector3(len * Math.cos(bisAngle), len * Math.sin(bisAngle), 0);
        scene.scene.add(createDashedLine(O, bisEnd, 0x00ff88, 0.2, 0.1));

        scene.scene.add(createLabel(`${deg}°`, new THREE.Vector3(1.5, 0.5, 0), "#0072B2", 0.8));
        scene.scene.add(createLabel(`${(deg / 2).toFixed(1)}°`, new THREE.Vector3(
          2 * Math.cos(bisAngle) + 0.3,
          2 * Math.sin(bisAngle),
          0,
        ), "#00ff88", 0.8));
        scene.scene.add(createLabel("이등분선", new THREE.Vector3(bisEnd.x - 1, bisEnd.y + 0.4, 0), "#00ff88"));
      },
    },
  ],
};
