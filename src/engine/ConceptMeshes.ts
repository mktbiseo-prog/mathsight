import * as THREE from "three";

// ── Okabe-Ito colorblind-safe palette ──
const NEON_CYAN = 0x0072B2;    // Deep Blue
const NEON_GREEN = 0x009E73;   // Teal Green
const NEON_MAGENTA = 0xCC79A7; // Pink
const NEON_ORANGE = 0xD55E00;  // Vermilion Orange

// ── Point (sphere) ──
export function createPoint(
  x: number,
  y: number,
  z: number,
  color = NEON_CYAN,
  radius = 0.15,
): THREE.Mesh {
  const geom = new THREE.SphereGeometry(radius, 16, 16);
  const mat = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);
  return mesh;
}

// ── Arrow (vector) ──
export function createArrow(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color = NEON_GREEN,
  headLength = 0.3,
  headWidth = 0.12,
): THREE.Group {
  const group = new THREE.Group();
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  if (length < 0.001) return group;

  dir.normalize();

  const arrow = new THREE.ArrowHelper(dir, from, length, color, headLength, headWidth);
  group.add(arrow);
  return group;
}

// ── Curve from function y=f(x) ──
export function createCurve(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  color = NEON_CYAN,
  segments = 300,
): THREE.Line {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const x = xMin + (xMax - xMin) * (i / segments);
    const y = fn(x);
    if (isFinite(y) && Math.abs(y) < 100) {
      points.push(new THREE.Vector3(x, y, 0));
    }
  }
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geom, mat);
}

// ── Dashed line ──
export function createDashedLine(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color = 0x666688,
  dashSize = 0.2,
  gapSize = 0.1,
): THREE.Line {
  const geom = new THREE.BufferGeometry().setFromPoints([from, to]);
  const mat = new THREE.LineDashedMaterial({ color, dashSize, gapSize });
  const line = new THREE.Line(geom, mat);
  line.computeLineDistances();
  return line;
}

// ── Shaded region between curve and x-axis ──
export function createShadedRegion(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  color = NEON_CYAN,
  opacity = 0.2,
  segments = 200,
): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(xMin, 0);
  for (let i = 0; i <= segments; i++) {
    const x = xMin + (xMax - xMin) * (i / segments);
    const y = fn(x);
    shape.lineTo(x, isFinite(y) ? y : 0);
  }
  shape.lineTo(xMax, 0);
  shape.closePath();

  const geom = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geom, mat);
}

// ── Rectangles for Riemann sum ──
export function createRiemannRects(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  n: number,
  color = NEON_CYAN,
  opacity = 0.3,
): THREE.Group {
  const group = new THREE.Group();
  const dx = (xMax - xMin) / n;

  for (let i = 0; i < n; i++) {
    const x = xMin + i * dx;
    const y = fn(x + dx / 2); // midpoint
    if (!isFinite(y)) continue;

    const geom = new THREE.PlaneGeometry(dx * 0.98, Math.abs(y));
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
    });
    const rect = new THREE.Mesh(geom, mat);
    rect.position.set(x + dx / 2, y / 2, 0);
    group.add(rect);

    // Border
    const borderPoints = [
      new THREE.Vector3(x, 0, 0),
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x + dx, y, 0),
      new THREE.Vector3(x + dx, 0, 0),
    ];
    const borderGeom = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: opacity + 0.3 });
    group.add(new THREE.Line(borderGeom, borderMat));
  }
  return group;
}

// ── Revolution surface (rotate y=f(x) around x-axis) ──
export function createRevolutionSurface(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  color = NEON_MAGENTA,
  opacity = 0.4,
  xSegments = 60,
  thetaSegments = 32,
): THREE.Mesh {
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= xSegments; i++) {
    const x = xMin + (xMax - xMin) * (i / xSegments);
    const r = Math.abs(fn(x));
    for (let j = 0; j <= thetaSegments; j++) {
      const theta = (j / thetaSegments) * Math.PI * 2;
      vertices.push(x, r * Math.cos(theta), r * Math.sin(theta));
    }
  }

  for (let i = 0; i < xSegments; i++) {
    for (let j = 0; j < thetaSegments; j++) {
      const a = i * (thetaSegments + 1) + j;
      const b = a + thetaSegments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  const mat = new THREE.MeshPhongMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    wireframe: false,
  });
  return new THREE.Mesh(geom, mat);
}

// ── Wireframe of revolution surface ──
export function createRevolutionWireframe(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  color = NEON_MAGENTA,
  xSegments = 20,
  thetaSegments = 24,
): THREE.Group {
  const group = new THREE.Group();

  // Longitudinal lines (along x)
  for (let j = 0; j < thetaSegments; j++) {
    const theta = (j / thetaSegments) * Math.PI * 2;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= xSegments * 3; i++) {
      const x = xMin + (xMax - xMin) * (i / (xSegments * 3));
      const r = Math.abs(fn(x));
      pts.push(new THREE.Vector3(x, r * Math.cos(theta), r * Math.sin(theta)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
    group.add(new THREE.Line(geom, mat));
  }

  // Cross-section circles
  for (let i = 0; i <= xSegments; i++) {
    const x = xMin + (xMax - xMin) * (i / xSegments);
    const r = Math.abs(fn(x));
    const pts: THREE.Vector3[] = [];
    for (let j = 0; j <= thetaSegments; j++) {
      const theta = (j / thetaSegments) * Math.PI * 2;
      pts.push(new THREE.Vector3(x, r * Math.cos(theta), r * Math.sin(theta)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
    group.add(new THREE.Line(geom, mat));
  }

  return group;
}

// ── Ellipse curve ──
export function createEllipse(
  a: number,
  b: number,
  color = NEON_CYAN,
  segments = 100,
): THREE.Line {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(a * Math.cos(t), b * Math.sin(t), 0));
  }
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geom, mat);
}

// ── Parametric curve ──
export function createParametricCurve(
  xFn: (t: number) => number,
  yFn: (t: number) => number,
  tMin: number,
  tMax: number,
  color = NEON_CYAN,
  segments = 300,
): THREE.Line {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = tMin + (tMax - tMin) * (i / segments);
    const x = xFn(t);
    const y = yFn(t);
    if (isFinite(x) && isFinite(y)) {
      pts.push(new THREE.Vector3(x, y, 0));
    }
  }
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geom, mat);
}

// ── Text label as sprite ──
export function createLabel(
  text: string,
  position: THREE.Vector3,
  color = "#0072B2",
  scale = 1.5,
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.position.copy(position);
  sprite.scale.set(scale * 2, scale * 0.5, 1);
  return sprite;
}

// ── 3D sphere wireframe ──
export function createSphereWireframe(
  radius: number,
  center: THREE.Vector3 = new THREE.Vector3(),
  color = NEON_CYAN,
): THREE.Group {
  const group = new THREE.Group();

  // Solid transparent sphere
  const sphereGeom = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMat = new THREE.MeshPhongMaterial({
    color,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
  });
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);
  sphere.position.copy(center);
  group.add(sphere);

  // Wireframe
  const wireGeom = new THREE.SphereGeometry(radius, 16, 16);
  const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.3 });
  const wire = new THREE.Mesh(wireGeom, wireMat);
  wire.position.copy(center);
  group.add(wire);

  return group;
}

// ── Plane (flat quad) ──
export function createPlane3D(
  normal: THREE.Vector3,
  d: number,
  size = 10,
  color = NEON_ORANGE,
  opacity = 0.2,
): THREE.Mesh {
  const geom = new THREE.PlaneGeometry(size, size);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geom, mat);

  // Orient plane to match normal
  const up = new THREE.Vector3(0, 0, 1);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, normal.clone().normalize());
  mesh.applyQuaternion(quat);

  // Position along normal
  const n = normal.clone().normalize();
  mesh.position.copy(n.multiplyScalar(d / normal.length()));

  return mesh;
}

// ── Sin wave on XY plane ──
export function createSinWave(
  amplitude: number,
  frequency: number,
  phase: number,
  xMin: number,
  xMax: number,
  color = NEON_CYAN,
  segments = 400,
): THREE.Line {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const x = xMin + (xMax - xMin) * (i / segments);
    const y = amplitude * Math.sin(frequency * x + phase);
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geom, mat);
}

// ── Arc (partial circle) on XY plane ──
export function createArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  color = NEON_CYAN,
  segments = 100,
): THREE.Line {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = startAngle + (endAngle - startAngle) * (i / segments);
    pts.push(new THREE.Vector3(cx + radius * Math.cos(t), cy + radius * Math.sin(t), 0));
  }
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geom, mat);
}

// ── 2D circle outline ──
export function createCircle2D(
  cx: number,
  cy: number,
  radius: number,
  color = NEON_CYAN,
  segments = 80,
): THREE.Line {
  return createArc(cx, cy, radius, 0, Math.PI * 2, color, segments);
}

// ── Bar chart (vertical bars in XY plane) ──
export function createBarChart(
  values: number[],
  barWidth = 0.6,
  gap = 0.2,
  color = NEON_CYAN,
  opacity = 0.6,
): THREE.Group {
  const group = new THREE.Group();
  const stride = barWidth + gap;

  for (let i = 0; i < values.length; i++) {
    const h = values[i];
    if (!isFinite(h)) continue;
    const x = i * stride;

    const geom = new THREE.PlaneGeometry(barWidth, Math.abs(h));
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
    });
    const bar = new THREE.Mesh(geom, mat);
    bar.position.set(x + barWidth / 2, h / 2, 0);
    group.add(bar);

    // Border
    const pts = [
      new THREE.Vector3(x, 0, 0),
      new THREE.Vector3(x, h, 0),
      new THREE.Vector3(x + barWidth, h, 0),
      new THREE.Vector3(x + barWidth, 0, 0),
    ];
    const borderGeom = new THREE.BufferGeometry().setFromPoints(pts);
    const borderMat = new THREE.LineBasicMaterial({ color });
    group.add(new THREE.Line(borderGeom, borderMat));
  }
  return group;
}

export { NEON_CYAN, NEON_GREEN, NEON_MAGENTA, NEON_ORANGE };
