import * as THREE from "three";
import { GRAPH_PALETTE, GRAPH_PALETTE_DARK } from "@/types/explore";

export function getNextColor(index: number, dark = false): string {
  const palette = dark ? GRAPH_PALETTE_DARK : GRAPH_PALETTE;
  return palette[index % palette.length];
}

export function createLineMaterial(color: string): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
  });
}

export function createGlowMaterial(color: string): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.2,
  });
}
