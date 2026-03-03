import { useState } from "react";
import { Info, SvgCard, VizSlider, StepNav, VC } from "./shared";

export function SequenceBlocks() {
  const [step, setStep] = useState(0);
  const [n, setN] = useState(5);
  const [d, setD] = useState(1);
  const [r, setR] = useState(0.6);

  return (
    <div>
      <Info variant="orange">
        <b>수열을 블록으로!</b> 등차수열은 일정하게 증가, 등비수열은 비율로 변합니다. n을 바꿔 패턴을 확인하세요.
      </Info>

      {step === 0 && (() => {
        // Arithmetic sequence: a_k = 1 + (k-1)*d
        const barW = 36, gap = 6;
        const totalW = n * (barW + gap);
        const viewW = Math.max(totalW + 40, 300);
        const maxH = 1 + (n - 1) * Math.abs(d);
        const sc = Math.min(140 / maxH, 30);
        const baseY = 190;

        return (
          <>
            <SvgCard viewBox={`0 0 ${viewW} 220`}>
              <line x1={10} y1={baseY} x2={viewW - 10} y2={baseY} stroke="#ddd" strokeWidth={0.5} />
              {Array.from({ length: n }, (_, i) => {
                const val = 1 + i * d;
                const h = Math.abs(val) * sc;
                const x = 20 + i * (barW + gap);
                return (
                  <g key={i}>
                    <rect x={x} y={baseY - h} width={barW} height={h} rx={3} fill={VC.blue} opacity={0.7} />
                    <text x={x + barW / 2} y={baseY - h - 6} textAnchor="middle" fontSize={11} fill={VC.blue} fontWeight={700}>
                      {val.toFixed(1)}
                    </text>
                    <text x={x + barW / 2} y={baseY + 14} textAnchor="middle" fontSize={9} fill={VC.textS}>
                      a_{i + 1}
                    </text>
                    {i > 0 && (
                      <text x={x - gap / 2} y={baseY - h / 2} textAnchor="middle" fontSize={9} fill={VC.amber} fontWeight={600}>
                        +{d}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Sum */}
              <text x={viewW / 2} y={24} textAnchor="middle" fontSize={13} fill={VC.green} fontWeight={700}>
                S_{n} = n(2a₁+(n-1)d)/2 = {(n * (2 + (n - 1) * d) / 2).toFixed(1)}
              </text>
            </SvgCard>
            <VizSlider label={`항의 수 n = ${n}`} value={n} min={2} max={10} step={1} color={VC.blue} onChange={setN} />
            <VizSlider label={`공차 d = ${d}`} value={d} min={-2} max={3} step={0.5} color={VC.amber} onChange={setD} />
          </>
        );
      })()}

      {step === 1 && (() => {
        // Geometric series partial sums converging
        const maxTerms = 15;
        const sums: number[] = [];
        let partial = 0;
        for (let k = 0; k < maxTerms; k++) {
          partial += Math.pow(r, k);
          sums.push(partial);
        }
        const S = Math.abs(r) < 1 ? 1 / (1 - r) : NaN;
        const viewW = 460, viewH = 240;
        const ox = 40, oy = 200;
        const maxY = Math.abs(r) < 1 ? S * 1.3 : Math.max(...sums.slice(0, 10)) * 1.1;
        const scX = (viewW - 80) / maxTerms;
        const scY = (oy - 30) / maxY;

        return (
          <>
            <Info variant="blue">
              <b>등비급수 수렴:</b> |r| &lt; 1이면 S = 1/(1-r)에 수렴. 부분합이 극한에 가까워지는 모습을 확인하세요.
            </Info>
            <SvgCard viewBox={`0 0 ${viewW} ${viewH}`}>
              <line x1={ox} y1={oy} x2={viewW - 20} y2={oy} stroke="#ddd" strokeWidth={0.5} />
              <line x1={ox} y1={20} x2={ox} y2={oy} stroke="#ddd" strokeWidth={0.5} />

              {/* Convergence line */}
              {isFinite(S) && S > 0 && (
                <>
                  <line x1={ox} y1={oy - S * scY} x2={viewW - 20} y2={oy - S * scY}
                    stroke={VC.green} strokeWidth={1.5} strokeDasharray="6,3" />
                  <text x={viewW - 16} y={oy - S * scY - 4} textAnchor="end" fontSize={11} fill={VC.green} fontWeight={700}>
                    S = {S.toFixed(3)}
                  </text>
                </>
              )}

              {/* Partial sum points */}
              {sums.map((s, k) => {
                if (!isFinite(s) || Math.abs(s) > 100) return null;
                const x = ox + (k + 1) * scX;
                const y = oy - s * scY;
                return (
                  <g key={k}>
                    {k > 0 && (
                      <line
                        x1={ox + k * scX} y1={oy - sums[k - 1] * scY}
                        x2={x} y2={y}
                        stroke={VC.blue} strokeWidth={1.5} opacity={0.5}
                      />
                    )}
                    <circle cx={x} cy={y} r={4} fill={VC.blue} />
                  </g>
                );
              })}

              <text x={viewW / 2} y={16} textAnchor="middle" fontSize={12} fill={VC.blue} fontWeight={700}>
                r = {r.toFixed(2)}{Math.abs(r) < 1 ? ` → S = ${S.toFixed(3)}` : " (발산)"}
              </text>
            </SvgCard>
            <VizSlider label={`공비 r = ${r.toFixed(2)}`} value={r} min={-0.95} max={1.5} step={0.05} color={VC.blue} onChange={setR} />
          </>
        );
      })()}

      <StepNav step={step} setStep={setStep} max={1} />

      <Info variant="green">
        <b>핵심:</b> 등차수열 합은 가우스가 10살에 풀었던 문제! 등비급수는 |r|&lt;1이면 무한히 더해도 유한한 값에 수렴합니다.
      </Info>
    </div>
  );
}
