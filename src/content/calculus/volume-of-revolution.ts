import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createShadedRegion,
  createRevolutionSurface,
  createRevolutionWireframe,
  createLabel,
  createDashedLine,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";

const fn = (x: number) => Math.sqrt(x); // y = √x

export const volumeOfRevolution: ConceptData = {
  unitId: "volume-of-revolution",
  title: "회전체의 부피",
  steps: [
    {
      label: "곡선과 영역",
      latex: "y = \\sqrt{x}, \\quad 0 \\le x \\le 4",
      description:
        "y = √x와 x축으로 둘러싸인 영역을 x축을 중심으로 회전시켜 회전체를 만듭니다.",
      render: ({ scene }) => {
        const curve = createCurve(fn, 0, 4, NEON_CYAN, 200);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const shade = createShadedRegion(fn, 0, 4, NEON_CYAN, 0.15);
        shade.name = "concept-shade";
        scene.scene.add(shade);

        const lbl = createLabel("y = √x", new THREE.Vector3(3.5, 2.2, 0), "#00f0ff", 1);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        // x-axis reference
        const xLine = createDashedLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(5, 0, 0),
          0xff6600,
        );
        xLine.name = "concept-xline";
        scene.scene.add(xLine);

        const lblAxis = createLabel("회전축", new THREE.Vector3(5, 0.4, 0), "#ff6600", 0.8);
        lblAxis.name = "concept-lbl-axis";
        scene.scene.add(lblAxis);
      },
    },
    {
      label: "회전 (와이어프레임)",
      latex: "V = \\pi \\int_0^4 [f(x)]^2 \\, dx",
      description:
        "곡선을 x축 주위로 회전하면 3D 회전체가 됩니다. 와이어프레임으로 회전 과정을 확인하세요.",
      render: ({ scene }) => {
        // Set 3D camera
        scene.camera.position.set(8, 5, 8);
        scene.camera.lookAt(2, 0, 0);

        const wire = createRevolutionWireframe(fn, 0, 4, NEON_CYAN, 15, 20);
        wire.name = "concept-wire";
        scene.scene.add(wire);

        // Original curve highlighted
        const curve = createCurve(fn, 0, 4, NEON_GREEN, 200);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const lbl = createLabel("와이어프레임", new THREE.Vector3(2, 3, 0), "#00f0ff", 1);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        return () => {
          scene.camera.position.set(0, 0, 25);
          scene.camera.lookAt(0, 0, 0);
        };
      },
    },
    {
      label: "회전체 (솔리드)",
      latex: "V = \\pi \\int_0^4 x \\, dx = \\pi \\left[\\frac{x^2}{2}\\right]_0^4 = 8\\pi",
      description:
        "디스크법: 각 단면의 넓이 π[f(x)]²를 적분합니다. y = √x의 회전체 부피는 8π입니다.",
      render: ({ scene }) => {
        scene.camera.position.set(8, 5, 8);
        scene.camera.lookAt(2, 0, 0);

        const solid = createRevolutionSurface(fn, 0, 4, NEON_MAGENTA, 0.35, 40, 32);
        solid.name = "concept-solid";
        scene.scene.add(solid);

        // One disk cross-section
        const diskX = 2;
        const diskR = fn(diskX);
        const circlePoints: THREE.Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          circlePoints.push(new THREE.Vector3(diskX, diskR * Math.cos(theta), diskR * Math.sin(theta)));
        }
        const diskGeom = new THREE.BufferGeometry().setFromPoints(circlePoints);
        const diskMat = new THREE.LineBasicMaterial({ color: NEON_GREEN });
        const disk = new THREE.Line(diskGeom, diskMat);
        disk.name = "concept-disk";
        scene.scene.add(disk);

        const lbl = createLabel("V = 8π", new THREE.Vector3(2, 3, 2), "#ff00ff", 1.5);
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        const lblDisk = createLabel("단면 원", new THREE.Vector3(diskX, diskR + 0.5, 1), "#39ff14", 0.8);
        lblDisk.name = "concept-lbl-disk";
        scene.scene.add(lblDisk);

        return () => {
          scene.camera.position.set(0, 0, 25);
          scene.camera.lookAt(0, 0, 0);
        };
      },
    },
  ],
};
