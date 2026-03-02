import { parse, compile } from "mathjs";
import type { EvalFunction, MathNode } from "mathjs";

const RESERVED = new Set(["x", "y", "z", "e", "pi", "i"]);

const BUILTIN_FUNCTIONS = new Set([
  "sin", "cos", "tan", "asin", "acos", "atan",
  "sinh", "cosh", "tanh", "sqrt", "abs", "log",
  "log10", "log2", "exp", "ceil", "floor", "round",
  "sign", "min", "max", "pow", "sec", "csc", "cot",
]);

export interface ParseResult {
  success: true;
  normalizedExpr: string;
  compiled: EvalFunction;
  parameters: string[];
}

export interface ParseError {
  success: false;
  error: string;
}

function normalizeExpression(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/^[yz]\s*=\s*(.+)$/i);
  return match ? match[1] : trimmed;
}

export function parseExpression(input: string): ParseResult | ParseError {
  try {
    const expr = normalizeExpression(input);
    const node = parse(expr);
    const compiled = compile(expr);

    const symbols = new Set<string>();
    node.traverse((n: MathNode) => {
      if (n.type === "SymbolNode" && "name" in n) {
        const name = (n as unknown as { name: string }).name;
        if (!RESERVED.has(name) && !BUILTIN_FUNCTIONS.has(name)) {
          symbols.add(name);
        }
      }
    });

    return {
      success: true,
      normalizedExpr: expr,
      compiled,
      parameters: Array.from(symbols).sort(),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "알 수 없는 파싱 오류",
    };
  }
}

export function hasYVariable(expr: string): boolean {
  try {
    const node = parse(expr);
    let found = false;
    node.traverse((n: MathNode) => {
      if (n.type === "SymbolNode" && "name" in n) {
        if ((n as unknown as { name: string }).name === "y") {
          found = true;
        }
      }
    });
    return found;
  } catch {
    return false;
  }
}

export interface SurfaceData {
  vertices: Float32Array;
  indices: Uint32Array;
  zMin: number;
  zMax: number;
}

export function evaluateSurface(
  compiled: EvalFunction,
  xRange: [number, number],
  yRange: [number, number],
  resolution: number,
  params: Record<string, number>,
): SurfaceData {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const res = resolution;
  const xStep = (xMax - xMin) / res;
  const yStep = (yMax - yMin) / res;
  const vertCount = (res + 1) * (res + 1);

  const vertices = new Float32Array(vertCount * 3);
  const zValues = new Float32Array(vertCount);
  let zMin = Infinity;
  let zMax = -Infinity;

  // Generate vertices
  for (let iy = 0; iy <= res; iy++) {
    const y = yMin + iy * yStep;
    for (let ix = 0; ix <= res; ix++) {
      const x = xMin + ix * xStep;
      const idx = iy * (res + 1) + ix;
      let z: number;
      try {
        z = compiled.evaluate({ ...params, x, y }) as number;
        if (!isFinite(z)) z = NaN;
      } catch {
        z = NaN;
      }

      vertices[idx * 3] = x;
      vertices[idx * 3 + 1] = y;
      vertices[idx * 3 + 2] = isNaN(z) ? 0 : z;
      zValues[idx] = z;

      if (!isNaN(z)) {
        if (z < zMin) zMin = z;
        if (z > zMax) zMax = z;
      }
    }
  }

  // Generate triangle indices, skip faces with NaN vertices
  const indexList: number[] = [];
  for (let iy = 0; iy < res; iy++) {
    for (let ix = 0; ix < res; ix++) {
      const a = iy * (res + 1) + ix;
      const b = a + (res + 1);
      const c = a + 1;
      const d = b + 1;

      const za = zValues[a], zb = zValues[b], zc = zValues[c], zd = zValues[d];

      // First triangle (a, b, c)
      if (!isNaN(za) && !isNaN(zb) && !isNaN(zc)) {
        indexList.push(a, b, c);
      }
      // Second triangle (b, d, c)
      if (!isNaN(zb) && !isNaN(zd) && !isNaN(zc)) {
        indexList.push(b, d, c);
      }
    }
  }

  if (zMin === Infinity) { zMin = 0; zMax = 1; }

  return {
    vertices,
    indices: new Uint32Array(indexList),
    zMin,
    zMax,
  };
}

export function evaluatePoints(
  compiled: EvalFunction,
  xRange: [number, number],
  resolution: number,
  params: Record<string, number>,
): Float32Array {
  const [xMin, xMax] = xRange;
  const step = (xMax - xMin) / (resolution - 1);
  const points = new Float32Array(resolution * 3);

  for (let i = 0; i < resolution; i++) {
    const x = xMin + i * step;
    let val: number;
    try {
      val = compiled.evaluate({ ...params, x }) as number;
      if (!isFinite(val)) val = NaN;
    } catch {
      val = NaN;
    }
    points[i * 3] = x;
    points[i * 3 + 1] = isNaN(val) ? NaN : val;
    points[i * 3 + 2] = 0;
  }

  return points;
}
