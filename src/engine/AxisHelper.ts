import * as THREE from "three";

export interface AxisConfig {
  range: [number, number];
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  showZAxis?: boolean;
  theme?: "light" | "dark";
}

const THEME_COLORS = {
  light: {
    minorGrid: 0xD8D0C8,
    minorOpacity: 0.2,
    majorGrid: 0xC8C0B8,
    majorOpacity: 0.45,
    axis: 0x555555,
    label: "#666666",
    origin: 0x555555,
    arrow: 0x555555,
  },
  dark: {
    minorGrid: 0x3a3a4e,
    minorOpacity: 0.25,
    majorGrid: 0x4a4a5e,
    majorOpacity: 0.4,
    axis: 0x8888AA,
    label: "#888899",
    origin: 0x8888AA,
    arrow: 0x8888AA,
  },
};

// ── Custom grid using LineSegments (efficient single draw call) ──
function createGridLines(
  min: number,
  max: number,
  step: number,
  color: number,
  opacity: number,
  skipMultiple = 0,
): THREE.LineSegments {
  const positions: number[] = [];

  for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
    // Skip axis lines and optionally skip lines that belong to a larger step
    if (v === 0) continue;
    if (skipMultiple > 0 && v % skipMultiple === 0) continue;

    // Vertical line (x = v)
    positions.push(v, min, 0, v, max, 0);
    // Horizontal line (y = v)
    positions.push(min, v, 0, max, v, 0);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.LineSegments(geom, mat);
}

function createTextSprite(text: string, color: string, position: THREE.Vector3, scale = 1): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 48;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 24);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(1.6 * scale, 0.6 * scale, 1);
  return sprite;
}

export function createAxes(config: AxisConfig): THREE.Group {
  const group = new THREE.Group();
  group.name = "axis-helper";
  const [min, max] = config.range;
  const theme = config.theme ?? "dark";
  const colors = THEME_COLORS[theme];
  const rangeSize = max - min;

  // Adaptive tick/grid spacing based on range
  const majorStep = rangeSize <= 30 ? 5 : 10;
  const labelStep = rangeSize <= 30 ? 5 : 10;

  if (config.showGrid) {
    // Minor grid: every 1 unit (skip where major lines exist)
    const minor = createGridLines(min, max, 1, colors.minorGrid, colors.minorOpacity, majorStep);
    group.add(minor);

    // Major grid: every majorStep units
    const major = createGridLines(min, max, majorStep, colors.majorGrid, colors.majorOpacity);
    group.add(major);
  }

  if (config.showAxes) {
    const axisColor = colors.axis;
    const extend = 3;

    // X axis
    const xPoints = [new THREE.Vector3(min - extend, 0, 0), new THREE.Vector3(max + extend, 0, 0)];
    const xGeom = new THREE.BufferGeometry().setFromPoints(xPoints);
    const xLine = new THREE.Line(xGeom, new THREE.LineBasicMaterial({ color: axisColor }));
    group.add(xLine);

    // Y axis
    const yPoints = [new THREE.Vector3(0, min - extend, 0), new THREE.Vector3(0, max + extend, 0)];
    const yGeom = new THREE.BufferGeometry().setFromPoints(yPoints);
    const yLine = new THREE.Line(yGeom, new THREE.LineBasicMaterial({ color: axisColor }));
    group.add(yLine);

    // Z axis (if 3D mode)
    if (config.showZAxis) {
      const zPoints = [new THREE.Vector3(0, 0, min - extend), new THREE.Vector3(0, 0, max + extend)];
      const zGeom = new THREE.BufferGeometry().setFromPoints(zPoints);
      const zLine = new THREE.Line(zGeom, new THREE.LineBasicMaterial({ color: axisColor }));
      group.add(zLine);
    }

    // Arrow heads
    const arrowSize = 0.5;
    const arrowMat = new THREE.MeshBasicMaterial({ color: colors.arrow });

    const xArrow = new THREE.ConeGeometry(arrowSize * 0.4, arrowSize, 8);
    const xArrowMesh = new THREE.Mesh(xArrow, arrowMat);
    xArrowMesh.position.set(max + extend, 0, 0);
    xArrowMesh.rotation.z = -Math.PI / 2;
    group.add(xArrowMesh);

    const yArrow = new THREE.ConeGeometry(arrowSize * 0.4, arrowSize, 8);
    const yArrowMesh = new THREE.Mesh(yArrow, arrowMat.clone());
    yArrowMesh.position.set(0, max + extend, 0);
    group.add(yArrowMesh);

    // Z arrow (if 3D mode)
    if (config.showZAxis) {
      const zArrow = new THREE.ConeGeometry(arrowSize * 0.4, arrowSize, 8);
      const zArrowMesh = new THREE.Mesh(zArrow, arrowMat.clone());
      zArrowMesh.position.set(0, 0, max + extend);
      zArrowMesh.rotation.x = Math.PI / 2;
      group.add(zArrowMesh);
    }

    // Origin highlight
    const originGeom = new THREE.CircleGeometry(0.2, 32);
    const originMat = new THREE.MeshBasicMaterial({
      color: colors.origin,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const originMesh = new THREE.Mesh(originGeom, originMat);
    originMesh.position.set(0, 0, 0);
    group.add(originMesh);
  }

  if (config.showLabels) {
    const labelColor = colors.label;
    const labelScale = rangeSize <= 30 ? 1 : rangeSize <= 100 ? 1.2 : 1.5;
    const labelOffset = rangeSize <= 30 ? 0.7 : rangeSize <= 100 ? 1.2 : 1.8;

    // Axis end labels
    group.add(createTextSprite("x", labelColor, new THREE.Vector3(max + 4, 0, 0), labelScale));
    group.add(createTextSprite("y", labelColor, new THREE.Vector3(0, max + 4, 0), labelScale));

    if (config.showZAxis) {
      group.add(createTextSprite("z", labelColor, new THREE.Vector3(0, 0, max + 4), labelScale));
    }

    // Tick labels at labelStep intervals
    for (let v = Math.ceil(min / labelStep) * labelStep; v <= max; v += labelStep) {
      if (v === 0) continue;
      const text = String(v);

      // X tick
      const xTick = createTextSprite(text, labelColor, new THREE.Vector3(v, -labelOffset, 0), labelScale);
      group.add(xTick);

      // Y tick
      const yTick = createTextSprite(text, labelColor, new THREE.Vector3(-labelOffset - 0.3, v, 0), labelScale);
      group.add(yTick);

      // Z tick (if 3D mode)
      if (config.showZAxis) {
        const zTick = createTextSprite(text, labelColor, new THREE.Vector3(0, -labelOffset, v), labelScale);
        group.add(zTick);
      }
    }

    // Origin label
    const origin = createTextSprite("O", labelColor, new THREE.Vector3(-labelOffset, -labelOffset, 0), labelScale);
    group.add(origin);
  }

  return group;
}
