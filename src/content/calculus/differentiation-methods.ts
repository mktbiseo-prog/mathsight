import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createLabel,
  createDashedLine,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

export const differentiationMethods: ConceptData = {
  unitId: "differentiation-methods",
  title: "여러 가지 미분법",
  steps: [
    {
      label: "합성함수 미분 (체인룰)",
      latex: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
      description:
        "합성함수의 미분은 바깥 함수의 미분 × 안쪽 함수의 미분입니다. f(x)=x², g(x)=sin(x)일 때 sin²(x)의 미분을 봅시다.",
      render: ({ scene }) => {
        // sin²(x)
        const composite = createCurve((x) => Math.sin(x) ** 2, -30, 30, NEON_CYAN);
        composite.name = "concept-composite";
        scene.scene.add(composite);

        // Its derivative: 2sin(x)cos(x) = sin(2x)
        const deriv = createCurve((x) => Math.sin(2 * x), -30, 30, NEON_GREEN);
        deriv.name = "concept-deriv";
        scene.scene.add(deriv);

        const lbl1 = createLabel("sin²(x)", new THREE.Vector3(4, 0.8, 0), "#00f0ff", 0.9);
        lbl1.name = "concept-lbl1";
        scene.scene.add(lbl1);

        const lbl2 = createLabel("sin(2x)", new THREE.Vector3(3, -0.8, 0), "#39ff14", 0.9);
        lbl2.name = "concept-lbl2";
        scene.scene.add(lbl2);
      },
    },
    {
      label: "내부·외부 함수 분리",
      latex: "g(x) = \\sin x, \\quad f(u) = u^2",
      description:
        "합성함수를 분해합니다. 안쪽 함수 g(x)=sin(x)와 바깥 함수 f(u)=u²를 각각 확인하세요.",
      render: ({ scene }) => {
        // g(x) = sin(x)
        const inner = createCurve((x) => Math.sin(x), -30, 30, NEON_ORANGE);
        inner.name = "concept-inner";
        scene.scene.add(inner);

        // f(u) = u² (shown as x²)
        const outer = createCurve((x) => x * x, -30, 30, NEON_MAGENTA);
        outer.name = "concept-outer";
        scene.scene.add(outer);

        const lblIn = createLabel("g(x) = sin x", new THREE.Vector3(4.5, 1.2, 0), "#ff6600", 0.9);
        lblIn.name = "concept-lblIn";
        scene.scene.add(lblIn);

        const lblOut = createLabel("f(u) = u²", new THREE.Vector3(2, 3.5, 0), "#ff00ff", 0.9);
        lblOut.name = "concept-lblOut";
        scene.scene.add(lblOut);
      },
    },
    {
      label: "매개변수 미분",
      latex: "\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}",
      description:
        "x = cos(t), y = sin(t)로 정의된 원의 접선 기울기를 매개변수 미분으로 구합니다.",
      params: [
        { name: "t", label: "t", min: 0, max: 6.2, step: 0.1, default: 1 },
      ],
      render: ({ scene, params }) => {
        const t = params.t ?? 1;

        // Unit circle
        const circle = createCurve(
          (x) => Math.sqrt(Math.max(0, 1 - x * x)),
          -1, 1, NEON_CYAN, 200,
        );
        circle.name = "concept-circle-top";
        scene.scene.add(circle);

        const circleBot = createCurve(
          (x) => -Math.sqrt(Math.max(0, 1 - x * x)),
          -1, 1, NEON_CYAN, 200,
        );
        circleBot.name = "concept-circle-bot";
        scene.scene.add(circleBot);

        // Point on circle
        const px = Math.cos(t);
        const py = Math.sin(t);
        const pt = createPoint(px, py, 0, NEON_GREEN, 0.12);
        pt.name = "concept-pt";
        scene.scene.add(pt);

        // Tangent: dy/dx = -cos(t)/sin(t) at the point
        const dxdt = -Math.sin(t);
        const dydt = Math.cos(t);
        const slope = Math.abs(dxdt) > 0.01 ? dydt / dxdt : 100;

        const tangent = createCurve(
          (x) => py + slope * (x - px),
          -30, 30, NEON_MAGENTA,
        );
        tangent.name = "concept-tangent";
        scene.scene.add(tangent);

        const lbl = createLabel(
          `dy/dx = ${slope.toFixed(2)}`,
          new THREE.Vector3(px + 1, py + 0.5, 0),
          "#ff00ff",
          0.9,
        );
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);
      },
    },
    {
      label: "음함수 미분",
      latex: "x^2 + y^2 = r^2 \\Rightarrow \\frac{dy}{dx} = -\\frac{x}{y}",
      description:
        "원 x² + y² = 4를 y에 대해 풀지 않고도 미분할 수 있습니다. 양변을 x로 미분하면 dy/dx = -x/y.",
      params: [
        { name: "t", label: "각도", min: 0.2, max: 6, step: 0.1, default: 0.8 },
      ],
      render: ({ scene, params }) => {
        const r = 2;
        const t = params.t ?? 0.8;

        // Circle x²+y²=4
        const top = createCurve(
          (x) => Math.sqrt(Math.max(0, r * r - x * x)),
          -r, r, NEON_CYAN, 200,
        );
        top.name = "concept-top";
        scene.scene.add(top);

        const bot = createCurve(
          (x) => -Math.sqrt(Math.max(0, r * r - x * x)),
          -r, r, NEON_CYAN, 200,
        );
        bot.name = "concept-bot";
        scene.scene.add(bot);

        const px = r * Math.cos(t);
        const py = r * Math.sin(t);
        const pt = createPoint(px, py, 0, NEON_GREEN, 0.12);
        pt.name = "concept-pt";
        scene.scene.add(pt);

        // dy/dx = -x/y
        const slope = Math.abs(py) > 0.01 ? -px / py : -100;
        const tang = createCurve(
          (x) => py + slope * (x - px),
          -30, 30, NEON_GREEN,
        );
        tang.name = "concept-tangent";
        scene.scene.add(tang);

        // Radius line
        const rad = createDashedLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(px, py, 0),
          0xff6600,
        );
        rad.name = "concept-radius";
        scene.scene.add(rad);

        const lbl = createLabel(
          `-x/y = ${slope.toFixed(2)}`,
          new THREE.Vector3(px + 1.2, py + 0.8, 0),
          "#39ff14",
          0.9,
        );
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);
      },
    },
  ],
};
