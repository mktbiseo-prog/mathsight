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
