import { useState } from "react";
import { Info, SvgCard, VizSlider, StepNav, VC } from "./shared";

const PI = Math.PI;

export function TrigWave() {
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(90);
  const [amp, setAmp] = useState(1);
  const [freq, setFreq] = useState(1);

  const rad = (angle * PI) / 180;

  return (
    <div>
      <Info variant="amber">
        <b>단위원 → 파동으로!</b> 원 위의 점이 돌면서 sin, cos 값이 파동 그래프가 됩니다. 각도를 움직여 연동을 관찰하세요.
      </Info>

      {step === 0 && (() => {
        const r = 70, cx = 90, cy = 110;
        const waveStart = 200, waveW = 260, waveH = 70;
        const px = cx + r * Math.cos(rad);
        const py = cy - r * Math.sin(rad);

        // Generate sine wave path
        const sinPts: string[] = [];
        for (let i = 0; i <= 200; i++) {
          const t = (i / 200) * 2 * PI;
          const wx = waveStart + (t / (2 * PI)) * waveW;
          const wy = cy - waveH * Math.sin(t);
          sinPts.push(`${i === 0 ? "M" : "L"}${wx.toFixed(1)},${wy.toFixed(1)}`);
        }

        const cosPts: string[] = [];
        for (let i = 0; i <= 200; i++) {
          const t = (i / 200) * 2 * PI;
          const wx = waveStart + (t / (2 * PI)) * waveW;
          const wy = cy - waveH * Math.cos(t);
          cosPts.push(`${i === 0 ? "M" : "L"}${wx.toFixed(1)},${wy.toFixed(1)}`);
        }

        // Current position on wave
        const normAngle = rad % (2 * PI);
        const markerX = waveStart + (normAngle / (2 * PI)) * waveW;
        const markerSinY = cy - waveH * Math.sin(rad);
        const markerCosY = cy - waveH * Math.cos(rad);

        return (
          <>
            <SvgCard viewBox="0 0 480 230">
              {/* Unit circle */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ccc" strokeWidth={1} />
              <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} stroke="#eee" strokeWidth={0.5} />
              <line x1={cx} y1={cy - r - 10} x2={cx} y2={cy + r + 10} stroke="#eee" strokeWidth={0.5} />

              {/* Radius */}
              <line x1={cx} y1={cy} x2={px} y2={py} stroke={VC.text} strokeWidth={1.5} />
              <circle cx={px} cy={py} r={4} fill={VC.green} />

              {/* sin projection */}
              <line x1={px} y1={py} x2={cx} y2={py} stroke={VC.red} strokeWidth={2} strokeDasharray="3,2" />
              <line x1={cx} y1={cy} x2={cx} y2={py} stroke={VC.red} strokeWidth={2.5} />

              {/* cos projection */}
              <line x1={cx} y1={cy} x2={px} y2={cy} stroke={VC.blue} strokeWidth={2.5} />

              {/* Wave axes */}
              <line x1={waveStart} y1={cy} x2={waveStart + waveW} y2={cy} stroke="#ccc" strokeWidth={0.5} />

              {/* Sine wave */}
              <path d={sinPts.join(" ")} fill="none" stroke={VC.red} strokeWidth={2} />
              {/* Cosine wave */}
              <path d={cosPts.join(" ")} fill="none" stroke={VC.blue} strokeWidth={2} opacity={0.6} />

              {/* Connecting line */}
              <line x1={px} y1={py} x2={markerX} y2={markerSinY} stroke={VC.green} strokeWidth={1} strokeDasharray="4,3" />

              {/* Markers on wave */}
              <circle cx={markerX} cy={markerSinY} r={4} fill={VC.red} />
              <circle cx={markerX} cy={markerCosY} r={4} fill={VC.blue} />

              {/* Labels */}
              <text x={waveStart + waveW / 2} y={25} textAnchor="middle" fontSize={12} fill={VC.red} fontWeight={700}>sin θ</text>
              <text x={waveStart + waveW / 2} y={40} textAnchor="middle" fontSize={11} fill={VC.blue} fontWeight={600} opacity={0.7}>cos θ</text>
              <text x={cx} y={cy + r + 20} textAnchor="middle" fontSize={11} fill={VC.amber} fontWeight={700}>θ = {angle}°</text>
            </SvgCard>
            <VizSlider label={`각도 θ = ${angle}°`} value={angle} min={0} max={720} step={5} color={VC.amber} onChange={setAngle} />
          </>
        );
      })()}

      {step === 1 && (() => {
        const cx = 240, cy = 120, h = 80;
        const pts: string[] = [];
        for (let i = 0; i <= 300; i++) {
          const x = (i / 300) * 460 + 10;
          const t = (i / 300) * 4 * PI;
          const y = cy - h * amp * Math.sin(freq * t);
          pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
        }
        return (
          <>
            <Info variant="blue">
              <b>진폭과 주기 변화:</b> y = A·sin(ωx)에서 A는 진폭, ω는 주파수. 주기 = 2π/ω
            </Info>
            <SvgCard viewBox="0 0 480 240">
              <line x1={10} y1={cy} x2={470} y2={cy} stroke="#ddd" strokeWidth={0.5} />
              <path d={pts.join(" ")} fill="none" stroke={VC.blue} strokeWidth={2.5} />
              <text x={cx} y={24} textAnchor="middle" fontSize={13} fill={VC.blue} fontWeight={700}>
                y = {amp.toFixed(1)}·sin({freq.toFixed(1)}x)
              </text>
              <text x={cx} y={cy + h * amp + 22} textAnchor="middle" fontSize={11} fill={VC.textS}>
                주기 = {(2 * PI / freq).toFixed(2)}
              </text>
            </SvgCard>
            <VizSlider label={`진폭 A = ${amp.toFixed(1)}`} value={amp} min={0.1} max={3} step={0.1} color={VC.blue} onChange={setAmp} />
            <VizSlider label={`주파수 ω = ${freq.toFixed(1)}`} value={freq} min={0.2} max={4} step={0.1} color={VC.red} onChange={setFreq} />
          </>
        );
      })()}

      <StepNav step={step} setStep={setStep} max={1} />

      <Info variant="green">
        <b>핵심:</b> sin, cos은 원 위의 좌표가 시간에 따라 변하는 것! 소리·빛·전기 — 세상의 모든 파동이 이것으로 표현됩니다.
      </Info>
    </div>
  );
}
