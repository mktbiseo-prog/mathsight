import { compile } from "mathjs";

/**
 * Preprocess a SymPy-compatible expression string for math.js consumption.
 */
function preprocessSymPy(expr: string): string {
  let s = expr;
  s = s.replace(/\*\*/g, "^");
  s = s.replace(/\bAbs\b/g, "abs");
  // SymPy uses capital E for Euler's number in some contexts
  s = s.replace(/\bE\b(?!\w)/g, "e");
  // SymPy infinity
  s = s.replace(/\boo\b/g, "Infinity");
  return s;
}

/**
 * Convert a SymPy expression string to a callable JS function.
 * Returns null if parsing fails.
 */
export function exprToFn(
  sympyExpr: string,
  variable = "x",
): ((x: number) => number) | null {
  try {
    const processed = preprocessSymPy(sympyExpr);
    const compiled = compile(processed);
    // Smoke test
    compiled.evaluate({ [variable]: 1 });
    return (x: number) => {
      try {
        const result = compiled.evaluate({ [variable]: x }) as number;
        return typeof result === "number" && isFinite(result) ? result : NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return null;
  }
}

/**
 * Parse a SymPy result string to a number.
 * Handles integers, decimals, fractions, pi, sqrt, etc.
 */
export function parseNumericResult(resultStr: string): number | null {
  try {
    const processed = preprocessSymPy(resultStr);
    const compiled = compile(processed);
    const val = compiled.evaluate({}) as number;
    return typeof val === "number" && isFinite(val) ? val : null;
  } catch {
    return null;
  }
}
