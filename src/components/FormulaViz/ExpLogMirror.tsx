import { useState } from "react";
import { Info, SvgCard, VizSlider, VC } from "./shared";

export function ExpLogMirror() {
  const [base, setBase] = useState(2);

  const w = 460, h = 300;
  const ox = 160, oy = 200; // origin
  const sc = 30; // scale

  // y = base^x
  const expPts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = -4 + (i / 200) * 8;
    const y = Math.pow(base, x);
    if (y > 10) break;
    const sx = ox + x * sc;
    const sy = oy - y * sc;
    expPts.push(`${expPts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  // y = log_base(x)
  const logPts: string[] = [];
  for (let i = 1; i <= 200; i++) {
    const x = 0.05 + (i / 200) * 10;
    const y = Math.log(x) / Math.log(base);
    if (Math.abs(y) > 8) continue;
    const sx = ox + x * sc;
    const sy = oy - y * sc;
    logPts.push(`${logPts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  return (
    <div>
      <Info variant="purple">
        <b>역함수는 y = x에 대칭!</b> 지수함수 y = a^x와 로그함수 y = log_a(x)는 서로 역함수. 밑 a를 바꿔보세요.
      </Info>
      <SvgCard viewBox={`0 0 ${w} ${h}`}>
        {/* Grid */}
        <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="#ddd" strokeWidth={0.5} />
        <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="#ddd" strokeWidth={0.5} />

        {/* y = x diagonal */}
        <line x1={ox - 6 * sc} y1={oy + 6 * sc} x2={ox + 6 * sc} y2={oy - 6 * sc}
          stroke={VC.amber} strokeWidth={1.5} strokeDasharray="6,4" />

        {/* Exp curve */}
        <path d={expPts.join(" ")} fill="none" stroke={VC.blue} strokeWidth={2.5} />
        {/* Log curve */}
        <path d={logPts.join(" ")} fill="none" stroke={VC.purple} strokeWidth={2.5} />

        {/* Key points */}
        <circle cx={ox} cy={oy - sc} r={5} fill={VC.green} />
        <text x={ox - 24} y={oy - sc - 6} fontSize={10} fill={VC.green} fontWeight={700}>(0, 1)</text>
        <circle cx={ox + sc} cy={oy} r={5} fill={VC.green} />
        <text x={ox + sc + 4} y={oy + 14} fontSize={10} fill={VC.green} fontWeight={700}>(1, 0)</text>

        {/* Labels */}
        <text x={ox + 3.5 * sc} y={oy - 4.5 * sc} fontSize={12} fill={VC.blue} fontWeight={700}>y = {base.toFixed(1)}^x</text>
        <text x={ox + 5 * sc} y={oy - 1.5 * sc} fontSize={12} fill={VC.purple} fontWeight={700}>y = log_{base.toFixed(1)}(x)</text>
        <text x={ox + 4 * sc} y={oy - 4 * sc + 12} fontSize={10} fill={VC.amber} fontWeight={600}>y = x</text>

        {/* Axis labels */}
        <text x={w - 18} y={oy + 16} fontSize={10} fill={VC.textS}>x</text>
        <text x={ox + 6} y={18} fontSize={10} fill={VC.textS}>y</text>
      </SvgCard>

      <VizSlider label={`밑 a = ${base.toFixed(1)}`} value={base} min={1.1} max={5} step={0.1} color={VC.purple} onChange={setBase} />

      <Info variant="green">
        <b>핵심:</b> 지수함수가 "곱하기 반복"이라면, 로그는 "몇 번 곱했나?"를 묻는 함수. 두 함수는 y = x 대칭 관계!
      </Info>
    </div>
  );
}
