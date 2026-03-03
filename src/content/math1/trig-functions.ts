import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createDashedLine,
  createLabel,
  createCircle2D,
  createSinWave,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

const PI = Math.PI;

export const trigFunctions: ConceptData = {
  unitId: "trig-functions",
  title: "삼각함수",
  steps: [
    // Step 1: 단위원 회전
    {
      label: "단위원 회전",
      latex: "\\sin\\theta = y,\\quad \\cos\\theta = x",
      description:
        "단위원 위의 점 P(cosθ, sinθ)를 관찰하세요. 각도 슬라이더를 움직이면 sin과 cos 값이 실시간으로 변합니다.",
      params: [
        { name: "angle", label: "각도 θ (°)", min: 0, max: 360, step: 5, default: 45 },
      ],
      render: ({ scene, params }) => {
        const θ = ((params.angle ?? 45) * PI) / 180;

        // Unit circle
        const circle = createCircle2D(0, 0, 3, NEON_CYAN);
        circle.name = "concept-circle";
        scene.scene.add(circle);

        // Radius line
        const px = 3 * Math.cos(θ);
        const py = 3 * Math.sin(θ);
        const radius = createDashedLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(px, py, 0),
          0xffffff,
        );
        radius.name = "concept-radius";
        scene.scene.add(radius);

        // Point on circle
        const pt = createPoint(px, py, 0, NEON_GREEN, 0.15);
        pt.name = "concept-point";
        scene.scene.add(pt);

        // cos projection (x)
        const cosLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(px, py, 0),
            new THREE.Vector3(px, 0, 0),
          ]),
          new THREE.LineBasicMaterial({ color: NEON_ORANGE }),
        );
        cosLine.name = "concept-cos-proj";
        scene.scene.add(cosLine);

        // sin projection (y)
        const sinLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(px, py, 0),
            new THREE.Vector3(0, py, 0),
          ]),
          new THREE.LineBasicMaterial({ color: NEON_MAGENTA }),
        );
        sinLine.name = "concept-sin-proj";
        scene.scene.add(sinLine);

        // Labels
        const cosVal = Math.cos(θ).toFixed(2);
        const sinVal = Math.sin(θ).toFixed(2);
        scene.scene.add(createLabel(`cos=${cosVal}`, new THREE.Vector3(px / 2, -0.6, 0), "#D55E00"));
        scene.scene.add(createLabel(`sin=${sinVal}`, new THREE.Vector3(-1.2, py / 2, 0), "#CC79A7"));
        scene.scene.add(createLabel(`P(${cosVal}, ${sinVal})`, new THREE.Vector3(px + 0.3, py + 0.5, 0), "#009E73"));
      },
    },

    // Step 2: sin/cos 파동 연동
    {
      label: "사인·코사인 파동",
      latex: "y = \\sin x,\\quad y = \\cos x",
      description:
        "단위원의 각도가 증가하면서 sin, cos 값이 파동으로 펼쳐집니다. 왼쪽 원과 오른쪽 그래프의 연동을 관찰하세요.",
      params: [
        { name: "angle", label: "각도 θ (°)", min: 0, max: 720, step: 5, default: 90 },
      ],
      render: ({ scene, params }) => {
        const θ = ((params.angle ?? 90) * PI) / 180;
        const ox = -5; // circle center offset

        // Unit circle (small, left side)
        const circle = createCircle2D(ox, 0, 2, 0x555577);
        circle.name = "concept-circle";
        scene.scene.add(circle);

        const px = ox + 2 * Math.cos(θ);
        const py = 2 * Math.sin(θ);
        scene.scene.add(createPoint(px, py, 0, NEON_GREEN, 0.12));

        // Connection line from circle to wave
        const waveSin = createSinWave(2, 1, 0, 0, 4 * PI, NEON_CYAN);
        waveSin.name = "concept-sin";
        scene.scene.add(waveSin);

        const waveCos = createCurve((x) => 2 * Math.cos(x), 0, 4 * PI, NEON_ORANGE);
        waveCos.name = "concept-cos";
        scene.scene.add(waveCos);

        // Current position marker on wave
        if (θ <= 4 * PI) {
          const sy = 2 * Math.sin(θ);
          const cy = 2 * Math.cos(θ);
          scene.scene.add(createPoint(θ, sy, 0, NEON_CYAN, 0.15));
          scene.scene.add(createPoint(θ, cy, 0, NEON_ORANGE, 0.15));

          // Connecting dashed line
          scene.scene.add(createDashedLine(
            new THREE.Vector3(px, py, 0),
            new THREE.Vector3(θ, sy, 0),
            0x555577,
          ));
        }

        scene.scene.add(createLabel("sin x", new THREE.Vector3(PI, 2.5, 0), "#0072B2"));
        scene.scene.add(createLabel("cos x", new THREE.Vector3(PI, -2.8, 0), "#D55E00"));
      },
    },

    // Step 3: tan과 점근선
    {
      label: "탄젠트와 점근선",
      latex: "\\tan x = \\frac{\\sin x}{\\cos x}",
      description:
        "cos x = 0인 지점(π/2, 3π/2, ...)에서 tan은 정의되지 않아 점근선이 생깁니다. 그래프가 발산하는 모습을 관찰하세요.",
      params: [
        { name: "xRange", label: "x 범위", min: 1, max: 4, step: 0.5, default: 2 },
      ],
      render: ({ scene, params }) => {
        const halfRange = (params.xRange ?? 2) * PI;

        // tan curve (split at asymptotes)
        const tanCurve = createCurve(
          (x) => Math.tan(x),
          -halfRange,
          halfRange,
          NEON_CYAN,
          600,
        );
        tanCurve.name = "concept-tan";
        scene.scene.add(tanCurve);

        // Asymptote lines
        const nAsymp = Math.ceil(halfRange / PI);
        for (let k = -nAsymp; k <= nAsymp; k++) {
          const ax = (k + 0.5) * PI;
          if (Math.abs(ax) > halfRange + 1) continue;
          const asy = createDashedLine(
            new THREE.Vector3(ax, -10, 0),
            new THREE.Vector3(ax, 10, 0),
            0xff4444,
            0.2,
            0.15,
          );
          asy.name = `concept-asymp-${k}`;
          scene.scene.add(asy);
        }

        scene.scene.add(createLabel("tan x", new THREE.Vector3(1, 3, 0), "#0072B2"));
        scene.scene.add(createLabel("점근선", new THREE.Vector3(PI / 2 + 0.8, 5, 0), "#ff4444"));
      },
    },

    // Step 4: 삼각함수 합성
    {
      label: "삼각함수 합성",
      latex: "a\\sin x + b\\cos x = R\\sin(x+\\varphi)",
      description:
        "a·sin x + b·cos x는 항상 하나의 사인함수로 합성됩니다. R = √(a²+b²), φ = arctan(b/a). 세 곡선이 어떻게 합쳐지는지 확인하세요.",
      params: [
        { name: "a", label: "a (sin 계수)", min: -3, max: 3, step: 0.1, default: 1 },
        { name: "b", label: "b (cos 계수)", min: -3, max: 3, step: 0.1, default: 1 },
      ],
      render: ({ scene, params }) => {
        const a = params.a ?? 1;
        const b = params.b ?? 1;
        const R = Math.sqrt(a * a + b * b);
        const phi = Math.atan2(b, a);

        // a·sin x
        const sinPart = createCurve((x) => a * Math.sin(x), -2 * PI, 4 * PI, NEON_CYAN);
        sinPart.name = "concept-sin-part";
        scene.scene.add(sinPart);

        // b·cos x
        const cosPart = createCurve((x) => b * Math.cos(x), -2 * PI, 4 * PI, NEON_ORANGE);
        cosPart.name = "concept-cos-part";
        scene.scene.add(cosPart);

        // Combined = R·sin(x + φ)
        const combined = createCurve(
          (x) => a * Math.sin(x) + b * Math.cos(x),
          -2 * PI,
          4 * PI,
          NEON_GREEN,
        );
        combined.name = "concept-combined";
        scene.scene.add(combined);

        scene.scene.add(createLabel(`${a.toFixed(1)}sin x`, new THREE.Vector3(-1.5, a + 0.5, 0), "#0072B2"));
        scene.scene.add(createLabel(`${b.toFixed(1)}cos x`, new THREE.Vector3(0.5, b + 0.5, 0), "#D55E00"));
        scene.scene.add(createLabel(
          `R=${R.toFixed(2)} sin(x+${(phi * 180 / PI).toFixed(0)}°)`,
          new THREE.Vector3(3, R + 0.5, 0),
          "#009E73",
        ));
      },
    },
  ],
};
