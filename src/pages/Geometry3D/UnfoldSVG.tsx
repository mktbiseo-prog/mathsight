const PI = Math.PI;

interface UnfoldSVGProps {
  radius: number;
  spread: number;
}

export function UnfoldSVG({ radius: r, spread }: UnfoldSVGProps) {
  const circ = 2 * PI * r;
  const w = 580, h = 380;
  const sc = 28;
  const cx = 140, cy = 160;

  return (
    <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-white/10 p-1 overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full block">
        {/* Left: Circle */}
        {spread < 0.95 && (() => {
          const a = 1 - spread * 0.8;
          return (
            <>
              <circle cx={cx} cy={cy} r={r * sc} fill={`rgba(25,118,210,${0.12 * a})`} stroke="#1976D2" strokeWidth={2} opacity={a} />
              <line x1={cx} y1={cy} x2={cx + r * sc} y2={cy} stroke="#1976D2" strokeWidth={2} opacity={a} />
              <text x={cx + r * sc / 2} y={cy - 8} textAnchor="middle" fontSize={12} fill="#1976D2" fontWeight={700} opacity={a}>r={r}</text>
              <circle cx={cx} cy={cy} r={3} fill="#1976D2" opacity={a} />
            </>
          );
        })()}

        {/* Arrow */}
        {spread > 0.1 && (
          <text x={w / 2} y={60} textAnchor="middle" fontSize={22} fill="#2E7D32">→</text>
        )}

        {/* Right: Unfolded */}
        {spread > 0.05 && (() => {
          const lx = 320, ly = cy;
          const lineLen = circ * sc * 0.07;
          const a = Math.min(1, spread * 1.5);
          return (
            <>
              <line x1={lx} y1={ly} x2={lx + lineLen} y2={ly} stroke="#D32F2F" strokeWidth={3} opacity={a} />
              <text x={lx + lineLen / 2} y={ly - 10} textAnchor="middle" fontSize={11} fill="#D32F2F" fontWeight={700} opacity={a}>
                둘레 = 2πr = {circ.toFixed(1)}
              </text>

              {/* Area rectangle */}
              {spread > 0.3 && (() => {
                const rW = PI * r * sc * 0.07;
                const rH = r * sc * 0.5;
                const ry = ly + 30;
                const a2 = Math.min(1, (spread - 0.3) * 2);
                return (
                  <>
                    <rect x={lx} y={ry} width={rW} height={rH} fill="rgba(46,125,50,0.15)" stroke="#2E7D32" strokeWidth={2} opacity={a2} rx={2} />
                    <text x={lx + rW / 2} y={ry + rH + 16} textAnchor="middle" fontSize={11} fill="#2E7D32" fontWeight={700} opacity={a2}>
                      πr × r = πr² = {(PI * r * r).toFixed(1)}
                    </text>
                    <text x={lx + rW / 2} y={ry + rH / 2 + 4} textAnchor="middle" fontSize={13} fill="#2E7D32" fontWeight={800} opacity={a2}>넓이</text>
                    <text x={lx + rW / 2} y={ry - 6} textAnchor="middle" fontSize={10} fill="#2E7D32" opacity={a2}>← πr →</text>
                    <text x={lx - 8} y={ry + rH / 2 + 4} textAnchor="end" fontSize={10} fill="#2E7D32" opacity={a2}>r</text>
                  </>
                );
              })()}

              {/* Comparison bars */}
              {spread > 0.6 && (() => {
                const a3 = Math.min(1, (spread - 0.6) * 2.5);
                const barY = ly + 140;
                const maxBar = 200;
                const circBar = maxBar;
                const diaBar = (2 * r) / circ * maxBar;
                return (
                  <>
                    <text x={lx} y={barY - 12} fontSize={12} fill="#555" fontWeight={700} opacity={a3}>길이 비교:</text>
                    <rect x={lx} y={barY} width={circBar} height={18} fill="#D32F2F" rx={4} opacity={a3} />
                    <text x={lx + circBar + 6} y={barY + 14} fontSize={11} fill="#D32F2F" fontWeight={600} opacity={a3}>둘레 = {circ.toFixed(1)}</text>
                    <rect x={lx} y={barY + 26} width={diaBar} height={18} fill="#1976D2" rx={4} opacity={a3} />
                    <text x={lx + diaBar + 6} y={barY + 40} fontSize={11} fill="#1976D2" fontWeight={600} opacity={a3}>지름 = {(2 * r).toFixed(1)}</text>
                    <text x={lx} y={barY + 65} fontSize={12} fill="#2E7D32" fontWeight={800} opacity={a3}>
                      둘레 ÷ 지름 = π ≈ {(circ / (2 * r)).toFixed(4)} ✓
                    </text>
                  </>
                );
              })()}
            </>
          );
        })()}
      </svg>
    </div>
  );
}
