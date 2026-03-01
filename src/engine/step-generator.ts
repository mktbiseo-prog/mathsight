import type { ProblemType, SolveRequest } from "./sympy-bridge";

export interface ParsedProblem {
  type: ProblemType;
  expression: string;
  variable: string;
  lower?: string;
  upper?: string;
  point?: string;
  displayLatex: string;
}

function latexToSympy(input: string): string {
  let s = input.trim();
  s = s.replace(/^\$+|\$+$/g, "");
  s = s.replace(/^\\\(|\\\)$/g, "");
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  s = s.replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)");
  s = s.replace(/\\ln\b/g, "log");
  s = s.replace(/\\(sin|cos|tan|log|exp|sec|csc|cot)\b/g, "$1");
  s = s.replace(/\\pi\b/g, "pi");
  s = s.replace(/\\infty\b/g, "oo");
  s = s.replace(/\\cdot/g, "*");
  s = s.replace(/\\(left|right|,|;|!|quad)/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function parseProblemInput(
  input: string,
): ParsedProblem | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { error: "수식을 입력해주세요" };

  const normalized = latexToSympy(trimmed);

  // integrate(expr, lower, upper) or integrate(expr)
  const intMatch = normalized.match(
    /^(?:integrate|int|적분)\s*\(\s*(.+?)(?:\s*,\s*(\S+)\s*,\s*(\S+))?\s*\)$/i,
  );
  if (intMatch) {
    return {
      type: "integrate",
      expression: intMatch[1],
      variable: "x",
      lower: intMatch[2] || undefined,
      upper: intMatch[3] || undefined,
      displayLatex: intMatch[2]
        ? `\\int_{${intMatch[2]}}^{${intMatch[3]}} ${intMatch[1]} \\, dx`
        : `\\int ${intMatch[1]} \\, dx`,
    };
  }

  // diff(expr) or d/dx(expr)
  const diffMatch = normalized.match(
    /^(?:diff|d\/dx|미분)\s*\(\s*(.+?)\s*\)$/i,
  );
  if (diffMatch) {
    return {
      type: "diff",
      expression: diffMatch[1],
      variable: "x",
      displayLatex: `\\frac{d}{dx}\\left(${diffMatch[1]}\\right)`,
    };
  }

  // limit(expr, var, point)
  const limMatch = normalized.match(
    /^(?:limit|lim|극한)\s*\(\s*(.+?)\s*,\s*(\w)\s*,\s*(.+?)\s*\)$/i,
  );
  if (limMatch) {
    return {
      type: "limit",
      expression: limMatch[1],
      variable: limMatch[2],
      point: limMatch[3],
      displayLatex: `\\lim_{${limMatch[2]} \\to ${limMatch[3]}} ${limMatch[1]}`,
    };
  }

  // simplify(expr)
  const simpMatch = normalized.match(
    /^(?:simplify|간소화)\s*\(\s*(.+?)\s*\)$/i,
  );
  if (simpMatch) {
    return {
      type: "simplify",
      expression: simpMatch[1],
      variable: "x",
      displayLatex: simpMatch[1],
    };
  }

  // Contains = → solve
  if (normalized.includes("=")) {
    const parts = normalized.split("=").map((s) => s.trim());
    const expression =
      parts[1] === "0" ? parts[0] : `(${parts[0]}) - (${parts[1]})`;
    return {
      type: "solve",
      expression,
      variable: "x",
      displayLatex: `${parts[0]} = ${parts[1]}`,
    };
  }

  // Ends with dx → integrate
  if (/d[a-z]$/i.test(normalized)) {
    const expr = normalized.replace(/\s*d[a-z]$/i, "").trim();
    return {
      type: "integrate",
      expression: expr,
      variable: "x",
      displayLatex: `\\int ${expr} \\, dx`,
    };
  }

  // Default: simplify
  return {
    type: "simplify",
    expression: normalized,
    variable: "x",
    displayLatex: normalized,
  };
}

export function problemToRequest(problem: ParsedProblem): SolveRequest {
  return {
    type: problem.type,
    expression: problem.expression,
    variable: problem.variable,
    lower: problem.lower,
    upper: problem.upper,
    point: problem.point,
  };
}
