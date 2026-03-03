import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createPoint,
  createDashedLine,
  createLabel,
  createCircle2D,
  createArc,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

const PI = Math.PI;

export const circleProperties: ConceptData = {
  unitId: "circle-properties",
  title: "원의 성질",
  steps: [
    // Step 1: 원주각과 중심각
    {
      label: "원주각과 중심각",
      latex: "\\text{원주각} = \\frac{1}{2} \\times \\text{중심각}",
      description:
        "같은 호에 대한 원주각은 중심각의 절반입니다. 호의 크기를 바꿔 관계를 확인하세요.",
      params: [
        { name: "arcAngle", label: "호의 중심각 (°)", min: 30, max: 300, step: 5, default: 120 },
      ],
      render: ({ scene, params }) => {
        const arcDeg = params.arcAngle ?? 120;
        const arcRad = (arcDeg * PI) / 180;
        const R = 3;

        // Circle
        scene.scene.add(createCircle2D(0, 0, R, 0x555577));

        // Arc endpoints
        const aAngle = -arcRad / 2;
        const bAngle = arcRad / 2;
        const A = new THREE.Vector3(R * Math.cos(aAngle), R * Math.sin(aAngle), 0);
        const B = new THREE.Vector3(R * Math.cos(bAngle), R * Math.sin(bAngle), 0);

        // Center
        scene.scene.add(createPoint(0, 0, 0, NEON_CYAN, 0.1));

        // Arc points
        scene.scene.add(createPoint(A.x, A.y, 0, NEON_GREEN, 0.12));
        scene.scene.add(createPoint(B.x, B.y, 0, NEON_GREEN, 0.12));

        // Central angle (O to A, O to B)
        const oaLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), A]),
          new THREE.LineBasicMaterial({ color: NEON_ORANGE }),
        );
        scene.scene.add(oaLine);
        const obLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), B]),
          new THREE.LineBasicMaterial({ color: NEON_ORANGE }),
        );
        scene.scene.add(obLine);

        // Inscribed angle vertex (on the opposite arc)
        const vAngle = PI + arcRad / 2; // opposite side
        const V = new THREE.Vector3(R * Math.cos(vAngle), R * Math.sin(vAngle), 0);
        scene.scene.add(createPoint(V.x, V.y, 0, NEON_MAGENTA, 0.12));

        // Inscribed angle lines (V to A, V to B)
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([V, A]),
          new THREE.LineBasicMaterial({ color: NEON_MAGENTA }),
        ));
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([V, B]),
          new THREE.LineBasicMaterial({ color: NEON_MAGENTA }),
        ));

        // Highlighted arc
        scene.scene.add(createArc(0, 0, R, aAngle, bAngle, NEON_GREEN, 60));

        const inscribedAngle = arcDeg / 2;
        scene.scene.add(createLabel(`중심각 = ${arcDeg}°`, new THREE.Vector3(0, 0.8, 0), "#D55E00"));
        scene.scene.add(createLabel(`원주각 = ${inscribedAngle}°`, new THREE.Vector3(V.x - 1, V.y + 0.5, 0), "#CC79A7"));
        scene.scene.add(createLabel("A", new THREE.Vector3(A.x + 0.3, A.y - 0.3, 0), "#009E73", 0.8));
        scene.scene.add(createLabel("B", new THREE.Vector3(B.x + 0.3, B.y + 0.3, 0), "#009E73", 0.8));
      },
    },

    // Step 2: 접선
    {
      label: "접선과 반지름",
      latex: "OT \\perp l\\quad(\\text{접점에서 반지름⊥접선})",
      description:
        "접선은 원과 한 점에서만 만나며, 접점에서 반지름과 항상 직각입니다. 접점 위치를 변경해 보세요.",
      params: [
        { name: "tangentAngle", label: "접점 위치 (°)", min: 0, max: 360, step: 5, default: 60 },
      ],
      render: ({ scene, params }) => {
        const deg = params.tangentAngle ?? 60;
        const rad = (deg * PI) / 180;
        const R = 3;

        // Circle
        scene.scene.add(createCircle2D(0, 0, R, 0x555577));
        scene.scene.add(createPoint(0, 0, 0, NEON_CYAN, 0.08));

        // Tangent point
        const T = new THREE.Vector3(R * Math.cos(rad), R * Math.sin(rad), 0);
        scene.scene.add(createPoint(T.x, T.y, 0, NEON_GREEN, 0.15));

        // Radius line O→T
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), T]),
          new THREE.LineBasicMaterial({ color: NEON_ORANGE }),
        ));

        // Tangent line (perpendicular to radius at T)
        const tangentDir = new THREE.Vector3(-Math.sin(rad), Math.cos(rad), 0);
        const t1 = T.clone().add(tangentDir.clone().multiplyScalar(4));
        const t2 = T.clone().sub(tangentDir.clone().multiplyScalar(4));
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([t1, t2]),
          new THREE.LineBasicMaterial({ color: NEON_MAGENTA }),
        ));

        // Right angle marker
        const rSize = 0.3;
        const rDir = tangentDir.clone().multiplyScalar(rSize);
        const nDir = T.clone().normalize().multiplyScalar(-rSize);
        const sq1 = T.clone().add(rDir).add(nDir);
        const sq2 = T.clone().add(nDir);
        const sqPts = [T.clone().add(rDir), sq1, sq2];
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(sqPts),
          new THREE.LineBasicMaterial({ color: 0xffffff }),
        ));

        scene.scene.add(createLabel("O", new THREE.Vector3(0.3, -0.3, 0), "#0072B2", 0.8));
        scene.scene.add(createLabel("T (접점)", new THREE.Vector3(T.x + 0.5, T.y + 0.5, 0), "#009E73"));
        scene.scene.add(createLabel("접선 l", new THREE.Vector3(t1.x, t1.y + 0.4, 0), "#CC79A7", 0.9));
        scene.scene.add(createLabel("OT ⊥ l", new THREE.Vector3(0, -R - 1, 0), "#D55E00"));
      },
    },

    // Step 3: 할선과 원의 멱
    {
      label: "원의 멱",
      latex: "PA \\cdot PB = PC \\cdot PD",
      description:
        "외부 점 P에서 원에 두 할선을 그으면 PA·PB = PC·PD가 성립합니다. 이것이 원의 멱(Power of a Point)입니다.",
      params: [
        { name: "distance", label: "P의 거리", min: 3.5, max: 7, step: 0.1, default: 5 },
      ],
      render: ({ scene, params }) => {
        const d = params.distance ?? 5;
        const R = 2.5;

        scene.scene.add(createCircle2D(0, 0, R, 0x555577));
        scene.scene.add(createPoint(0, 0, 0, NEON_CYAN, 0.06));

        // External point P
        const P = new THREE.Vector3(d, 0, 0);
        scene.scene.add(createPoint(d, 0, 0, NEON_ORANGE, 0.15));

        // First secant (horizontal)
        const PA = d - R;
        const PB = d + R;
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([P, new THREE.Vector3(-R, 0, 0)]),
          new THREE.LineBasicMaterial({ color: NEON_GREEN }),
        ));
        scene.scene.add(createPoint(R, 0, 0, NEON_GREEN, 0.1));
        scene.scene.add(createPoint(-R, 0, 0, NEON_GREEN, 0.1));

        // Second secant (angled)
        const secAngle = 0.4;
        const dx = Math.cos(secAngle);
        const dy = Math.sin(secAngle);
        // Intersections with circle: solve (d-t*dx)^2 + (t*dy)^2 = R^2
        const a = dx * dx + dy * dy;
        const b = -2 * d * dx;
        const c = d * d - R * R;
        const disc = b * b - 4 * a * c;
        if (disc >= 0) {
          const t1 = (-b - Math.sqrt(disc)) / (2 * a);
          const t2 = (-b + Math.sqrt(disc)) / (2 * a);
          const C = new THREE.Vector3(d - t1 * dx, t1 * dy, 0);
          const D = new THREE.Vector3(d - t2 * dx, t2 * dy, 0);

          scene.scene.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([P, D]),
            new THREE.LineBasicMaterial({ color: NEON_MAGENTA }),
          ));
          scene.scene.add(createPoint(C.x, C.y, 0, NEON_MAGENTA, 0.1));
          scene.scene.add(createPoint(D.x, D.y, 0, NEON_MAGENTA, 0.1));

          const PC = P.distanceTo(C);
          const PD = P.distanceTo(D);
          scene.scene.add(createLabel(`PC·PD = ${(PC * PD).toFixed(2)}`, new THREE.Vector3(0, -R - 1.5, 0), "#CC79A7", 0.9));
        }

        scene.scene.add(createLabel(`PA·PB = ${(PA * PB).toFixed(2)}`, new THREE.Vector3(0, -R - 0.8, 0), "#009E73", 0.9));
        scene.scene.add(createLabel("P", new THREE.Vector3(d + 0.3, -0.4, 0), "#D55E00", 0.9));
      },
    },

    // Step 4: 내접 사각형
    {
      label: "내접 사각형",
      latex: "\\angle A + \\angle C = 180°",
      description:
        "원에 내접하는 사각형의 대각의 합은 항상 180°입니다. 꼭짓점을 움직여도 이 성질이 유지됩니다.",
      params: [
        { name: "angle1", label: "꼭짓점 A 위치 (°)", min: 0, max: 80, step: 5, default: 20 },
        { name: "angle2", label: "꼭짓점 B 위치 (°)", min: 100, max: 170, step: 5, default: 110 },
      ],
      render: ({ scene, params }) => {
        const R = 3;
        const a1 = ((params.angle1 ?? 20) * PI) / 180;
        const a2 = ((params.angle2 ?? 110) * PI) / 180;
        const a3 = a2 + PI * 0.5;
        const a4 = a1 + PI + PI * 0.3;

        scene.scene.add(createCircle2D(0, 0, R, 0x555577));

        const pts = [a1, a2, a3, a4].map((a) =>
          new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), 0),
        );

        // Quadrilateral
        const quadPts = [...pts, pts[0]];
        scene.scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(quadPts),
          new THREE.LineBasicMaterial({ color: NEON_CYAN }),
        ));

        // Points and labels
        const labels = ["A", "B", "C", "D"];
        pts.forEach((p, i) => {
          scene.scene.add(createPoint(p.x, p.y, 0, NEON_GREEN, 0.12));
          const offset = p.clone().normalize().multiplyScalar(0.5);
          scene.scene.add(createLabel(labels[i], new THREE.Vector3(p.x + offset.x, p.y + offset.y, 0), "#009E73", 0.8));
        });

        // Calculate angles at A and C
        const angleAt = (vertex: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3) => {
          const v1 = p1.clone().sub(vertex).normalize();
          const v2 = p2.clone().sub(vertex).normalize();
          return Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180 / PI;
        };

        const angleA = angleAt(pts[0], pts[3], pts[1]);
        const angleC = angleAt(pts[2], pts[1], pts[3]);

        // Diagonal (dashed)
        scene.scene.add(createDashedLine(pts[0], pts[2], 0x555577, 0.15, 0.1));
        scene.scene.add(createDashedLine(pts[1], pts[3], 0x555577, 0.15, 0.1));

        scene.scene.add(createLabel(`∠A = ${angleA.toFixed(1)}°`, new THREE.Vector3(-4, 2, 0), "#D55E00", 0.9));
        scene.scene.add(createLabel(`∠C = ${angleC.toFixed(1)}°`, new THREE.Vector3(-4, 1.2, 0), "#CC79A7", 0.9));
        scene.scene.add(createLabel(
          `∠A + ∠C = ${(angleA + angleC).toFixed(1)}°`,
          new THREE.Vector3(-4, 0.2, 0),
          "#009E73",
        ));
      },
    },
  ],
};
