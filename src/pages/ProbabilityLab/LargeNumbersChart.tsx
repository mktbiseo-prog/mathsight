import { useState, useCallback } from "react";

export function LargeNumbersChart() {
  const [trials, setTrials] = useState(0);
  const [runningAvg, setRunningAvg] = useState<number[]>([]);

  const simulate = useCallback((n: number) => {
    setTrials((prev) => {
      const newTotal = prev + n;
      setRunningAvg((prevAvg) => {
        const newAvg = [...prevAvg];
        let sum = prevAvg.length > 0
          ? prevAvg[prevAvg.length - 1] * prev
          : 0;
        for (let i = 0; i < n; i++) {
          const roll = Math.floor(Math.random() * 6) + 1;
          sum += roll;
          const currentTrial = prev + i + 1;
          // Sample at intervals to avoid too many points
          if (currentTrial <= 50 || currentTrial % Math.max(1, Math.floor(newTotal / 200)) === 0) {
            newAvg.push(sum / currentTrial);
          }
        }
        return newAvg;
      });
      return newTotal;
    });
  }, []);

  const reset = useCallback(() => {
    setTrials(0);
    setRunningAvg([]);
  }, []);

  const expected = 3.5;
  const w = 420, h = 200;
  const padL = 40, padR = 10, padT = 20, padB = 30;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  // Y range: 1 to 6
  const yMin = 1, yMax = 6;
  const toY = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const toX = (i: number) => padL + (i / Math.max(runningAvg.length - 1, 1)) * plotW;

  const pathD = runningAvg.map((v, i) =>
    `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`
  ).join(" ");

  return (
    <div>
      <div className="bg-white dark:bg-surface-card rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
          주사위 실행 평균 (기댓값 = 3.5)
        </p>

        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          {/* Grid */}
          {[1, 2, 3, 3.5, 4, 5, 6].map((v) => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={padL + plotW} y2={toY(v)}
                stroke={v === 3.5 ? "#D32F2F" : "#eee"} strokeWidth={v === 3.5 ? 1.5 : 0.5}
                strokeDasharray={v === 3.5 ? "6,3" : undefined} />
              <text x={padL - 4} y={toY(v) + 4} textAnchor="end" fontSize={9}
                fill={v === 3.5 ? "#D32F2F" : "#999"} fontWeight={v === 3.5 ? 700 : 400}>
                {v}
              </text>
            </g>
          ))}

          {/* Running average line */}
          {pathD && <path d={pathD} fill="none" stroke="#1976D2" strokeWidth={2} />}

          {/* Labels */}
          <text x={padL + plotW / 2} y={h - 4} textAnchor="middle" fontSize={10} fill="#999">시행 횟수 (n = {trials})</text>
          {runningAvg.length > 0 && (
            <text x={toX(runningAvg.length - 1)} y={toY(runningAvg[runningAvg.length - 1]) - 8}
              textAnchor="middle" fontSize={10} fill="#1976D2" fontWeight={700}>
              {runningAvg[runningAvg.length - 1].toFixed(3)}
            </text>
          )}
        </svg>
      </div>

      <div className="flex gap-2 mb-3">
        <button onClick={() => simulate(10)}
          className="flex-1 py-2.5 rounded-xl bg-[#1976D2] text-white font-bold text-sm">
          +10회
        </button>
        <button onClick={() => simulate(100)}
          className="flex-1 py-2.5 rounded-xl bg-[#1976D2]/80 text-white font-bold text-sm">
          +100회
        </button>
        <button onClick={() => simulate(1000)}
          className="flex-1 py-2.5 rounded-xl bg-[#1976D2]/60 text-white font-bold text-sm">
          +1000회
        </button>
        <button onClick={reset}
          className="py-2.5 px-4 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm">
          초기화
        </button>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <b>큰 수의 법칙:</b> 시행 횟수가 많아질수록 실행 평균은 이론적 기댓값(3.5)에 수렴합니다.
        {trials > 100 && <span className="text-[#1976D2] font-bold"> 현재 오차: {Math.abs(runningAvg[runningAvg.length - 1] - expected).toFixed(4)}</span>}
      </div>
    </div>
  );
}
