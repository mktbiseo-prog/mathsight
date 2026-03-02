import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createEllipse,
  createDashedLine,
  createLabel,
  createParametricCurve,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

export const conicSections: ConceptData = {
  unitId: "conic-sections",
  title: "이차곡선",
  steps: [
    {
      label: "포물선",
      latex: "y^2 = 4px \\quad (\\text{초점}: F(p, 0))",
      description:
        "포물선은 초점까지의 거리와 준선까지의 거리가 같은 점들의 집합입니다. p를 변경해보세요.",
      params: [
        { name: "p", label: "p", min: 0.5, max: 3, step: 0.1, default: 1 },
      ],
      render: ({ scene, params }) => {
        const p = params.p ?? 1;

        // Parabola y² = 4px (parametric form)
        const parabolaTop = createParametricCurve(
          (t) => (t * t) / (4 * p),
          (t) => t,
          -30, 30, NEON_CYAN,
        );
        parabolaTop.name = "concept-parabola";
        scene.scene.add(parabolaTop);

        // Focus
        const focus = createPoint(p, 0, 0, NEON_MAGENTA, 0.15);
        focus.name = "concept-focus";
        scene.scene.add(focus);

        const lblF = createLabel("F", new THREE.Vector3(p, -0.5, 0), "#ff00ff", 0.8);
        lblF.name = "concept-lbl-f";
        scene.scene.add(lblF);

        // Directrix x = -p
        const directrix = createDashedLine(
          new THREE.Vector3(-p, -30, 0),
          new THREE.Vector3(-p, 30, 0),
          0xff6600,
        );
        directrix.name = "concept-directrix";
        scene.scene.add(directrix);

        const lblD = createLabel("준선 x = -p", new THREE.Vector3(-p - 1.5, 4, 0), "#ff6600", 0.7);
        lblD.name = "concept-lbl-d";
        scene.scene.add(lblD);
      },
    },
    {
      label: "타원",
      latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
      description:
        "타원은 두 초점으로부터의 거리의 합이 일정한 점들의 집합입니다. a, b를 변경해보세요.",
      params: [
        { name: "a", label: "a", min: 1, max: 5, step: 0.1, default: 3 },
        { name: "b", label: "b", min: 1, max: 4, step: 0.1, default: 2 },
      ],
      render: ({ scene, params }) => {
        const a = params.a ?? 3;
        const b = params.b ?? 2;
        const c = Math.sqrt(Math.abs(a * a - b * b));

        const ellipse = createEllipse(a, b, NEON_CYAN);
        ellipse.name = "concept-ellipse";
        scene.scene.add(ellipse);

        // Foci (on x-axis if a > b)
        if (a >= b) {
          const f1 = createPoint(-c, 0, 0, NEON_MAGENTA, 0.12);
          f1.name = "concept-f1";
          scene.scene.add(f1);

          const f2 = createPoint(c, 0, 0, NEON_MAGENTA, 0.12);
          f2.name = "concept-f2";
          scene.scene.add(f2);

          const lbl1 = createLabel("F₁", new THREE.Vector3(-c, -0.5, 0), "#ff00ff", 0.7);
          lbl1.name = "concept-lbl-f1";
          scene.scene.add(lbl1);

          const lbl2 = createLabel("F₂", new THREE.Vector3(c, -0.5, 0), "#ff00ff", 0.7);
          lbl2.name = "concept-lbl-f2";
          scene.scene.add(lbl2);
        }

        // A point on the ellipse and distance lines
        const t = Math.PI / 4;
        const px = a * Math.cos(t);
        const py = b * Math.sin(t);
        const pt = createPoint(px, py, 0, NEON_GREEN, 0.12);
        pt.name = "concept-pt";
        scene.scene.add(pt);

        if (a >= b) {
          const d1 = createDashedLine(
            new THREE.Vector3(-c, 0, 0),
            new THREE.Vector3(px, py, 0),
            0x39ff14,
          );
          d1.name = "concept-d1";
          scene.scene.add(d1);

          const d2 = createDashedLine(
            new THREE.Vector3(c, 0, 0),
            new THREE.Vector3(px, py, 0),
            0x39ff14,
          );
          d2.name = "concept-d2";
          scene.scene.add(d2);

          const sum = Math.sqrt((px + c) ** 2 + py ** 2) + Math.sqrt((px - c) ** 2 + py ** 2);
          const lbl = createLabel(`PF₁+PF₂ = ${sum.toFixed(1)} = 2a`, new THREE.Vector3(0, b + 1, 0), "#39ff14", 0.8);
          lbl.name = "concept-lbl-sum";
          scene.scene.add(lbl);
        }
      },
    },
    {
      label: "쌍곡선",
      latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
      description:
        "쌍곡선은 두 초점으로부터의 거리의 차가 일정한 점들의 집합입니다. 점근선도 표시됩니다.",
      params: [
        { name: "a", label: "a", min: 1, max: 4, step: 0.1, default: 2 },
        { name: "b", label: "b", min: 1, max: 3, step: 0.1, default: 1.5 },
      ],
      render: ({ scene, params }) => {
        const a = params.a ?? 2;
        const b = params.b ?? 1.5;
        const c = Math.sqrt(a * a + b * b);

        // Right branch
        const right = createParametricCurve(
          (t) => a / Math.cos(t),
          (t) => b * Math.tan(t),
          -1.55, 1.55, NEON_CYAN,
        );
        right.name = "concept-right";
        scene.scene.add(right);

        // Left branch
        const left = createParametricCurve(
          (t) => -a / Math.cos(t),
          (t) => -b * Math.tan(t),
          -1.55, 1.55, NEON_CYAN,
        );
        left.name = "concept-left";
        scene.scene.add(left);

        // Asymptotes
        const asym1 = createCurve((x) => (b / a) * x, -30, 30, NEON_ORANGE);
        asym1.name = "concept-asym1";
        scene.scene.add(asym1);

        const asym2 = createCurve((x) => -(b / a) * x, -30, 30, NEON_ORANGE);
        asym2.name = "concept-asym2";
        scene.scene.add(asym2);

        // Foci
        const f1 = createPoint(-c, 0, 0, NEON_MAGENTA, 0.12);
        f1.name = "concept-f1";
        scene.scene.add(f1);

        const f2 = createPoint(c, 0, 0, NEON_MAGENTA, 0.12);
        f2.name = "concept-f2";
        scene.scene.add(f2);

        const lblAsym = createLabel("점근선", new THREE.Vector3(5, (b / a) * 5 + 0.5, 0), "#ff6600", 0.7);
        lblAsym.name = "concept-lbl-asym";
        scene.scene.add(lblAsym);
      },
    },
    {
      label: "원뿔 단면",
      latex: "\\text{원뿔을 자르는 각도에 따라 다른 곡선}",
      description:
        "포물선, 타원, 쌍곡선 모두 원뿔을 평면으로 자른 단면입니다. 이것이 '이차곡선(conic section)'이라 불리는 이유입니다.",
      render: ({ scene }) => {
        // Show all three together
        // Ellipse
        const ellipse = createEllipse(3, 1.5, NEON_CYAN);
        ellipse.name = "concept-ellipse";
        ellipse.position.y = 4;
        scene.scene.add(ellipse);

        // Parabola
        const parabola = createParametricCurve(
          (t) => (t * t) / 4,
          (t) => t,
          -30, 30, NEON_GREEN,
        );
        parabola.name = "concept-parabola";
        scene.scene.add(parabola);

        // Hyperbola (right branch only)
        const hyperR = createParametricCurve(
          (t) => 2 / Math.cos(t),
          (t) => 1.5 * Math.tan(t),
          -1.55, 1.55, NEON_MAGENTA,
        );
        hyperR.name = "concept-hyper-r";
        hyperR.position.y = -5;
        scene.scene.add(hyperR);

        const hyperL = createParametricCurve(
          (t) => -2 / Math.cos(t),
          (t) => -1.5 * Math.tan(t),
          -1.55, 1.55, NEON_MAGENTA,
        );
        hyperL.name = "concept-hyper-l";
        hyperL.position.y = -5;
        scene.scene.add(hyperL);

        const lbl1 = createLabel("타원", new THREE.Vector3(4, 4, 0), "#00f0ff", 0.8);
        lbl1.name = "concept-lbl1";
        scene.scene.add(lbl1);

        const lbl2 = createLabel("포물선", new THREE.Vector3(4, 0, 0), "#39ff14", 0.8);
        lbl2.name = "concept-lbl2";
        scene.scene.add(lbl2);

        const lbl3 = createLabel("쌍곡선", new THREE.Vector3(4, -5, 0), "#ff00ff", 0.8);
        lbl3.name = "concept-lbl3";
        scene.scene.add(lbl3);
      },
    },
  ],
};
