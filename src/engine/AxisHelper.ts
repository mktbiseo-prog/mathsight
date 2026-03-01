import * as THREE from "three";

export interface AxisConfig {
  range: [number, number];
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
}

function createTextSprite(text: string, color: string, position: THREE.Vector3): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 20px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 32, 16);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(1.2, 0.6, 1);
  return sprite;
}

export function createAxes(config: AxisConfig): THREE.Group {
  const group = new THREE.Group();
  group.name = "axis-helper";
  const [min, max] = config.range;

  if (config.showGrid) {
    const gridSize = max - min;
    const divisions = gridSize;
    const grid = new THREE.GridHelper(gridSize, divisions, 0x333355, 0x1a1a2e);
    grid.rotation.x = Math.PI / 2;
    group.add(grid);
  }

  if (config.showAxes) {
    // X axis (orange)
    const xPoints = [new THREE.Vector3(min - 1, 0, 0), new THREE.Vector3(max + 1, 0, 0)];
    const xGeom = new THREE.BufferGeometry().setFromPoints(xPoints);
    const xLine = new THREE.Line(xGeom, new THREE.LineBasicMaterial({ color: 0xff6600 }));
    group.add(xLine);

    // Y axis (green)
    const yPoints = [new THREE.Vector3(0, min - 1, 0), new THREE.Vector3(0, max + 1, 0)];
    const yGeom = new THREE.BufferGeometry().setFromPoints(yPoints);
    const yLine = new THREE.Line(yGeom, new THREE.LineBasicMaterial({ color: 0x39ff14 }));
    group.add(yLine);

    // Arrow heads
    const arrowSize = 0.3;
    // X arrow
    const xArrow = new THREE.ConeGeometry(arrowSize * 0.5, arrowSize, 8);
    const xArrowMesh = new THREE.Mesh(xArrow, new THREE.MeshBasicMaterial({ color: 0xff6600 }));
    xArrowMesh.position.set(max + 1, 0, 0);
    xArrowMesh.rotation.z = -Math.PI / 2;
    group.add(xArrowMesh);

    // Y arrow
    const yArrow = new THREE.ConeGeometry(arrowSize * 0.5, arrowSize, 8);
    const yArrowMesh = new THREE.Mesh(yArrow, new THREE.MeshBasicMaterial({ color: 0x39ff14 }));
    yArrowMesh.position.set(0, max + 1, 0);
    group.add(yArrowMesh);
  }

  if (config.showLabels) {
    // Axis labels
    group.add(createTextSprite("x", "#ff6600", new THREE.Vector3(max + 1.8, 0, 0)));
    group.add(createTextSprite("y", "#39ff14", new THREE.Vector3(0, max + 1.8, 0)));

    // Tick marks
    for (let i = Math.ceil(min); i <= Math.floor(max); i++) {
      if (i === 0) continue;
      // X ticks
      const xTick = createTextSprite(
        String(i),
        "#666688",
        new THREE.Vector3(i, -0.6, 0),
      );
      xTick.scale.set(0.8, 0.4, 1);
      group.add(xTick);

      // Y ticks
      const yTick = createTextSprite(
        String(i),
        "#666688",
        new THREE.Vector3(-0.6, i, 0),
      );
      yTick.scale.set(0.8, 0.4, 1);
      group.add(yTick);
    }

    // Origin
    const origin = createTextSprite("O", "#666688", new THREE.Vector3(-0.5, -0.5, 0));
    origin.scale.set(0.8, 0.4, 1);
    group.add(origin);
  }

  return group;
}
