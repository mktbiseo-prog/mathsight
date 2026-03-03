import { useState } from "react";
import { Info, SvgCard, VizSlider, VC } from "./shared";

function nCr(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export function PascalTriangle() {
  const [rows, setRows] = useState(7);
  const [hlRow, setHlRow] = useState(4);

  const w = 460, h = 340;
  const cx = w / 2;
  const dy = 32, dx = 32;
  const startY = 26;

  return (
    <div>
      <Info variant="teal">
        <b>파스칼의 삼각형!</b> 각 숫자는 바로 위 두 숫자의 합. n행의 숫자들은 C(n,0), C(n,1), ..., C(n,n)입니다.
      </Info>

      <SvgCard viewBox={`0 0 ${w} ${h}`}>
        {Array.from({ length: rows }, (_, n) => {
          const y = startY + n * dy;
          const startX = cx - (n * dx) / 2;
          const isHighlighted = n === hlRow;

          return Array.from({ length: n + 1 }, (_, r) => {
            const x = startX + r * dx;
            const val = nCr(n, r);
            const bg = isHighlighted ? VC.green : VC.blue;

            return (
              <g key={`${n}-${r}`}>
                <circle cx={x} cy={y} r={13} fill={bg} opacity={isHighlighted ? 0.9 : 0.15} />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize={val < 100 ? 11 : 9}
                  fill={isHighlighted ? "#fff" : VC.blue}
                  fontWeight={700}
                >
                  {val}
                </text>
                {/* Connection lines */}
                {n > 0 && r > 0 && (
                  <line
                    x1={cx - ((n - 1) * dx) / 2 + (r - 1) * dx}
                    y1={y - dy + 13}
                    x2={x}
                    y2={y - 13}
                    stroke={isHighlighted ? VC.green : "#ddd"}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    opacity={0.5}
                  />
                )}
                {n > 0 && r < n && (
                  <line
                    x1={cx - ((n - 1) * dx) / 2 + r * dx}
                    y1={y - dy + 13}
                    x2={x}
                    y2={y - 13}
                    stroke={isHighlighted ? VC.green : "#ddd"}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    opacity={0.5}
                  />
                )}
              </g>
            );
          });
        })}

        {/* Row sum label */}
        <text x={w - 16} y={startY + hlRow * dy + 4} textAnchor="end" fontSize={11} fill={VC.green} fontWeight={700}>
          합 = {Math.pow(2, hlRow)}
        </text>
        <text x={16} y={startY + hlRow * dy + 4} fontSize={10} fill={VC.green} fontWeight={600}>
          n={hlRow}
        </text>
      </SvgCard>

      <VizSlider label={`행 수 = ${rows}`} value={rows} min={3} max={10} step={1} color={VC.blue} onChange={setRows} />
      <VizSlider
        label={`강조 행 n = ${hlRow}`}
        value={hlRow}
        min={0}
        max={Math.max(rows - 1, 0)}
        step={1}
        color={VC.green}
        onChange={setHlRow}
      />

      <Info variant="green">
        <b>숨겨진 패턴:</b> 각 행의 합 = 2^n (이항정리!), 대각선 합 = 피보나치 수열. 파스칼 삼각형에는 수학의 보물이 가득!
      </Info>
    </div>
  );
}
