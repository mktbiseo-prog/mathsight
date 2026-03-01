import * as THREE from "three";
import type { NeonColor } from "@/types/explore";
import { NEON_PALETTE } from "@/types/explore";

export function getNextColor(index: number): NeonColor {
  return NEON_PALETTE[index % NEON_PALETTE.length];
}

export function createLineMaterial(color: NeonColor): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
  });
}

export function createGlowMaterial(color: NeonColor): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.2,
  });
}
