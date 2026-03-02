import { useState } from "react";
import { Info, SvgCard, VizSlider, VC } from "./shared";

const fn = (x: number) => 0.15 * x * x * x - 0.8 * x * x + 1.5 * x + 1;
const fp = (x: number) => 0.45 * x * x - 1.6 * x + 1.5;
const toSvg = (x: number, y: number): [number, number] => [30 + x * 45, 210 - y * 32];

export function DerivativeTangent() {
  const [h, setH] = useState(2.0);
  const [xp, setXp] = useState(2);
  const y1 = fn(xp), y2 = fn(xp + h);
  const slope = h > 0.05 ? (y2 - y1) / h : fp(xp);
  const isTangent = h < 0.15;

  // Extended secant/tangent line
  const [sx1, sy1] = toSvg(xp, y1);
  const [sx2, sy2] = toSvg(xp + h, y2);
  const ext = 2;
  const lx1 = sx1 - ext * (sx2 - sx1), ly1 = sy1 - ext * (sy2 - sy1);
  const lx2 = sx2 + ext * (sx2 - sx1), ly2 = sy2 + ext * (sy2 - sy1);

  // Curve path
  const curvePath = Array.from({ length: 60 }, (_, i) => {
    const x = i * 0.1;
    const [sx, sy] = toSvg(x, fn(x));
    return `${i === 0 ? "M" : "L"}${sx},${sy}`;
  }).join(" ");

  return (
    <div>
      <Info variant="blue">
        <b>미분 = 두 점을 가까이 가져가면 접선이 된다!</b><br />
        h(두 점 사이 거리)를 0에 가깝게 줄여보세요. 할선 → 접선!
      </Info>
      <SvgCard viewBox="0 0 340 240">
        {/* Axes */}
        <line x1={30} y1={210} x2={320} y2={210} stroke="#DDD" strokeWidth={1} />
        <line x1={30} y1={10} x2={30} y2={210} stroke="#DDD" strokeWidth={1} />

        {/* Curve */}
        <path d={curvePath} fill="none" stroke={VC.blue} strokeWidth={2.5} />

        {/* Secant/Tangent line */}
        <line
          x1={Math.max(0, lx1)} y1={ly1}
          x2={Math.min(340, lx2)} y2={ly2}
          stroke={isTangent ? VC.green : VC.red} strokeWidth={2}
        />

        {/* Point 1 */}
        {(() => { const [sx, sy] = toSvg(xp, y1); return <circle cx={sx} cy={sy} r={5} fill={VC.blue} stroke="#fff" strokeWidth={2} />; })()}
        {/* Point 2 */}
        {h > 0.05 && (() => { const [sx, sy] = toSvg(xp + h, y2); return <circle cx={sx} cy={sy} r={5} fill={VC.red} stroke="#fff" strokeWidth={2} />; })()}

        {/* Info labels */}
        <g transform="translate(200,20)">
          <text x={0} y={0} fontSize={11} fill={VC.textS}>h = {h.toFixed(2)}</text>
          <text x={0} y={18} fontSize={12} fill={isTangent ? VC.green : VC.red} fontWeight={700}>
            {isTangent ? "접선 (tangent)" : "할선 (secant)"}
          </text>
          <text x={0} y={38} fontSize={12} fill={VC.text}>기울기 = {slope.toFixed(3)}</text>
          {isTangent && <text x={0} y={56} fontSize={12} fill={VC.green} fontWeight={700}>= f'({xp}) ≈ {fp(xp).toFixed(3)} ✓</text>}
        </g>

        {/* Formula */}
        <g transform="translate(190,180)">
          <text x={0} y={0} fontSize={11} fill={VC.text} fontFamily="var(--font-math)">기울기 = (f(x+h) − f(x)) / h</text>
          {isTangent && <text x={0} y={18} fontSize={12} fill={VC.green} fontWeight={700} fontFamily="var(--font-math)">h→0 이면 → f'(x) 미분!</text>}
        </g>
      </SvgCard>

      <VizSlider label={`h (두 점 사이 거리) = ${h.toFixed(2)} ${isTangent ? "→ 접선!" : ""}`} value={h} min={0.01} max={3} step={0.01} color={isTangent ? VC.green : VC.red} onChange={setH} />
      <VizSlider label={`점의 위치 x = ${xp}`} value={xp} min={0.5} max={4.5} step={0.1} color={VC.blue} onChange={setXp} />
    </div>
  );
}
