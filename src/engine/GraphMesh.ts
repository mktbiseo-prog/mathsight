import * as THREE from "three";
import type { NeonColor } from "@/types/explore";
import { createLineMaterial, createGlowMaterial } from "./NeonMaterial";

export function createGraphLine(
  points: Float32Array,
  color: NeonColor,
  functionId: string,
): THREE.Group {
  const group = new THREE.Group();
  group.name = `graph-${functionId}`;

  const material = createLineMaterial(color);
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
    group.add(line);

    // Glow line (wider, transparent)
    const glowGeom = new THREE.BufferGeometry().setFromPoints(seg);
    const glow = new THREE.Line(glowGeom, glowMat);
    group.add(glow);
  }

  return group;
}
