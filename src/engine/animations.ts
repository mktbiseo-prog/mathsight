import gsap from "gsap";
import * as THREE from "three";

/** Collect all materials from an Object3D tree (including Sprites) */
function collectMaterials(obj: THREE.Object3D): THREE.Material[] {
  const mats: THREE.Material[] = [];
  obj.traverse((child) => {
    if (child instanceof THREE.Sprite) {
      mats.push(child.material);
    } else if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
      const mat = child.material;
      if (Array.isArray(mat)) {
        mats.push(...mat);
      } else {
        mats.push(mat);
      }
    }
  });
  return mats;
}

/** Store original opacity before fade-in so we can restore it */
function prepareForFadeIn(objects: THREE.Object3D[]): Map<THREE.Material, number> {
  const originals = new Map<THREE.Material, number>();
  for (const obj of objects) {
    const mats = collectMaterials(obj);
    for (const mat of mats) {
      originals.set(mat, mat.opacity);
      mat.transparent = true;
      mat.opacity = 0;
    }
  }
  return originals;
}

/**
 * Fade in objects with stagger.
 * Sets all materials to opacity 0, then animates to original opacity.
 */
export function fadeInObjects(
  objects: THREE.Object3D[],
  duration = 0.5,
  stagger = 0.08,
): gsap.core.Timeline {
  if (objects.length === 0) return gsap.timeline();

  const originals = prepareForFadeIn(objects);
  const tl = gsap.timeline();

  objects.forEach((obj, i) => {
    const mats = collectMaterials(obj);
    for (const mat of mats) {
      const target = originals.get(mat) ?? 1;
      tl.to(mat, { opacity: target, duration, ease: "power2.out" }, i * stagger);
    }
  });

  return tl;
}

/**
 * Fade out objects. Returns a promise that resolves when done.
 */
export function fadeOutObjects(
  objects: THREE.Object3D[],
  duration = 0.25,
): Promise<void> {
  if (objects.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    for (const obj of objects) {
      const mats = collectMaterials(obj);
      for (const mat of mats) {
        mat.transparent = true;
        tl.to(mat, { opacity: 0, duration, ease: "power2.in" }, 0);
      }
    }
  });
}

/**
 * Smoothly transition a single object's opacity.
 */
export function morphOpacity(
  obj: THREE.Object3D,
  targetOpacity: number,
  duration = 0.3,
): void {
  const mats = collectMaterials(obj);
  for (const mat of mats) {
    mat.transparent = true;
    gsap.to(mat, { opacity: targetOpacity, duration, ease: "power2.out" });
  }
}

/**
 * Kill all GSAP animations globally. Call on cleanup/dispose.
 */
export function killSceneAnimations(): void {
  gsap.globalTimeline.clear();
}
