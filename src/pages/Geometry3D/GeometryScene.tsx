import { useRef, useEffect } from "react";
import * as THREE from "three";
import { SceneManager } from "@/engine/SceneManager";
import { useThemeStore } from "@/store/useThemeStore";

const BG = { light: 0xfafaf5, dark: 0x1a1a2e } as const;

export interface ShapeConfig {
  geometry: THREE.BufferGeometry;
  color: number;
  opacity?: number;
  wireframe?: boolean;
  edges?: boolean;
  edgeColor?: number;
  doubleSide?: boolean;
  position?: [number, number, number];
}

interface GeometrySceneProps {
  shapes: ShapeConfig[];
  cameraPos?: [number, number, number];
}

export function GeometryScene({ shapes, cameraPos = [0, 1.5, 6] }: GeometrySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const theme = useThemeStore((s) => s.theme);

  // Init scene
  useEffect(() => {
    if (!containerRef.current) return;
    const manager = new SceneManager(containerRef.current);
    managerRef.current = manager;

    // Lights
    manager.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 4);
    manager.scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x8888ff, 0.3);
    dir2.position.set(-3, -2, -4);
    manager.scene.add(dir2);

    // Grid
    const grid = new THREE.GridHelper(6, 12, 0x333355, 0x222244);
    grid.position.y = -1.8;
    grid.name = "geo-grid";
    manager.scene.add(grid);

    // Controls
    manager.controls.enableRotate = true;
    manager.controls.screenSpacePanning = true;
    manager.controls.minDistance = 2;
    manager.controls.maxDistance = 15;

    return () => {
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  // Update background
  useEffect(() => {
    const m = managerRef.current;
    if (!m) return;
    m.setBackground(BG[theme]);
    const grid = m.scene.getObjectByName("geo-grid") as THREE.GridHelper | undefined;
    if (grid) {
      (grid.material as THREE.LineBasicMaterial[])[0].color.set(theme === "dark" ? 0x333355 : 0xccccbb);
      (grid.material as THREE.LineBasicMaterial[])[1].color.set(theme === "dark" ? 0x222244 : 0xddddcc);
    }
  }, [theme]);

  // Update camera
  useEffect(() => {
    const m = managerRef.current;
    if (!m) return;
    m.camera.position.set(...cameraPos);
    m.camera.lookAt(0, 0, 0);
  }, [cameraPos]);

  // Update shapes
  useEffect(() => {
    const m = managerRef.current;
    if (!m) return;

    m.removeByPrefix("geo-shape");

    shapes.forEach((cfg, i) => {
      const mat = new THREE.MeshPhongMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity ?? 0.85,
        wireframe: cfg.wireframe ?? false,
        side: cfg.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
        shininess: 60,
      });
      const mesh = new THREE.Mesh(cfg.geometry, mat);
      mesh.name = `geo-shape-${i}`;

      if (cfg.edges) {
        const edgeGeo = new THREE.EdgesGeometry(cfg.geometry);
        const edgeMat = new THREE.LineBasicMaterial({ color: cfg.edgeColor ?? 0xffffff });
        mesh.add(new THREE.LineSegments(edgeGeo, edgeMat));
      }

      if (cfg.position) mesh.position.set(...cfg.position);
      m.scene.add(mesh);
    });
  }, [shapes]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: 280, touchAction: "none" }}
    />
  );
}
