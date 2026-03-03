import * as THREE from "three";
import type { SurfaceData } from "@/utils/mathParser";

export function createSurfaceMesh(
  data: SurfaceData,
  color: string,
  functionId: string,
): THREE.Group {
  const group = new THREE.Group();
  group.name = `graph-${functionId}`;

  if (!data || !data.vertices || !data.indices || data.vertices.length === 0) return group;

  const { vertices, indices, zMin, zMax } = data;

  // Build geometry
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(new THREE.BufferAttribute(indices, 1));

  // Vertex colors: gradient based on z height
  const baseColor = new THREE.Color(color);
  const lowColor = baseColor.clone().offsetHSL(0, 0, -0.2);
  const highColor = baseColor.clone().offsetHSL(0, -0.1, 0.25);

  const vertCount = vertices.length / 3;
  const colors = new Float32Array(vertCount * 3);
  const range = zMax - zMin || 1;

  for (let i = 0; i < vertCount; i++) {
    const z = vertices[i * 3 + 2];
    const t = Math.max(0, Math.min(1, (z - zMin) / range));
    const c = new THREE.Color().lerpColors(lowColor, highColor, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geom.computeVertexNormals();

  // Surface mesh
  const mat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
    shininess: 30,
  });
  const mesh = new THREE.Mesh(geom, mat);
  group.add(mesh);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: baseColor,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const wire = new THREE.Mesh(geom, wireMat);
  group.add(wire);

  return group;
}
