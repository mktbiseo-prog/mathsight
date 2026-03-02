// === Core function: f(x) = -0.08x³ + 0.6x² - 0.5x + 1 ===
export function f(x: number): number {
  return -0.08 * x * x * x + 0.6 * x * x - 0.5 * x + 1;
}

export function fPrime(x: number): number {
  return -0.24 * x * x + 1.2 * x - 0.5;
}

export function fDoublePrime(x: number): number {
  return -0.48 * x + 1.2;
}

// Critical points where f'(x) = 0
const disc = 1.2 * 1.2 - 4 * (-0.24) * (-0.5);
const cp1 = (-1.2 + Math.sqrt(disc)) / (2 * -0.24);
const cp2 = (-1.2 - Math.sqrt(disc)) / (2 * -0.24);
export const criticalPoints = [cp1, cp2].sort((a, b) => a - b);

// Numerical integration (trapezoidal rule)
export function integrate(a: number, b: number, n = 200): number {
  const h = (b - a) / n;
  let sum = 0.5 * (f(a) + f(b));
  for (let i = 1; i < n; i++) sum += f(a + i * h);
  return sum * h;
}

// SVG coordinate system
export const W = 600, H = 300;
export const PAD = { l: 50, r: 20, t: 20, b: 40 };
export const GW = W - PAD.l - PAD.r;
export const GH = H - PAD.t - PAD.b;
export const X_MIN = -1, X_MAX = 8, Y_MIN = -2, Y_MAX = 6;

export function toSvgX(x: number): number {
  return PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * GW;
}

export function toSvgY(y: number): number {
  return PAD.t + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * GH;
}

export function fromSvgX(sx: number): number {
  return X_MIN + ((sx - PAD.l) / GW) * (X_MAX - X_MIN);
}
