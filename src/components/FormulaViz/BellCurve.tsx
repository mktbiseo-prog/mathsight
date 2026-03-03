import { useState } from "react";
import { Info, SvgCard, VizSlider, StepNav, VC } from "./shared";

const PI = Math.PI;

function normalPDF(x: number, mu: number, sigma: number): number {
  const coeff = 1 / (sigma * Math.sqrt(2 * PI));
  return coeff * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

function erfApprox(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const val = 1 - poly * Math.exp(-x * x);
  return x >= 0 ? val : -val;
}

function cdf(z: number): number {
  return 0.5 * (1 + erfApprox(z / Math.sqrt(2)));
}

export function BellCurve() {
  const [step, setStep] = useState(0);
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [zLow, setZLow] = useState(-1);
  const [zHigh, setZHigh] = useState(1);

  const w = 460, h = 260;
  const ox = 230, oy = 210;
  const scX = 50, scY = 400;

  function bellPath(mu: number, sigma: number, color: string, range = 4) {
    const pts: string[] = [];
    for (let i = 0; i <= 300; i++) {
      const x = mu - range + (2 * range * i) / 300;
      const y = normalPDF(x, mu, sigma);
      const sx = ox + x * scX;
      const sy = oy - y * scY;
      pts.push(`${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
    }
    return <path d={pts.join(" ")} fill="none" stroke={color} strokeWidth={2.5} />;
  }

  function shadedArea(lo: number, hi: number, mu: number, sigma: number) {
    const pts: string[] = [];
    const steps = 200;
    pts.push(`M${(ox + lo * scX).toFixed(1)},${oy}`);
    for (let i = 0; i <= steps; i++) {
      const x = lo + (hi - lo) * (i / steps);
      const y = normalPDF(x, mu, sigma);
      pts.push(`L${(ox + x * scX).toFixed(1)},${(oy - y * scY).toFixed(1)}`);
    }
    pts.push(`L${(ox + hi * scX).toFixed(1)},${oy}`);
    pts.push("Z");
    return <path d={pts.join(" ")} fill={VC.green} opacity={0.35} />;
  }

  return (
    <div>
      <Info variant="blue">
        <b>정규분포 벨커브!</b> 평균(μ)과 표준편차(σ)를 조절해 종 모양의 변화를 관찰하세요.
      </Info>

      {step === 0 && (
        <>
          <SvgCard viewBox={`0 0 ${w} ${h}`}>
            <line x1={20} y1={oy} x2={w - 20} y2={oy} stroke="#ddd" strokeWidth={0.5} />
            {bellPath(mu, sigma, VC.blue)}
            {/* Mean line */}
            <line x1={ox + mu * scX} y1={oy} x2={ox + mu * scX} y2={oy - normalPDF(mu, mu, sigma) * scY - 10}
              stroke={VC.red} strokeWidth={1.5} strokeDasharray="4,3" />
            {/* σ markers */}
            <line x1={ox + (mu - sigma) * scX} y1={oy} x2={ox + (mu - sigma) * scX} y2={oy - 8}
              stroke={VC.amber} strokeWidth={2} />
            <line x1={ox + (mu + sigma) * scX} y1={oy} x2={ox + (mu + sigma) * scX} y2={oy - 8}
              stroke={VC.amber} strokeWidth={2} />
            <text x={ox + mu * scX} y={20} textAnchor="middle" fontSize={12} fill={VC.red} fontWeight={700}>
              μ = {mu.toFixed(1)}
            </text>
            <text x={ox + (mu + sigma) * scX} y={oy + 18} textAnchor="middle" fontSize={10} fill={VC.amber} fontWeight={600}>
              μ+σ
            </text>
            <text x={ox + (mu - sigma) * scX} y={oy + 18} textAnchor="middle" fontSize={10} fill={VC.amber} fontWeight={600}>
              μ-σ
            </text>
          </SvgCard>
          <VizSlider label={`평균 μ = ${mu.toFixed(1)}`} value={mu} min={-2} max={2} step={0.1} color={VC.red} onChange={setMu} />
          <VizSlider label={`표준편차 σ = ${sigma.toFixed(1)}`} value={sigma} min={0.3} max={2.5} step={0.1} color={VC.amber} onChange={setSigma} />
        </>
      )}

      {step === 1 && (() => {
        const lo = Math.min(zLow, zHigh);
        const hi = Math.max(zLow, zHigh);
        const prob = cdf(hi) - cdf(lo);

        return (
          <>
            <Info variant="green">
              <b>넓이 = 확률!</b> z₁과 z₂ 사이의 음영 넓이가 곧 P(z₁ ≤ Z ≤ z₂)입니다.
            </Info>
            <SvgCard viewBox={`0 0 ${w} ${h}`}>
              <line x1={20} y1={oy} x2={w - 20} y2={oy} stroke="#ddd" strokeWidth={0.5} />
              {shadedArea(lo, hi, 0, 1)}
              {bellPath(0, 1, VC.blue)}
              {/* Boundaries */}
              <line x1={ox + lo * scX} y1={oy} x2={ox + lo * scX} y2={oy - normalPDF(lo, 0, 1) * scY}
                stroke={VC.red} strokeWidth={1.5} />
              <line x1={ox + hi * scX} y1={oy} x2={ox + hi * scX} y2={oy - normalPDF(hi, 0, 1) * scY}
                stroke={VC.red} strokeWidth={1.5} />
              <text x={ox} y={24} textAnchor="middle" fontSize={13} fill={VC.green} fontWeight={700}>
                P = {(prob * 100).toFixed(1)}%
              </text>
              <text x={ox + lo * scX} y={oy + 16} textAnchor="middle" fontSize={10} fill={VC.red} fontWeight={600}>
                z₁={lo.toFixed(1)}
              </text>
              <text x={ox + hi * scX} y={oy + 16} textAnchor="middle" fontSize={10} fill={VC.red} fontWeight={600}>
                z₂={hi.toFixed(1)}
              </text>
            </SvgCard>
            <VizSlider label={`z₁ = ${zLow.toFixed(1)}`} value={zLow} min={-3} max={3} step={0.1} color={VC.red} onChange={setZLow} />
            <VizSlider label={`z₂ = ${zHigh.toFixed(1)}`} value={zHigh} min={-3} max={3} step={0.1} color={VC.blue} onChange={setZHigh} />
          </>
        );
      })()}

      <StepNav step={step} setStep={setStep} max={1} />

      <Info variant="purple">
        <b>68-95-99.7 법칙:</b> ±1σ에 68%, ±2σ에 95%, ±3σ에 99.7%의 데이터가 포함됩니다. 시험 점수, 키, 몸무게 — 세상의 많은 데이터가 정규분포!
      </Info>
    </div>
  );
}
