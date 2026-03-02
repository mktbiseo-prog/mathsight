import { useState } from "react";
import { Info, StepNav, SvgCard, VizSlider, VC } from "./shared";

const DESCS = [
  "큰 정사각형 a²에서 작은 정사각형 b²을 빼봅니다.",
  "남은 'ㄱ'자 모양을 잘 보세요. 이걸 잘라볼 거예요!",
  "위쪽 직사각형을 떼어내서 옆에 붙이면... 하나의 직사각형이 돼요!",
  "이 직사각형의 가로=(a+b), 세로=(a-b)! 공식 완성!",
];

export function DiffOfSquares() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const sc = 38;
  const ox = 20, oy = 20;

  return (
    <div>
      <Info variant="teal"><b>STEP {step + 1}/4:</b> {DESCS[step]}</Info>
      <SvgCard viewBox="0 0 340 260">
        {step === 0 && <>
          <rect x={ox} y={oy} width={a * sc} height={a * sc} fill={`${VC.blue}25`} stroke={VC.blue} strokeWidth={2} />
          <rect x={ox + a * sc - b * sc} y={oy + a * sc - b * sc} width={b * sc} height={b * sc} fill={`${VC.red}35`} stroke={VC.red} strokeWidth={2} />
          <text x={ox + a * sc / 2} y={oy + a * sc / 2} textAnchor="middle" fontSize={18} fontWeight={700} fill={VC.blue} fontFamily="var(--font-math)">a²</text>
          <text x={ox + a * sc - b * sc / 2} y={oy + a * sc - b * sc / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={VC.red} fontFamily="var(--font-math)">b²</text>
          <text x={ox + a * sc / 2} y={oy + a * sc + 18} textAnchor="middle" fontSize={12} fill={VC.blue} fontWeight={600}>a = {a}</text>
          <text x={260} y={50} fontSize={16} fontWeight={700} fill={VC.teal} fontFamily="var(--font-math)">a² − b²</text>
          <text x={260} y={72} fontSize={12} fill={VC.text}>= {a * a} − {b * b}</text>
          <text x={260} y={92} fontSize={14} fill={VC.teal} fontWeight={700}>= {a * a - b * b}</text>
        </>}

        {step === 1 && <>
          <rect x={ox} y={oy} width={a * sc} height={(a - b) * sc} fill={`${VC.teal}20`} stroke={VC.teal} strokeWidth={2} />
          <rect x={ox} y={oy + (a - b) * sc} width={(a - b) * sc} height={b * sc} fill={`${VC.teal}30`} stroke={VC.teal} strokeWidth={2} />
          <line x1={ox} y1={oy + (a - b) * sc} x2={ox + (a - b) * sc} y2={oy + (a - b) * sc} stroke={VC.orange} strokeWidth={2.5} strokeDasharray="5,3" />
          <text x={ox + a * sc / 2} y={oy + (a - b) * sc / 2 + 5} textAnchor="middle" fontSize={11} fill={VC.teal} fontWeight={700}>위쪽 조각</text>
          <text x={ox + (a - b) * sc / 2} y={oy + (a - b) * sc + b * sc / 2 + 5} textAnchor="middle" fontSize={11} fill={VC.teal} fontWeight={700}>아래 조각</text>
          <text x={ox + (a - b) * sc + 10} y={oy + (a - b) * sc + 5} fontSize={16}>✂️</text>
          <text x={ox + a * sc + 8} y={oy + (a - b) * sc / 2 + 4} fontSize={10} fill={VC.text}>a−b={a - b}</text>
          <text x={ox + a * sc / 2} y={oy - 6} textAnchor="middle" fontSize={10} fill={VC.text}>a={a}</text>
        </>}

        {step === 2 && <>
          <rect x={ox} y={oy + 60} width={(a - b) * sc} height={b * sc} fill={`${VC.teal}30`} stroke={VC.teal} strokeWidth={2} />
          <rect x={ox + (a - b) * sc} y={oy + 60} width={(a - b) * sc} height={b * sc} fill={`${VC.teal}20`} stroke={VC.teal} strokeWidth={2} />
          <defs><marker id="arrow-dos" viewBox="0 0 10 10" refX="5" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d={`M 0 0 L 10 5 L 0 10 z`} fill={VC.orange} /></marker></defs>
          <path d={`M${ox + a * sc / 2},${oy + 20} C${ox + a * sc},${oy + 10} ${ox + (a - b) * sc + a * sc / 2},${oy + 30} ${ox + (a - b) * sc + (a - b) * sc / 2},${oy + 55}`} fill="none" stroke={VC.orange} strokeWidth={1.5} strokeDasharray="4,3" markerEnd="url(#arrow-dos)" />
          <text x={ox + (a - b) * sc} y={oy + 60 + b * sc + 18} textAnchor="middle" fontSize={12} fill={VC.text} fontWeight={600}>&larr; (a−b) + (a−b) &rarr;</text>
        </>}

        {step === 3 && <>
          <rect x={ox} y={oy + 30} width={(a + b) * sc * 0.85} height={(a - b) * sc} fill={`${VC.teal}25`} stroke={VC.teal} strokeWidth={2.5} rx={2} />
          <line x1={ox + (a - b) * sc * 0.85} y1={oy + 30} x2={ox + (a - b) * sc * 0.85} y2={oy + 30 + (a - b) * sc} stroke={VC.orange} strokeWidth={1.5} strokeDasharray="4,3" />
          <text x={ox + (a - b) * sc * 0.85 / 2} y={oy + 30 + (a - b) * sc / 2 + 4} textAnchor="middle" fontSize={11} fill={VC.teal} fontWeight={600}>b(a−b)</text>
          <text x={ox + (a - b) * sc * 0.85 + ((a + b) * sc * 0.85 - (a - b) * sc * 0.85) / 2} y={oy + 30 + (a - b) * sc / 2 + 4} textAnchor="middle" fontSize={11} fill={VC.teal} fontWeight={600}>a(a−b)</text>
          <text x={ox + (a + b) * sc * 0.85 / 2} y={oy + 30 + (a - b) * sc + 20} textAnchor="middle" fontSize={13} fill={VC.teal} fontWeight={700}>&larr; (a+b) = {a + b} &rarr;</text>
          <text x={ox - 10} y={oy + 30 + (a - b) * sc / 2 + 4} textAnchor="end" fontSize={12} fill={VC.teal} fontWeight={700}>(a−b)={a - b}</text>
          <g transform="translate(200,180)">
            <rect x={-10} y={-18} width={150} height={75} rx={10} fill={VC.teal} />
            <text x={0} y={0} fontSize={12} fill="#fff" fontWeight={600}>a² − b²</text>
            <text x={0} y={20} fontSize={13} fill="#fff" fontWeight={700} fontFamily="var(--font-math)">= (a+b)(a−b)</text>
            <text x={0} y={40} fontSize={12} fill="#fff">= {a + b} × {a - b} = {(a + b) * (a - b)} ✓</text>
          </g>
        </>}
      </SvgCard>

      {step === 3 && (
        <div className="flex gap-3 mt-2">
          <VizSlider label={`a = ${a}`} value={a} min={3} max={7} color={VC.teal} onChange={setA} />
          <VizSlider label={`b = ${b}`} value={b} min={1} max={a - 1} color={VC.red} onChange={setB} />
        </div>
      )}
      <StepNav step={step} setStep={setStep} max={3} />
    </div>
  );
}
