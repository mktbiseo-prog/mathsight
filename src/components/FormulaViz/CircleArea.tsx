import { useState } from "react";
import { Info, SvgCard, VizSlider, VC } from "./shared";

export function CircleArea() {
  const [slices, setSlices] = useState(4);
  const [spread, setSpread] = useState(0);
  const r = 65, cx = 160, cy = 95;

  return (
    <div>
      <Info variant="green">
        <b>원을 피자처럼 잘라서 펼치면... 직사각형이 됩니다!</b> 조각 수를 늘리고, 펼치기 슬라이더를 당겨보세요.
      </Info>
      <SvgCard viewBox="0 0 340 210">
        {Array.from({ length: slices }, (_, i) => {
          const a1 = (i / slices) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
          const even = i % 2 === 0;
          if (spread < 0.05) {
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
            const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
            return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z`} fill={even ? `${VC.blue}35` : `${VC.red}25`} stroke={VC.text} strokeWidth={0.5} />;
          }
          const slW = 280 / slices, bx = 30 + i * slW, h = r * spread, tw = slW * 0.15 * Math.max(0, 1 - spread), yB = 185;
          return even
            ? <path key={i} d={`M${bx},${yB} L${bx + slW},${yB} L${bx + slW / 2 + tw},${yB - h} L${bx + slW / 2 - tw},${yB - h} Z`} fill={`${VC.blue}35`} stroke={VC.text} strokeWidth={0.5} />
            : <path key={i} d={`M${bx},${yB - h} L${bx + slW},${yB - h} L${bx + slW / 2 + tw},${yB} L${bx + slW / 2 - tw},${yB} Z`} fill={`${VC.red}25`} stroke={VC.text} strokeWidth={0.5} />;
        })}

        {spread < 0.05 && <>
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={VC.green} strokeWidth={2} />
          <text x={cx + r / 2} y={cy - 8} textAnchor="middle" fontSize={12} fill={VC.green} fontWeight={700}>r</text>
        </>}

        {spread >= 0.6 && <>
          <line x1={30} y1={195} x2={310} y2={195} stroke={VC.blue} strokeWidth={2} />
          <text x={170} y={208} textAnchor="middle" fontSize={11} fill={VC.blue} fontWeight={700}>&larr; πr (원둘레의 절반) &rarr;</text>
          <text x={18} y={185 - r * spread / 2 + 4} fontSize={11} fill={VC.green} fontWeight={700} transform={`rotate(-90,18,${185 - r * spread / 2 + 4})`}>r</text>
        </>}

        {spread >= 0.9 && slices >= 16 && (
          <g transform="translate(110,10)">
            <rect x={-5} y={-8} width={135} height={28} rx={8} fill={VC.green} />
            <text x={60} y={12} textAnchor="middle" fontSize={13} fill="#fff" fontWeight={700} fontFamily="var(--font-math)">넓이 = πr × r = πr² ✓</text>
          </g>
        )}
      </SvgCard>

      <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
        {[4, 8, 16, 32].map((n) => (
          <button
            key={n}
            onClick={() => setSlices(n)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              slices === n
                ? "bg-success text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {n}조각
          </button>
        ))}
      </div>
      <VizSlider label={`펼치기 ${Math.round(spread * 100)}%`} value={spread} min={0} max={1} step={0.02} color={VC.green} onChange={setSpread} />
    </div>
  );
}
