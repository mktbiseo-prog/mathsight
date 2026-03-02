import { Info, SvgCard, VC } from "./shared";

export function Pythagoras() {
  const s = 28;
  const x0 = 70 + 3 * s, y0 = 240, x1 = 70, y1 = 240 - 4 * s;
  const dx = x1 - x0, dy = y1 - y0;
  const pcx = (x0 + (x0 - dy) + (x1 - dy) + x1) / 4;
  const pcy = (y0 + (y0 + dx) + (y1 + dx) + y1) / 4;

  return (
    <div>
      <Info variant="purple">
        <b>직각삼각형의 각 변으로 정사각형을 그려보세요.</b> 작은 두 정사각형의 넓이의 합 = 큰 정사각형의 넓이!
      </Info>
      <SvgCard viewBox="0 0 340 290">
        {/* Triangle */}
        <polygon points={`70,240 ${70 + 3 * s},240 70,${240 - 4 * s}`} fill="#FFF3E0" stroke={VC.text} strokeWidth={2} />
        <path d="M70,230 L80,230 L80,240" fill="none" stroke={VC.text} strokeWidth={1.5} />

        {/* a² square */}
        <rect x={70} y={240} width={3 * s} height={3 * s} fill={`${VC.blue}22`} stroke={VC.blue} strokeWidth={2} />
        <text x={70 + 3 * s / 2} y={240 + 3 * s / 2 + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={VC.blue} fontFamily="var(--font-math)">a²=9</text>

        {/* b² square */}
        <rect x={70 - 4 * s} y={240 - 4 * s} width={4 * s} height={4 * s} fill={`${VC.red}18`} stroke={VC.red} strokeWidth={2} />
        <text x={70 - 4 * s / 2} y={240 - 4 * s / 2 + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={VC.red} fontFamily="var(--font-math)">b²=16</text>

        {/* c² square on hypotenuse */}
        <polygon points={`${x0},${y0} ${x0 - dy},${y0 + dx} ${x1 - dy},${y1 + dx} ${x1},${y1}`} fill={`${VC.purple}18`} stroke={VC.purple} strokeWidth={2} />
        <text x={pcx} y={pcy + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={VC.purple} fontFamily="var(--font-math)">c²=25</text>

        {/* Equation */}
        <g transform="translate(240,250)">
          <text x={0} y={0} fontSize={13} fill={VC.blue} fontWeight={700}>9</text>
          <text x={16} y={0} fontSize={13} fill={VC.text}> + </text>
          <text x={32} y={0} fontSize={13} fill={VC.red} fontWeight={700}>16</text>
          <text x={52} y={0} fontSize={13} fill={VC.text}> = </text>
          <text x={66} y={0} fontSize={13} fill={VC.purple} fontWeight={700}>25</text>
          <text x={30} y={18} fontSize={12} fill={VC.green} fontWeight={700}>✓ 성립!</text>
        </g>
      </SvgCard>
    </div>
  );
}
