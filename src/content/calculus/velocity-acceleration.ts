import * as THREE from "three";
import type { ConceptData } from "@/types/concept";
import {
  createCurve,
  createPoint,
  createArrow,
  createLabel,
  createDashedLine,
  NEON_CYAN,
  NEON_GREEN,
  NEON_MAGENTA,
  NEON_ORANGE,
} from "@/engine/ConceptMeshes";

// Position: s(t) = t³ - 6t² + 9t
const s = (t: number) => t * t * t - 6 * t * t + 9 * t;
// Velocity: v(t) = 3t² - 12t + 9
const v = (t: number) => 3 * t * t - 12 * t + 9;
// Acceleration: a = 6t - 12
const acc = (t: number) => 6 * t - 12;

export const velocityAcceleration: ConceptData = {
  unitId: "velocity-acceleration",
  title: "속도와 가속도",
  steps: [
    {
      label: "위치 함수",
      latex: "s(t) = t^3 - 6t^2 + 9t",
      description:
        "시간 t에 따른 물체의 위치를 나타내는 함수입니다. 물체가 어떻게 움직이는지 관찰하세요.",
      params: [
        { name: "t", label: "시간 t", min: 0, max: 4, step: 0.05, default: 0 },
      ],
      render: ({ scene, params }) => {
        // Position graph
        const posCurve = createCurve(s, -30, 30, NEON_CYAN);
        posCurve.name = "concept-pos-curve";
        scene.scene.add(posCurve);

        const t0 = params.t ?? 0;
        const pos = s(t0);

        // Moving point on curve
        const pt = createPoint(t0, pos, 0, NEON_GREEN, 0.18);
        pt.name = "concept-pt";
        scene.scene.add(pt);

        // Moving point on x-axis (physical position)
        const physical = createPoint(pos, -2, 0, NEON_MAGENTA, 0.2);
        physical.name = "concept-physical";
        scene.scene.add(physical);

        // Track line
        const track = createDashedLine(
          new THREE.Vector3(-2, -2, 0),
          new THREE.Vector3(8, -2, 0),
          0x666688,
        );
        track.name = "concept-track";
        scene.scene.add(track);

        const lbl = createLabel(
          `s(${t0.toFixed(1)}) = ${pos.toFixed(1)}`,
          new THREE.Vector3(t0 + 0.8, pos + 0.5, 0),
          "#39ff14",
          0.9,
        );
        lbl.name = "concept-lbl";
        scene.scene.add(lbl);

        const lblTrack = createLabel("위치", new THREE.Vector3(-2, -1.3, 0), "#ff00ff", 0.7);
        lblTrack.name = "concept-lbl-track";
        scene.scene.add(lblTrack);
      },
    },
    {
      label: "속도 = 위치의 미분",
      latex: "v(t) = s'(t) = 3t^2 - 12t + 9",
      description:
        "속도는 위치의 시간에 대한 미분입니다. v(t) > 0이면 전진, v(t) < 0이면 후진합니다.",
      params: [
        { name: "t", label: "시간 t", min: 0, max: 4, step: 0.05, default: 0.5 },
      ],
      render: ({ scene, params }) => {
        const posCurve = createCurve(s, -30, 30, NEON_CYAN);
        posCurve.name = "concept-pos";
        scene.scene.add(posCurve);

        const velCurve = createCurve(v, -30, 30, NEON_GREEN);
        velCurve.name = "concept-vel";
        scene.scene.add(velCurve);

        const t0 = params.t ?? 0.5;
        const pos = s(t0);
        const vel = v(t0);

        // Point on position curve
        const ptPos = createPoint(t0, pos, 0, NEON_CYAN, 0.12);
        ptPos.name = "concept-pt-pos";
        scene.scene.add(ptPos);

        // Point on velocity curve
        const ptVel = createPoint(t0, vel, 0, NEON_GREEN, 0.12);
        ptVel.name = "concept-pt-vel";
        scene.scene.add(ptVel);

        // Velocity vector at physical position
        const physPos = pos;
        const velArrow = createArrow(
          new THREE.Vector3(physPos, -3, 0),
          new THREE.Vector3(physPos + vel * 0.3, -3, 0),
          vel >= 0 ? NEON_GREEN : NEON_ORANGE,
          0.2,
          0.1,
        );
        velArrow.name = "concept-vel-arrow";
        scene.scene.add(velArrow);

        const ptPhys = createPoint(physPos, -3, 0, NEON_MAGENTA, 0.15);
        ptPhys.name = "concept-phys";
        scene.scene.add(ptPhys);

        const lblS = createLabel("s(t)", new THREE.Vector3(4.3, s(4), 0), "#00f0ff", 0.7);
        lblS.name = "concept-lbl-s";
        scene.scene.add(lblS);

        const lblV = createLabel("v(t)", new THREE.Vector3(4.3, v(4), 0), "#39ff14", 0.7);
        lblV.name = "concept-lbl-v";
        scene.scene.add(lblV);
      },
    },
    {
      label: "가속도 = 속도의 미분",
      latex: "a(t) = v'(t) = s''(t) = 6t - 12",
      description:
        "가속도는 속도의 미분입니다. a > 0이면 속도 증가, a < 0이면 속도 감소. 세 함수의 관계를 확인하세요.",
      render: ({ scene }) => {
        const posCurve = createCurve(s, -30, 30, NEON_CYAN);
        posCurve.name = "concept-pos";
        scene.scene.add(posCurve);

        const velCurve = createCurve(v, -30, 30, NEON_GREEN);
        velCurve.name = "concept-vel";
        scene.scene.add(velCurve);

        const accCurve = createCurve(acc, -30, 30, NEON_ORANGE);
        accCurve.name = "concept-acc";
        scene.scene.add(accCurve);

        const lblS = createLabel("s(t) 위치", new THREE.Vector3(4.5, s(4), 0), "#00f0ff", 0.7);
        lblS.name = "concept-lbl-s";
        scene.scene.add(lblS);

        const lblV = createLabel("v(t) 속도", new THREE.Vector3(4.5, v(4), 0), "#39ff14", 0.7);
        lblV.name = "concept-lbl-v";
        scene.scene.add(lblV);

        const lblA = createLabel("a(t) 가속도", new THREE.Vector3(4.5, acc(4), 0), "#ff6600", 0.7);
        lblA.name = "concept-lbl-a";
        scene.scene.add(lblA);

        // v=0 points (t=1, t=3)
        const z1 = createPoint(1, 0, 0, NEON_MAGENTA, 0.12);
        z1.name = "concept-z1";
        scene.scene.add(z1);

        const z2 = createPoint(3, 0, 0, NEON_MAGENTA, 0.12);
        z2.name = "concept-z2";
        scene.scene.add(z2);

        const lblZ = createLabel("v=0 (방향전환)", new THREE.Vector3(2, -1, 0), "#ff00ff", 0.7);
        lblZ.name = "concept-lbl-z";
        scene.scene.add(lblZ);
      },
    },
  ],
};
