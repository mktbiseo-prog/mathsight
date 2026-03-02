import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createArrow,
  createPoint,
  createLabel,
  createDashedLine,
  createSphereWireframe,
  createPlane3D,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

export const spaceGeometry: ConceptData = {
  unitId: "space-geometry",
  title: "공간도형과 좌표",
  steps: [
    {
      label: "공간좌표계",
      latex: "P(x, y, z)",
      description:
        "3차원 공간에서 한 점은 (x, y, z) 세 좌표로 나타냅니다. 점 P의 좌표를 바꿔보세요.",
      params: [
        { name: "px", label: "x", min: -4, max: 4, step: 0.5, default: 2 },
        { name: "py", label: "y", min: -4, max: 4, step: 0.5, default: 3 },
        { name: "pz", label: "z", min: -4, max: 4, step: 0.5, default: 2 },
      ],
      render: ({ scene, params }) => {
        scene.camera.position.set(10, 8, 10);
        scene.camera.lookAt(0, 0, 0);

        const px = params.px ?? 2;
        const py = params.py ?? 3;
        const pz = params.pz ?? 2;
        const O = new THREE.Vector3(0, 0, 0);

        // 3D axes
        const xAxis = createArrow(O, new THREE.Vector3(6, 0, 0), NEON_ORANGE, 0.3, 0.12);
        xAxis.name = "concept-xaxis";
        scene.scene.add(xAxis);

        const yAxis = createArrow(O, new THREE.Vector3(0, 6, 0), NEON_GREEN, 0.3, 0.12);
        yAxis.name = "concept-yaxis";
        scene.scene.add(yAxis);

        const zAxis = createArrow(O, new THREE.Vector3(0, 0, 6), NEON_CYAN, 0.3, 0.12);
        zAxis.name = "concept-zaxis";
        scene.scene.add(zAxis);

        const lblX = createLabel("x", new THREE.Vector3(6.5, 0, 0), "#ff6600", 0.8);
        lblX.name = "concept-lbl-x";
        scene.scene.add(lblX);

        const lblY = createLabel("y", new THREE.Vector3(0, 6.5, 0), "#39ff14", 0.8);
        lblY.name = "concept-lbl-y";
        scene.scene.add(lblY);

        const lblZ = createLabel("z", new THREE.Vector3(0, 0, 6.5), "#00f0ff", 0.8);
        lblZ.name = "concept-lbl-z";
        scene.scene.add(lblZ);

        // Point P
        const pt = createPoint(px, py, pz, NEON_MAGENTA, 0.2);
        pt.name = "concept-pt";
        scene.scene.add(pt);

        // Dashed guide lines
        const d1 = createDashedLine(new THREE.Vector3(px, 0, 0), new THREE.Vector3(px, py, 0), 0x666688);
        d1.name = "concept-d1";
        scene.scene.add(d1);

        const d2 = createDashedLine(new THREE.Vector3(0, py, 0), new THREE.Vector3(px, py, 0), 0x666688);
        d2.name = "concept-d2";
        scene.scene.add(d2);

        const d3 = createDashedLine(new THREE.Vector3(px, py, 0), new THREE.Vector3(px, py, pz), 0x666688);
        d3.name = "concept-d3";
        scene.scene.add(d3);

        const lblP = createLabel(
          `P(${px}, ${py}, ${pz})`,
          new THREE.Vector3(px + 0.5, py + 0.5, pz + 0.5),
          "#ff00ff",
          1,
        );
        lblP.name = "concept-lbl-p";
        scene.scene.add(lblP);

        return () => {
          scene.camera.position.set(0, 0, 25);
          scene.camera.lookAt(0, 0, 0);
        };
      },
    },
    {
      label: "두 점 사이의 거리",
      latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}",
      description:
        "3차원 공간에서의 거리 공식은 피타고라스 정리의 확장입니다.",
      render: ({ scene }) => {
        scene.camera.position.set(10, 8, 10);
        scene.camera.lookAt(0, 0, 0);

        // Two points
        const A = new THREE.Vector3(1, 1, 1);
        const B = new THREE.Vector3(4, 3, 2);

        const ptA = createPoint(A.x, A.y, A.z, NEON_CYAN, 0.15);
        ptA.name = "concept-ptA";
        scene.scene.add(ptA);

        const ptB = createPoint(B.x, B.y, B.z, NEON_GREEN, 0.15);
        ptB.name = "concept-ptB";
        scene.scene.add(ptB);

        // Distance line
        const distLine = createArrow(A, B, NEON_MAGENTA, 0.2, 0.1);
        distLine.name = "concept-dist";
        scene.scene.add(distLine);

        // Step lines (3D pythagorean)
        const mid1 = new THREE.Vector3(B.x, A.y, A.z);
        const mid2 = new THREE.Vector3(B.x, B.y, A.z);

        const l1 = createDashedLine(A, mid1, 0xff6600);
        l1.name = "concept-l1";
        scene.scene.add(l1);

        const l2 = createDashedLine(mid1, mid2, 0xff6600);
        l2.name = "concept-l2";
        scene.scene.add(l2);

        const l3 = createDashedLine(mid2, B, 0xff6600);
        l3.name = "concept-l3";
        scene.scene.add(l3);

        const dist = A.distanceTo(B);
        const lbl = createLabel(`d = ${dist.toFixed(2)}`, new THREE.Vector3(2.5, 3, 2), "#ff00ff", 1);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        const lblA = createLabel("A(1,1,1)", new THREE.Vector3(1, 0.3, 1), "#00f0ff", 0.7);
        lblA.name = "concept-lbl-a";
        scene.scene.add(lblA);

        const lblB = createLabel("B(4,3,2)", new THREE.Vector3(4, 3.7, 2), "#39ff14", 0.7);
        lblB.name = "concept-lbl-b";
        scene.scene.add(lblB);

        return () => {
          scene.camera.position.set(0, 0, 25);
          scene.camera.lookAt(0, 0, 0);
        };
      },
    },
    {
      label: "구의 방정식",
      latex: "(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2",
      description:
        "중심 (a,b,c)에서 거리 r인 점들의 집합이 구입니다. 반지름을 바꿔보세요.",
      params: [
        { name: "r", label: "반지름", min: 1, max: 5, step: 0.5, default: 3 },
      ],
      render: ({ scene, params }) => {
        scene.camera.position.set(10, 8, 10);
        scene.camera.lookAt(0, 0, 0);

        const r = params.r ?? 3;
        const center = new THREE.Vector3(0, 0, 0);

        const sphere = createSphereWireframe(r, center, NEON_CYAN);
        sphere.name = "concept-sphere";
        scene.scene.add(sphere);

        // Center point
        const cPt = createPoint(0, 0, 0, NEON_MAGENTA, 0.15);
        cPt.name = "concept-center";
        scene.scene.add(cPt);

        // Radius arrow
        const rArrow = createArrow(
          center,
          new THREE.Vector3(r, 0, 0),
          NEON_GREEN,
          0.2,
          0.1,
        );
        rArrow.name = "concept-radius";
        scene.scene.add(rArrow);

        const lblR = createLabel(`r = ${r}`, new THREE.Vector3(r / 2, 0.5, 0), "#39ff14", 0.8);
        lblR.name = "concept-lbl-r";
        scene.scene.add(lblR);

        // 3D axes (small)
        const xA = createArrow(center, new THREE.Vector3(r + 2, 0, 0), NEON_ORANGE, 0.2, 0.08);
        xA.name = "concept-xa";
        scene.scene.add(xA);

        const yA = createArrow(center, new THREE.Vector3(0, r + 2, 0), NEON_GREEN, 0.2, 0.08);
        yA.name = "concept-ya";
        scene.scene.add(yA);

        const zA = createArrow(center, new THREE.Vector3(0, 0, r + 2), NEON_CYAN, 0.2, 0.08);
        zA.name = "concept-za";
        scene.scene.add(zA);

        return () => {
          scene.camera.position.set(0, 0, 25);
          scene.camera.lookAt(0, 0, 0);
        };
      },
    },
    {
      label: "평면의 방정식",
      latex: "ax + by + cz + d = 0",
      description:
        "법선벡터 (a, b, c)에 수직인 평면입니다. 법선벡터의 방향을 바꿔보세요.",
      params: [
        { name: "nx", label: "a", min: -2, max: 2, step: 0.5, default: 1 },
        { name: "ny", label: "b", min: -2, max: 2, step: 0.5, default: 1 },
        { name: "nz", label: "c", min: -2, max: 2, step: 0.5, default: 1 },
      ],
      render: ({ scene, params }) => {
        scene.camera.position.set(10, 8, 10);
        scene.camera.lookAt(0, 0, 0);

        const nx = params.nx ?? 1;
        const ny = params.ny ?? 1;
        const nz = params.nz ?? 1;
        const normal = new THREE.Vector3(nx, ny, nz);
        const len = normal.length();
        if (len < 0.1) return;

        const plane = createPlane3D(normal, 0, 8, NEON_CYAN, 0.2);
        plane.name = "concept-plane";
        scene.scene.add(plane);

        // Normal vector arrow
        const normalDir = normal.clone().normalize().multiplyScalar(3);
        const nArrow = createArrow(
          new THREE.Vector3(0, 0, 0),
          normalDir,
          NEON_MAGENTA,
          0.3,
          0.12,
        );
        nArrow.name = "concept-normal";
        scene.scene.add(nArrow);

        const lblN = createLabel(
          `n = (${nx}, ${ny}, ${nz})`,
          new THREE.Vector3(normalDir.x + 0.5, normalDir.y + 0.5, normalDir.z + 0.5),
          "#ff00ff",
          0.8,
        );
        lblN.name = "concept-lbl-n";
        scene.scene.add(lblN);

        // 3D axes
        const O = new THREE.Vector3(0, 0, 0);
        const xA = createArrow(O, new THREE.Vector3(5, 0, 0), NEON_ORANGE, 0.2, 0.08);
        xA.name = "concept-xa";
        scene.scene.add(xA);

        const yA = createArrow(O, new THREE.Vector3(0, 5, 0), NEON_GREEN, 0.2, 0.08);
        yA.name = "concept-ya";
        scene.scene.add(yA);

        const zA = createArrow(O, new THREE.Vector3(0, 0, 5), NEON_CYAN, 0.2, 0.08);
        zA.name = "concept-za";
        scene.scene.add(zA);

        return () => {
          scene.camera.position.set(0, 0, 25);
          scene.camera.lookAt(0, 0, 0);
        };
      },
    },
  ],
};
