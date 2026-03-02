import { useState } from "react";
import { Info, StepNav, SvgCard, VC } from "./shared";

const DESCS = [
  "x² + 6x = 7 을 풀어봅시다. 좌변을 도형으로 만들어요!",
  "x² 은 정사각형, 6x는 직사각형 두 개(3x + 3x)로 나눕니다.",
  "빈 모서리(3×3=9)를 채우면 완전제곱식! 양변에 9를 더해요.",
  "(x+3)² = 16 → x+3 = ±4 → x = 1 또는 x = -7",
];

export function QuadraticFormula() {
  const [step, setStep] = useState(0);
  const s = 50;

  return (
    <div>
      <Info variant="purple"><b>완전제곱식으로 근의 공식 유도!</b><br />STEP {step + 1}: {DESCS[step]}</Info>
      <SvgCard viewBox="0 0 340 230">
        {step === 0 && <>
          <text x={170} y={60} textAnchor="middle" fontSize={22} fontWeight={700} fill={VC.purple} fontFamily="var(--font-math)">x² + 6x = 7</text>
          <text x={170} y={90} textAnchor="middle" fontSize={14} fill={VC.textS}>이걸 도형으로 표현하면?</text>
          <text x={170} y={140} textAnchor="middle" fontSize={60}>🤔</text>
        </>}

        {step === 1 && <>
          <rect x={30} y={30} width={s} height={s} fill={`${VC.blue}30`} stroke={VC.blue} strokeWidth={2} />
          <text x={30 + s / 2} y={30 + s / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={VC.blue} fontFamily="var(--font-math)">x²</text>
          <rect x={30 + s} y={30} width={30} height={s} fill={`${VC.purple}25`} stroke={VC.purple} strokeWidth={2} />
          <text x={30 + s + 15} y={30 + s / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={VC.purple}>3x</text>
          <rect x={30} y={30 + s} width={s} height={30} fill={`${VC.purple}25`} stroke={VC.purple} strokeWidth={2} />
          <text x={30 + s / 2} y={30 + s + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={VC.purple}>3x</text>
          <text x={30 + s / 2} y={22} textAnchor="middle" fontSize={11} fill={VC.blue} fontWeight={600}>x</text>
          <text x={30 + s + 15} y={22} textAnchor="middle" fontSize={11} fill={VC.purple} fontWeight={600}>3</text>
          <text x={22} y={30 + s / 2 + 4} textAnchor="end" fontSize={11} fill={VC.blue} fontWeight={600}>x</text>
          <text x={22} y={30 + s + 20} textAnchor="end" fontSize={11} fill={VC.purple} fontWeight={600}>3</text>
          <text x={200} y={60} fontSize={13} fill={VC.text} fontFamily="var(--font-math)">x² + 3x + 3x</text>
          <text x={200} y={80} fontSize={13} fill={VC.text} fontFamily="var(--font-math)">= x² + 6x</text>
          <text x={200} y={100} fontSize={11} fill={VC.textS}>오른쪽 아래 모서리가 비어있어요!</text>
        </>}

        {step === 2 && <>
          <rect x={30} y={30} width={s} height={s} fill={`${VC.blue}30`} stroke={VC.blue} strokeWidth={2} />
          <text x={30 + s / 2} y={30 + s / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={VC.blue}>x²</text>
          <rect x={30 + s} y={30} width={30} height={s} fill={`${VC.purple}25`} stroke={VC.purple} strokeWidth={2} />
          <text x={30 + s + 15} y={30 + s / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={VC.purple}>3x</text>
          <rect x={30} y={30 + s} width={s} height={30} fill={`${VC.purple}25`} stroke={VC.purple} strokeWidth={2} />
          <text x={30 + s / 2} y={30 + s + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={VC.purple}>3x</text>
          {/* Missing piece */}
          <rect x={30 + s} y={30 + s} width={30} height={30} fill={`${VC.amber}40`} stroke={VC.amber} strokeWidth={2.5} />
          <text x={30 + s + 15} y={30 + s + 20} textAnchor="middle" fontSize={12} fontWeight={800} fill={VC.amber}>9</text>
          <text x={30 + s + 15} y={30 + s + 5} textAnchor="middle" fontSize={8} fill={VC.amber}>3×3</text>
          {/* Complete square outline */}
          <rect x={29} y={29} width={s + 32} height={s + 32} fill="none" stroke={VC.green} strokeWidth={3} rx={2} strokeDasharray="6,3" />
          <text x={180} y={50} fontSize={13} fill={VC.text} fontFamily="var(--font-math)">
            x² + 6x <tspan fill={VC.amber} fontWeight={700}>+ 9</tspan> = 7 <tspan fill={VC.amber} fontWeight={700}>+ 9</tspan>
          </text>
          <text x={180} y={75} fontSize={14} fill={VC.green} fontWeight={700} fontFamily="var(--font-math)">(x+3)² = 16</text>
          <text x={180} y={100} fontSize={11} fill={VC.textS}>빈칸을 채워서 완전제곱식!</text>
        </>}

        {step === 3 && <>
          <rect x={20} y={20} width={90} height={90} fill={`${VC.green}20`} stroke={VC.green} strokeWidth={3} rx={4} />
          <text x={65} y={60} textAnchor="middle" fontSize={16} fontWeight={700} fill={VC.green} fontFamily="var(--font-math)">(x+3)²</text>
          <text x={65} y={80} textAnchor="middle" fontSize={13} fill={VC.green}>= 16</text>
          <g transform="translate(140,30)">
            <text x={0} y={0} fontSize={13} fill={VC.text} fontFamily="var(--font-math)">(x+3)² = 16</text>
            <text x={0} y={24} fontSize={13} fill={VC.text} fontFamily="var(--font-math)">x + 3 = ±4</text>
            <text x={0} y={52} fontSize={13} fill={VC.blue} fontWeight={700}>x = 4 − 3 = <tspan fontSize={16}>1</tspan></text>
            <text x={0} y={76} fontSize={13} fill={VC.red} fontWeight={700}>x = −4 − 3 = <tspan fontSize={16}>−7</tspan></text>
          </g>
          {/* General formula */}
          <g transform="translate(20,140)">
            <rect x={-5} y={-14} width={320} height={70} rx={10} fill={VC.purple} />
            <text x={5} y={4} fontSize={12} fill="#fff" fontWeight={600}>이걸 일반화하면 근의 공식이 나와요:</text>
            <text x={5} y={28} fontSize={11} fill="#fff">ax² + bx + c = 0 일 때,</text>
            <text x={5} y={48} fontSize={15} fill="#fff" fontWeight={700} fontFamily="var(--font-math)">x = (−b ± √(b²−4ac)) / 2a</text>
          </g>
        </>}
      </SvgCard>
      <StepNav step={step} setStep={setStep} max={3} />
    </div>
  );
}
