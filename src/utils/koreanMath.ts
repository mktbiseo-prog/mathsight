const EXACT_MAP: Record<string, string> = {
  "x의 4승": "x^4",
  "x의 3승": "x^3",
  "x의 2승": "x^2",
  "x4승": "x^4",
  "x3승": "x^3",
  "x제곱": "x^2",
  "루트 x": "sqrt(x)",
  "루트x": "sqrt(x)",
  "x분의 1": "(1)/(x)",
  "2분의 1": "(1)/(2)",
  "x분의 y": "(y)/(x)",
  "sinx": "sin(x)",
  "cosx": "cos(x)",
  "tanx": "tan(x)",
};

export function koreanToExpr(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  // Try exact match first
  if (EXACT_MAP[trimmed]) return EXACT_MAP[trimmed];

  let t = trimmed;

  // 적분: "0에서 파이까지 sinx 적분" → "integrate(sin(x), 0, pi)"
  const intMatch = t.match(
    /(\S+)에서\s*(\S+)까지\s*(.+?)\s*적분/,
  );
  if (intMatch) {
    const lo = normalizeTerm(intMatch[1]);
    const hi = normalizeTerm(intMatch[2]);
    const expr = normalizeTerm(intMatch[3]);
    return `integrate(${expr}, ${lo}, ${hi})`;
  }

  // 부정적분: "sinx 적분" → "integrate(sin(x))"
  const indef = t.match(/(.+?)\s*적분$/);
  if (indef) {
    return `integrate(${normalizeTerm(indef[1])})`;
  }

  // 극한: "x가 0으로 갈 때 극한 sinx/x"
  const limMatch = t.match(
    /(\w)가\s*(\S+?)(?:으로|로)\s*갈\s*때\s*극한\s*(.+)/,
  );
  if (limMatch) {
    return `limit(${normalizeTerm(limMatch[3])}, ${limMatch[1]}, ${normalizeTerm(limMatch[2])})`;
  }

  // 미분: "x^3 미분" → "diff(x^3)"
  const diffMatch = t.match(/(.+?)\s*미분$/);
  if (diffMatch) {
    return `diff(${normalizeTerm(diffMatch[1])})`;
  }

  // Pattern replacements (order matters)
  // 승: x의 4승 → x^4
  t = t.replace(/(\w)의\s*(\d+)승/g, "$1^$2");
  t = t.replace(/(\w)(\d+)승/g, "$1^$2");
  // 제곱: x제곱 → x^2
  t = t.replace(/(\w)제곱/g, "$1^2");
  // 세제곱: x세제곱 → x^3
  t = t.replace(/(\w)세제곱/g, "$1^3");
  // 루트: 루트 b^2-4ac → sqrt(b^2-4ac)
  t = t.replace(/루트\s*(.+?)(?=\s*(?:더하기|빼기|곱하기|나누기|$))/g, "sqrt($1)");
  // 분수: x분의 1 → (1)/(x), 2a분의 -b → (-b)/(2a)
  t = t.replace(/(\S+)분의\s*(\S+)/g, "($2)/($1)");

  // 연산자
  t = t.replace(/더하기/g, " + ");
  t = t.replace(/빼기/g, " - ");
  t = t.replace(/곱하기/g, " * ");
  t = t.replace(/나누기/g, " / ");
  t = t.replace(/플러스/g, " + ");
  t = t.replace(/마이너스/g, " - ");

  // Normalize terms
  t = normalizeTerm(t);

  // Clean up spaces
  t = t.replace(/\s+/g, " ").trim();

  return t;
}

function normalizeTerm(s: string): string {
  let t = s.trim();
  t = t.replace(/파이/g, "pi");
  t = t.replace(/무한대/g, "oo");
  t = t.replace(/sin\s*x/g, "sin(x)");
  t = t.replace(/cos\s*x/g, "cos(x)");
  t = t.replace(/tan\s*x/g, "tan(x)");
  t = t.replace(/sinx/g, "sin(x)");
  t = t.replace(/cosx/g, "cos(x)");
  t = t.replace(/tanx/g, "tan(x)");
  return t;
}
