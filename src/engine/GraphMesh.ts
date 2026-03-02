import * as THREE from "three";
import { createLineMaterial, createGlowMaterial } from "./NeonMaterial";

// Dash patterns: 3번째 함수부터 대시 스타일 적용 (색 + 스타일 이중 구분)
const DASH_PATTERNS: { dashSize: number; gapSize: number }[] = [
  { dashSize: 0, gapSize: 0 },     // 0: solid
  { dashSize: 0, gapSize: 0 },     // 1: solid
  { dashSize: 0.8, gapSize: 0.4 }, // 2: long dash
  { dashSize: 0.3, gapSize: 0.3 }, // 3: short dot
  { dashSize: 1.0, gapSize: 0.3 }, // 4: dash-dot
  { dashSize: 0.5, gapSize: 0.5 }, // 5: medium dash
];

export function createGraphLine(
  points: Float32Array,
  color: string,
  functionId: string,
  lineIndex = 0,
): THREE.Group {
  const group = new THREE.Group();
  group.name = `graph-${functionId}`;

  const pattern = DASH_PATTERNS[lineIndex % DASH_PATTERNS.length];
  const useDash = pattern.dashSize > 0;

  const material = useDash
    ? new THREE.LineDashedMaterial({
        color: new THREE.Color(color),
        dashSize: pattern.dashSize,
        gapSize: pattern.gapSize,
      })
    : createLineMaterial(color);

  const glowMat = createGlowMaterial(color);

  // Split into continuous segments at NaN boundaries
  const segments: THREE.Vector3[][] = [];
  let current: THREE.Vector3[] = [];

  for (let i = 0; i < points.length / 3; i++) {
    const x = points[i * 3];
    const y = points[i * 3 + 1];
    const z = points[i * 3 + 2];

    if (isNaN(y) || Math.abs(y) > 100) {
      if (current.length > 1) segments.push(current);
      current = [];
    } else {
      current.push(new THREE.Vector3(x, y, z));
    }
  }
  if (current.length > 1) segments.push(current);

  for (const seg of segments) {
    // Main line
    const geom = new THREE.BufferGeometry().setFromPoints(seg);
    const line = new THREE.Line(geom, material);
    if (useDash) line.computeLineDistances();
    group.add(line);

    // Glow line (transparent overlay for visual emphasis)
    const glowGeom = new THREE.BufferGeometry().setFromPoints(seg);
    const glow = new THREE.Line(glowGeom, glowMat);
    group.add(glow);
  }

  return group;
}
