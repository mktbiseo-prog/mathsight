import { useState } from "react";
import { Info, StepNav, SvgCard, VizSlider, VC } from "./shared";

const DESCS = [
  (n: number) => `1부터 ${n}까지의 합을 구해봅시다. 계단처럼 블록을 쌓아볼게요.`,
  () => "같은 계단을 하나 더 복사해서 뒤집어 봅니다!",
  () => "합치면 완벽한 직사각형! 가로=n, 세로=(n+1). 2개니까 나누기 2!",
];

export function ArithmeticSum() {
  const [step, setStep] = useState(0);
  const [n, setN] = useState(5);
  const sum = (n * (n + 1)) / 2;
  const bw = Math.min(36, 220 / n), bh = 18;
  const ox = 30, oy1 = 40;

  return (
    <div>
      <Info variant="orange"><b>가우스의 방법:</b> {DESCS[step](n)}</Info>
      <SvgCard viewBox="0 0 340 240">
        {/* Original staircase */}
        {Array.from({ length: n }, (_, i) =>
          Array.from({ length: i + 1 }, (_, j) => (
            <rect key={`o-${i}-${j}`} x={ox + j * bw} y={oy1 + (n - 1 - i) * bh} width={bw - 1} height={bh - 1} fill={`${VC.blue}${30 + i * 10}`} stroke={VC.blue} strokeWidth={0.8} rx={2} />
          )),
        )}
        {/* Row labels */}
        {Array.from({ length: n }, (_, i) => (
          <text key={`l-${i}`} x={ox + (i + 1) * bw + 6} y={oy1 + (n - 1 - i) * bh + bh / 2 + 4} fontSize={10} fill={VC.blue} fontWeight={600}>{i + 1}</text>
        ))}

        {/* Flipped staircase */}
        {step >= 1 && Array.from({ length: n }, (_, i) =>
          Array.from({ length: n - i }, (_, j) => (
            <rect key={`f-${i}-${j}`} x={ox + (i + 1) * bw + j * bw} y={oy1 + (n - 1 - i) * bh} width={bw - 1} height={bh - 1} fill={`${VC.red}${30 + (n - 1 - i) * 10}`} stroke={VC.red} strokeWidth={0.8} rx={2} />
          )),
        )}

        {/* Rectangle highlight */}
        {step === 2 && <>
          <rect x={ox - 1} y={oy1 - 1} width={n * bw + 2} height={n * bh + 2} fill="none" stroke={VC.green} strokeWidth={3} rx={3} />
          <text x={ox + (n * bw) / 2} y={oy1 + n * bh + 20} textAnchor="middle" fontSize={12} fill={VC.text} fontWeight={600}>&larr; n = {n} &rarr;</text>
          <text x={ox - 8} y={oy1 + (n * bh) / 2 + 4} textAnchor="end" fontSize={10} fill={VC.text} fontWeight={600}>n+1={n + 1}</text>
        </>}

        {/* Formula */}
        <g transform="translate(30,200)">
          {step === 0 && <text x={0} y={0} fontSize={13} fill={VC.blue} fontWeight={600}>1 + 2 + 3 + ... + {n} = ?</text>}
          {step === 1 && <>
            <text x={0} y={0} fontSize={12} fill={VC.text}>뒤집은 것도 같은 합이니까:</text>
            <text x={0} y={18} fontSize={12} fill={VC.text}>2S = <tspan fill={VC.blue}>{n}개</tspan> × <tspan fill={VC.red}>(각 행 합={n + 1})</tspan></text>
          </>}
          {step === 2 && <>
            <rect x={-6} y={-14} width={290} height={44} rx={8} fill={VC.green} />
            <text x={0} y={0} fontSize={12} fill="#fff">직사각형 넓이 = {n} × {n + 1} = {n * (n + 1)}</text>
            <text x={0} y={20} fontSize={13} fill="#fff" fontWeight={700} fontFamily="var(--font-math)">S = n(n+1)/2 = {n * (n + 1)}/2 = {sum} ✓</text>
          </>}
        </g>
      </SvgCard>

      {step === 2 && (
        <VizSlider label={`n = ${n}`} value={n} min={3} max={8} color={VC.orange} onChange={setN} />
      )}
      <StepNav step={step} setStep={setStep} max={2} />
    </div>
  );
}
