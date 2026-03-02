import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createDashedLine,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
} from "@/engine/ConceptMeshes";

export const limitOfFunction: ConceptData = {
  unitId: "limit-of-function",
  title: "함수의 극한",
  steps: [
    {
      label: "함수 그래프",
      latex: "f(x) = \\frac{x^2 - 1}{x - 1}",
      description:
        "x=1에서 정의되지 않지만, x가 1에 가까워질수록 f(x)는 2에 수렴합니다. 이것이 극한의 핵심 아이디어입니다.",
      render: ({ scene }) => {
        const fn = (x: number) => (x * x - 1) / (x - 1);
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        // Hole at x=1
        const hole = createPoint(1, 2, 0, NEON_MAGENTA, 0.15);
        hole.name = "concept-hole";
        hole.material = new THREE.MeshBasicMaterial({
          color: NEON_MAGENTA,
          transparent: true,
          opacity: 0.3,
        });
        scene.scene.add(hole);

        const holeBorder = new THREE.Mesh(
          new THREE.RingGeometry(0.12, 0.18, 32),
          new THREE.MeshBasicMaterial({ color: NEON_MAGENTA, side: THREE.DoubleSide }),
        );
        holeBorder.position.set(1, 2, 0);
        holeBorder.name = "concept-hole-border";
        scene.scene.add(holeBorder);
      },
    },
    {
      label: "좌극한",
      latex: "\\lim_{x \\to 1^-} f(x) = 2",
      description:
        "x가 1보다 작은 값에서 1로 접근할 때, f(x)는 2에 가까워집니다. 왼쪽에서 점이 이동하는 것을 관찰하세요.",
      params: [
        { name: "t", label: "x 위치", min: -2, max: 0.95, step: 0.05, default: -1 },
      ],
      render: ({ scene, params }) => {
        const fn = (x: number) => (x * x - 1) / (x - 1);
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const t = params.t ?? -1;
        const y = fn(t);
        const pt = createPoint(t, y, 0, NEON_GREEN, 0.18);
        pt.name = "concept-point";
        scene.scene.add(pt);

        // Dashed lines to axes
        const hLine = createDashedLine(
          new THREE.Vector3(t, y, 0),
          new THREE.Vector3(0, y, 0),
          0x39ff14,
        );
        hLine.name = "concept-hline";
        scene.scene.add(hLine);

        const vLine = createDashedLine(
          new THREE.Vector3(t, 0, 0),
          new THREE.Vector3(t, y, 0),
          0x39ff14,
        );
        vLine.name = "concept-vline";
        scene.scene.add(vLine);

        // Target dashed line y=2
        const target = createDashedLine(
          new THREE.Vector3(-30, 2, 0),
          new THREE.Vector3(30, 2, 0),
          0xff00ff,
          0.15,
          0.1,
        );
        target.name = "concept-target";
        scene.scene.add(target);

        const lbl = createLabel("y = 2", new THREE.Vector3(5.5, 2, 0), "#ff00ff");
        lbl.name = "concept-label";
        scene.scene.add(lbl);
      },
    },
    {
      label: "우극한",
      latex: "\\lim_{x \\to 1^+} f(x) = 2",
      description:
        "x가 1보다 큰 값에서 1로 접근할 때도 f(x)는 2에 가까워집니다. 좌극한과 우극한이 같으므로 극한값이 존재합니다.",
      params: [
        { name: "t", label: "x 위치", min: 1.05, max: 4, step: 0.05, default: 3 },
      ],
      render: ({ scene, params }) => {
        const fn = (x: number) => (x * x - 1) / (x - 1);
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const t = params.t ?? 3;
        const y = fn(t);
        const pt = createPoint(t, y, 0, NEON_GREEN, 0.18);
        pt.name = "concept-point";
        scene.scene.add(pt);

        const hLine = createDashedLine(
          new THREE.Vector3(t, y, 0),
          new THREE.Vector3(0, y, 0),
          0x39ff14,
        );
        hLine.name = "concept-hline";
        scene.scene.add(hLine);

        const target = createDashedLine(
          new THREE.Vector3(-30, 2, 0),
          new THREE.Vector3(30, 2, 0),
          0xff00ff,
          0.15,
          0.1,
        );
        target.name = "concept-target";
        scene.scene.add(target);
      },
    },
    {
      label: "극한값의 존재",
      latex: "\\lim_{x \\to 1} \\frac{x^2-1}{x-1} = \\lim_{x \\to 1} (x+1) = 2",
      description:
        "좌극한과 우극한이 모두 2로 같으므로, 극한값은 2입니다. 분자를 인수분해하면 (x+1)(x-1)/(x-1) = x+1 임을 알 수 있습니다.",
      render: ({ scene }) => {
        // Show simplified function y = x+1
        const simplified = createCurve((x) => x + 1, -30, 30, NEON_GREEN);
        simplified.name = "concept-simplified";
        scene.scene.add(simplified);

        // Original (same graph except at x=1)
        const original = createCurve(
          (x) => (x * x - 1) / (x - 1),
          -30,
          30,
          NEON_CYAN,
        );
        original.name = "concept-original";
        // don't add — same visual, just show simplified

        const pt = createPoint(1, 2, 0, NEON_MAGENTA, 0.2);
        pt.name = "concept-limit-point";
        scene.scene.add(pt);

        const lbl = createLabel("극한값 = 2", new THREE.Vector3(2.5, 2.5, 0), "#ff00ff");
        lbl.name = "concept-label";
        scene.scene.add(lbl);
      },
    },
  ],
};
