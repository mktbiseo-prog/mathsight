import { useState } from "react";
import { Info, SvgCard, VizSlider, VC } from "./shared";

const fn = (x: number) => -0.12 * (x - 3) * (x - 3) + 3.5;
const xMin = 0.5, xMax = 5.5;
const toSvg = (x: number, y: number): [number, number] => [30 + ((x - xMin) / (xMax - xMin)) * 280, 200 - y * 38];
const EXACT_AREA = 14.17;

export function IntegralArea() {
  const [nRect, setNRect] = useState(4);
  const dx = (xMax - xMin) / nRect;
  let riemannSum = 0;
  for (let i = 0; i < nRect; i++) riemannSum += fn(xMin + (i + 0.5) * dx) * dx;

  // Curve path
  const curvePath = Array.from({ length: 100 }, (_, i) => {
    const x = xMin + (i / 99) * (xMax - xMin);
    const [sx, sy] = toSvg(x, fn(x));
    return `${i === 0 ? "M" : "L"}${sx},${sy}`;
  }).join(" ");

  return (
    <div>
      <Info variant="red">
        <b>적분 = 직사각형으로 넓이를 쪼개서 합치기!</b><br />
        직사각형 수를 늘릴수록 곡선 아래 진짜 넓이에 가까워져요. 이게 구분구적법(적분)입니다.
      </Info>
      <SvgCard viewBox="0 0 340 230">
        <line x1={30} y1={200} x2={320} y2={200} stroke="#DDD" strokeWidth={1} />
        <line x1={30} y1={10} x2={30} y2={200} stroke="#DDD" strokeWidth={1} />

        {/* Rectangles */}
        {Array.from({ length: nRect }, (_, i) => {
          const x = xMin + i * dx;
          const mid = x + dx / 2;
          const y = fn(mid);
          const [sx, sy] = toSvg(x, y);
          const [sx2] = toSvg(x + dx, 0);
          const [, sBase] = toSvg(0, 0);
          return <rect key={i} x={sx} y={sy} width={sx2 - sx - 1} height={sBase - sy} fill={`${VC.red}25`} stroke={VC.red} strokeWidth={1} rx={1} />;
        })}

        {/* Curve */}
        <path d={curvePath} fill="none" stroke={VC.blue} strokeWidth={2.5} />

        {/* Info */}
        <g transform="translate(200,20)">
          <text x={0} y={0} fontSize={11} fill={VC.textS}>직사각형 {nRect}개</text>
          <text x={0} y={18} fontSize={12} fill={VC.red} fontWeight={700}>리만 합 ≈ {riemannSum.toFixed(2)}</text>
          <text x={0} y={36} fontSize={12} fill={VC.blue}>실제 넓이 ≈ {EXACT_AREA}</text>
          <text x={0} y={54} fontSize={11} fill={nRect >= 50 ? VC.green : VC.amber} fontWeight={600}>
            오차: {Math.abs(riemannSum - EXACT_AREA).toFixed(2)} {nRect >= 50 && "→ 거의 같다!"}
          </text>
        </g>

        {nRect >= 50 && (
          <g transform="translate(70,150)">
            <rect x={-5} y={-14} width={170} height={28} rx={8} fill={VC.green} />
            <text x={0} y={6} fontSize={12} fill="#fff" fontWeight={700} fontFamily="var(--font-math)">n→∞ 이면 정적분 ∫f(x)dx ✓</text>
          </g>
        )}
      </SvgCard>

      <VizSlider label={`직사각형 수: ${nRect}개`} value={nRect} min={2} max={80} color={VC.red} onChange={setNRect} />

      <div className="flex flex-wrap gap-1 mt-2">
        {[4, 10, 20, 50, 80].map((n) => (
          <button
            key={n}
            onClick={() => setNRect(n)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              nRect === n
                ? "bg-error text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {n}개
          </button>
        ))}
      </div>
    </div>
  );
}
