import { useState } from "react";
import { Info, StepNav, SvgCard, VizSlider, VC } from "./shared";

const DESCS = [
  "한 변이 (a+b)인 정사각형을 그려볼게요.",
  "한 변을 a와 b로 나눠서 세로선을 긋습니다.",
  "가로에도 같은 위치에 선을 그으면 4개의 영역이 생겨요!",
  "각 영역의 넓이를 확인! 이게 바로 공식의 정체입니다.",
];

export function SquareExpansion() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const sc = 200 / (a + b), aS = a * sc, bS = b * sc;
  const ox = 30, oy = 25;

  return (
    <div>
      <Info variant="blue"><b>STEP {step + 1}/4:</b> {DESCS[step]}</Info>
      <SvgCard viewBox="0 0 340 270">
        {step === 0 && <>
          <rect x={ox} y={oy} width={aS + bS} height={aS + bS} fill={`${VC.amber}20`} stroke={VC.text} strokeWidth={2} rx={2} />
          <text x={ox + (aS + bS) / 2} y={oy + (aS + bS) / 2 + 6} textAnchor="middle" fontSize={22} fontWeight={700} fill={VC.amber} fontFamily="var(--font-math)">(a+b)²</text>
          <text x={ox + (aS + bS) / 2} y={oy + aS + bS + 18} textAnchor="middle" fontSize={12} fill={VC.text} fontWeight={600}>&larr; a+b = {a + b} &rarr;</text>
        </>}

        {step === 1 && <>
          <rect x={ox} y={oy} width={aS} height={aS + bS} fill={`${VC.blue}15`} stroke={VC.text} strokeWidth={1} />
          <rect x={ox + aS} y={oy} width={bS} height={aS + bS} fill={`${VC.red}12`} stroke={VC.text} strokeWidth={1} />
          <line x1={ox + aS} y1={oy} x2={ox + aS} y2={oy + aS + bS} stroke={VC.purple} strokeWidth={2.5} strokeDasharray="6,3" />
          <text x={ox + aS / 2} y={oy + aS + bS + 18} textAnchor="middle" fontSize={13} fill={VC.blue} fontWeight={700}>a={a}</text>
          <text x={ox + aS + bS / 2} y={oy + aS + bS + 18} textAnchor="middle" fontSize={13} fill={VC.red} fontWeight={700}>b={b}</text>
        </>}

        {step >= 2 && <>
          <rect x={ox} y={oy} width={aS} height={aS} fill={step === 3 ? `${VC.blue}30` : `${VC.blue}15`} stroke={step === 3 ? VC.blue : VC.text} strokeWidth={step === 3 ? 2 : 1} />
          <rect x={ox + aS} y={oy} width={bS} height={aS} fill={step === 3 ? `${VC.purple}25` : `${VC.purple}12`} stroke={step === 3 ? VC.purple : VC.text} strokeWidth={step === 3 ? 2 : 1} />
          <rect x={ox} y={oy + aS} width={aS} height={bS} fill={step === 3 ? `${VC.purple}25` : `${VC.purple}12`} stroke={step === 3 ? VC.purple : VC.text} strokeWidth={step === 3 ? 2 : 1} />
          <rect x={ox + aS} y={oy + aS} width={bS} height={bS} fill={step === 3 ? `${VC.red}30` : `${VC.red}12`} stroke={step === 3 ? VC.red : VC.text} strokeWidth={step === 3 ? 2 : 1} />

          {step === 2 && <>
            <text x={ox + aS / 2} y={oy + aS / 2 + 5} textAnchor="middle" fontSize={18} fontWeight={700} fill={VC.blue}>?</text>
            <text x={ox + aS + bS / 2} y={oy + aS / 2 + 5} textAnchor="middle" fontSize={16} fontWeight={700} fill={VC.purple}>?</text>
            <text x={ox + aS / 2} y={oy + aS + bS / 2 + 5} textAnchor="middle" fontSize={16} fontWeight={700} fill={VC.purple}>?</text>
            <text x={ox + aS + bS / 2} y={oy + aS + bS / 2 + 5} textAnchor="middle" fontSize={18} fontWeight={700} fill={VC.red}>?</text>
          </>}

          {step === 3 && <>
            <text x={ox + aS / 2} y={oy + aS / 2} textAnchor="middle" fontSize={17} fontWeight={800} fill={VC.blue} fontFamily="var(--font-math)">a²</text>
            <text x={ox + aS / 2} y={oy + aS / 2 + 16} textAnchor="middle" fontSize={11} fill={VC.blue}>={a * a}</text>
            <text x={ox + aS + bS / 2} y={oy + aS / 2} textAnchor="middle" fontSize={14} fontWeight={800} fill={VC.purple} fontFamily="var(--font-math)">ab</text>
            <text x={ox + aS + bS / 2} y={oy + aS / 2 + 16} textAnchor="middle" fontSize={11} fill={VC.purple}>={a * b}</text>
            <text x={ox + aS / 2} y={oy + aS + bS / 2} textAnchor="middle" fontSize={14} fontWeight={800} fill={VC.purple} fontFamily="var(--font-math)">ab</text>
            <text x={ox + aS / 2} y={oy + aS + bS / 2 + 16} textAnchor="middle" fontSize={11} fill={VC.purple}>={a * b}</text>
            <text x={ox + aS + bS / 2} y={oy + aS + bS / 2} textAnchor="middle" fontSize={17} fontWeight={800} fill={VC.red} fontFamily="var(--font-math)">b²</text>
            <text x={ox + aS + bS / 2} y={oy + aS + bS / 2 + 16} textAnchor="middle" fontSize={11} fill={VC.red}>={b * b}</text>
          </>}

          <text x={ox + aS / 2} y={oy + aS + bS + 18} textAnchor="middle" fontSize={12} fill={VC.blue} fontWeight={700}>a={a}</text>
          <text x={ox + aS + bS / 2} y={oy + aS + bS + 18} textAnchor="middle" fontSize={12} fill={VC.red} fontWeight={700}>b={b}</text>
        </>}

        {step === 3 && (
          <g transform="translate(255,40)">
            <text x={0} y={0} fontSize={13} fill={VC.amber} fontWeight={700} fontFamily="var(--font-math)">(a+b)²</text>
            <text x={0} y={22} fontSize={12} fill={VC.text} fontFamily="var(--font-math)">
              = <tspan fill={VC.blue} fontWeight={700}>a²</tspan> + <tspan fill={VC.purple} fontWeight={700}>2ab</tspan> + <tspan fill={VC.red} fontWeight={700}>b²</tspan>
            </text>
            <text x={0} y={44} fontSize={12} fill={VC.text}>= {a * a} + {2 * a * b} + {b * b}</text>
            <text x={0} y={66} fontSize={14} fill={VC.green} fontWeight={800}>= {(a + b) ** 2} ✓</text>
          </g>
        )}
      </SvgCard>

      {step === 3 && (
        <div className="flex gap-3 mt-2">
          <VizSlider label={`a = ${a}`} value={a} min={1} max={6} color={VC.blue} onChange={setA} />
          <VizSlider label={`b = ${b}`} value={b} min={1} max={6} color={VC.red} onChange={setB} />
        </div>
      )}
      <StepNav step={step} setStep={setStep} max={3} />
    </div>
  );
}
