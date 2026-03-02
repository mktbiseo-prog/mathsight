import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createDashedLine,
  createShadedRegion,
  createLabel,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";
import * as THREE from "three";

const fn = (x: number) => x * x * x - 3 * x; // x³ - 3x
const dfn = (x: number) => 3 * x * x - 3; // 3x² - 3

export const extrema: ConceptData = {
  unitId: "extrema",
  title: "함수의 증감과 극대·극소",
  steps: [
    {
      label: "함수 그래프",
      latex: "f(x) = x^3 - 3x",
      description:
        "3차 함수 f(x) = x³ - 3x의 그래프입니다. 이 함수의 증가/감소 구간과 극값을 찾아봅시다.",
      render: ({ scene }) => {
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);
      },
    },
    {
      label: "도함수 f'(x)",
      latex: "f'(x) = 3x^2 - 3 = 3(x+1)(x-1)",
      description:
        "도함수 f'(x) = 3x² - 3입니다. f'(x) = 0인 점이 x = -1, x = 1이며, 이 점들이 극값 후보입니다.",
      render: ({ scene }) => {
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        const deriv = createCurve(dfn, -30, 30, NEON_GREEN);
        deriv.name = "concept-deriv";
        scene.scene.add(deriv);

        // f'(x)=0 points
        const p1 = createPoint(-1, 0, 0, NEON_MAGENTA, 0.15);
        p1.name = "concept-zero1";
        scene.scene.add(p1);

        const p2 = createPoint(1, 0, 0, NEON_MAGENTA, 0.15);
        p2.name = "concept-zero2";
        scene.scene.add(p2);

        const lbl1 = createLabel("x = -1", new THREE.Vector3(-1, -0.8, 0), "#ff00ff", 0.8);
        lbl1.name = "concept-lbl1";
        scene.scene.add(lbl1);

        const lbl2 = createLabel("x = 1", new THREE.Vector3(1, -0.8, 0), "#ff00ff", 0.8);
        lbl2.name = "concept-lbl2";
        scene.scene.add(lbl2);

        const lblF = createLabel("f(x)", new THREE.Vector3(2.5, fn(2.5), 0), "#00f0ff", 0.8);
        lblF.name = "concept-lblF";
        scene.scene.add(lblF);

        const lblD = createLabel("f'(x)", new THREE.Vector3(2, dfn(2), 0), "#39ff14", 0.8);
        lblD.name = "concept-lblD";
        scene.scene.add(lblD);
      },
    },
    {
      label: "증가/감소 구간",
      latex: "f'(x) > 0: \\ x < -1,\\ x > 1 \\quad f'(x) < 0: \\ -1 < x < 1",
      description:
        "f'(x) > 0이면 증가(초록), f'(x) < 0이면 감소(주황) 구간입니다. 색칠된 영역을 확인하세요.",
      render: ({ scene }) => {
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        // Increasing regions (green shade)
        const inc1 = createShadedRegion(fn, -3, -1, NEON_GREEN, 0.1);
        inc1.name = "concept-inc1";
        scene.scene.add(inc1);

        const inc2 = createShadedRegion(fn, 1, 3, NEON_GREEN, 0.1);
        inc2.name = "concept-inc2";
        scene.scene.add(inc2);

        // Decreasing region (orange shade)
        const dec = createShadedRegion(fn, -1, 1, NEON_ORANGE, 0.1);
        dec.name = "concept-dec";
        scene.scene.add(dec);

        const lblInc = createLabel("증가", new THREE.Vector3(-2, 3, 0), "#39ff14", 1);
        lblInc.name = "concept-lblInc";
        scene.scene.add(lblInc);

        const lblDec = createLabel("감소", new THREE.Vector3(0, -1, 0), "#ff6600", 1);
        lblDec.name = "concept-lblDec";
        scene.scene.add(lblDec);
      },
    },
    {
      label: "극대와 극소",
      latex: "\\text{극대}: f(-1) = 2, \\quad \\text{극소}: f(1) = -2",
      description:
        "f'(x)의 부호가 +에서 -로 바뀌는 x = -1에서 극대값 2, -에서 +로 바뀌는 x = 1에서 극소값 -2를 가집니다.",
      render: ({ scene }) => {
        const curve = createCurve(fn, -30, 30, NEON_CYAN);
        curve.name = "concept-curve";
        scene.scene.add(curve);

        // Extrema points
        const maxPt = createPoint(-1, 2, 0, NEON_MAGENTA, 0.2);
        maxPt.name = "concept-max";
        scene.scene.add(maxPt);

        const minPt = createPoint(1, -2, 0, NEON_ORANGE, 0.2);
        minPt.name = "concept-min";
        scene.scene.add(minPt);

        // Dashed lines
        const hMax = createDashedLine(
          new THREE.Vector3(-1, 2, 0),
          new THREE.Vector3(0, 2, 0),
          0xff00ff,
        );
        hMax.name = "concept-hMax";
        scene.scene.add(hMax);

        const hMin = createDashedLine(
          new THREE.Vector3(1, -2, 0),
          new THREE.Vector3(0, -2, 0),
          0xff6600,
        );
        hMin.name = "concept-hMin";
        scene.scene.add(hMin);

        const lblMax = createLabel("극대 (−1, 2)", new THREE.Vector3(-1, 3, 0), "#ff00ff", 1);
        lblMax.name = "concept-lblMax";
        scene.scene.add(lblMax);

        const lblMin = createLabel("극소 (1, −2)", new THREE.Vector3(1, -3, 0), "#ff6600", 1);
        lblMin.name = "concept-lblMin";
        scene.scene.add(lblMin);
      },
    },
  ],
};
