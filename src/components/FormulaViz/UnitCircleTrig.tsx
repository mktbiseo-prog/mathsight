import { useState } from "react";
import { Info, SvgCard, VizSlider, VC } from "./shared";

export function UnitCircleTrig() {
  const [angle, setAngle] = useState(45);
  const rad = (angle * Math.PI) / 180;
  const r = 90, cx = 130, cy = 130;
  const px = cx + r * Math.cos(rad), py = cy - r * Math.sin(rad);
  const sinV = Math.sin(rad), cosV = Math.cos(rad);
  const tanV = Math.abs(cosV) > 0.01 ? sinV / cosV : Infinity;

  return (
    <div>
      <Info variant="amber">
        <b>단위원 위의 점을 돌려보세요!</b> x좌표 = cos θ, y좌표 = sin θ. 삼각함수는 원 위의 좌표입니다.
      </Info>
      <SvgCard viewBox="0 0 340 270">
        {/* Grid */}
        <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#DDD" strokeWidth={1} />
        <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#DDD" strokeWidth={1} />

        {/* Circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={VC.text} strokeWidth={1.5} />

        {/* Angle arc */}
        {angle > 0 && (
          <path
            d={`M${cx + 20},${cy} A20,20 0 ${angle > 180 ? 1 : 0} 0 ${cx + 20 * Math.cos(rad)},${cy - 20 * Math.sin(rad)}`}
            fill="none" stroke={VC.amber} strokeWidth={2}
          />
        )}

        {/* Radius line */}
        <line x1={cx} y1={cy} x2={px} y2={py} stroke={VC.text} strokeWidth={2} />

        {/* cos projection (x) — solid blue */}
        <line x1={px} y1={py} x2={px} y2={cy} stroke={VC.red} strokeWidth={2.5} strokeDasharray="4,2" />
        <line x1={cx} y1={cy} x2={px} y2={cy} stroke={VC.blue} strokeWidth={3} />

        {/* sin projection (y) — solid red */}
        <line x1={cx} y1={cy} x2={cx} y2={py} stroke={VC.red} strokeWidth={3} />
        <line x1={cx} y1={py} x2={px} y2={py} stroke={VC.blue} strokeWidth={2.5} strokeDasharray="4,2" />

        {/* Point */}
        <circle cx={px} cy={py} r={6} fill={VC.green} stroke="#fff" strokeWidth={2} />

        {/* Labels */}
        <text x={(cx + px) / 2} y={cy + 16} textAnchor="middle" fontSize={12} fill={VC.blue} fontWeight={700}>cos θ = {cosV.toFixed(2)}</text>
        <text x={cx - 14} y={(cy + py) / 2 + 4} textAnchor="end" fontSize={12} fill={VC.red} fontWeight={700}>sin θ = {sinV.toFixed(2)}</text>
        <text x={cx + 26} y={cy - 6} fontSize={11} fill={VC.amber} fontWeight={700}>θ = {angle}°</text>

        {/* Right side: values */}
        <g transform="translate(245,30)">
          <text x={0} y={0} fontSize={11} fill={VC.textS} fontWeight={600}>θ = {angle}°</text>
          <rect x={-4} y={10} width={90} height={26} rx={6} fill={VC.blue} />
          <text x={0} y={28} fontSize={12} fill="#fff" fontWeight={700}>cos = {cosV.toFixed(3)}</text>
          <rect x={-4} y={44} width={90} height={26} rx={6} fill={VC.red} />
          <text x={0} y={62} fontSize={12} fill="#fff" fontWeight={700}>sin = {sinV.toFixed(3)}</text>
          <rect x={-4} y={78} width={90} height={26} rx={6} fill={VC.purple} />
          <text x={0} y={96} fontSize={12} fill="#fff" fontWeight={700}>tan = {Number.isFinite(tanV) ? tanV.toFixed(3) : "∞"}</text>
          <text x={0} y={125} fontSize={11} fill={VC.green} fontWeight={700}>sin² + cos² = {(sinV ** 2 + cosV ** 2).toFixed(3)}</text>
          <text x={0} y={142} fontSize={10} fill={VC.textS}>항상 1! (피타고라스)</text>
        </g>

        {/* Axis labels */}
        <text x={cx + r + 8} y={cy + 4} fontSize={10} fill={VC.textS}>1</text>
        <text x={cx - r - 14} y={cy + 4} fontSize={10} fill={VC.textS}>-1</text>
        <text x={cx + 4} y={cy - r - 6} fontSize={10} fill={VC.textS}>1</text>
        <text x={cx + 4} y={cy + r + 14} fontSize={10} fill={VC.textS}>-1</text>
      </SvgCard>

      <VizSlider label={`각도 θ = ${angle}°`} value={angle} min={0} max={360} step={1} color={VC.amber} onChange={setAngle} />

      <Info variant="green">
        <b>핵심 연결:</b> sin²θ + cos²θ = 1 은 피타고라스 정리와 같은 말이에요! 반지름=1인 원에서 x² + y² = 1 이니까요.
      </Info>
    </div>
  );
}
