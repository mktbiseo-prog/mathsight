import { useState, useCallback } from "react";
import { cn } from "@/utils/cn";

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

const FACE_EMOJI = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export function DiceSimulator() {
  const [results, setResults] = useState<number[]>([]);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [mode, setMode] = useState<"dice" | "coin">("dice");

  const roll = useCallback(() => {
    if (mode === "dice") {
      const val = rollDie();
      setLastRoll(val);
      setResults((prev) => [...prev, val]);
    } else {
      const val = Math.random() < 0.5 ? 0 : 1; // 0=앞, 1=뒤
      setLastRoll(val);
      setResults((prev) => [...prev, val]);
    }
  }, [mode]);

  const rollMany = useCallback((n: number) => {
    const newResults: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mode === "dice") {
        newResults.push(rollDie());
      } else {
        newResults.push(Math.random() < 0.5 ? 0 : 1);
      }
    }
    setResults((prev) => [...prev, ...newResults]);
    setLastRoll(newResults[newResults.length - 1]);
  }, [mode]);

  const reset = useCallback(() => {
    setResults([]);
    setLastRoll(null);
  }, []);

  // Frequency table
  const freq: Record<number, number> = {};
  results.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });

  const total = results.length;
  const maxFreq = Math.max(...Object.values(freq), 1);
  const categories = mode === "dice" ? [1, 2, 3, 4, 5, 6] : [0, 1];

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 bg-gray-100 dark:bg-white/5 rounded-lg p-0.5">
        {(["dice", "coin"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-bold transition-all",
              mode === m
                ? "bg-white dark:bg-surface-card text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            {m === "dice" ? "🎲 주사위" : "🪙 동전"}
          </button>
        ))}
      </div>

      {/* Last result display */}
      <div className="text-center py-4">
        <div className="text-5xl mb-2">
          {lastRoll === null
            ? (mode === "dice" ? "🎲" : "🪙")
            : mode === "dice"
              ? FACE_EMOJI[lastRoll]
              : lastRoll === 0 ? "앞" : "뒤"}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">총 {total}회 시행</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={roll}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors">
          1회
        </button>
        <button onClick={() => rollMany(10)}
          className="flex-1 py-2.5 rounded-xl bg-primary/80 text-white font-bold text-sm hover:bg-primary-dark transition-colors">
          10회
        </button>
        <button onClick={() => rollMany(100)}
          className="flex-1 py-2.5 rounded-xl bg-primary/60 text-white font-bold text-sm hover:bg-primary-dark transition-colors">
          100회
        </button>
        <button onClick={reset}
          className="py-2.5 px-4 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-300 dark:hover:bg-white/15 transition-colors">
          초기화
        </button>
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-surface-card rounded-2xl p-4 border border-gray-200 dark:border-white/10">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold">빈도 분포</p>
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = freq[cat] || 0;
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
            const barWidth = total > 0 ? (count / maxFreq) * 100 : 0;
            const expected = mode === "dice" ? 100 / 6 : 50;

            return (
              <div key={cat} className="flex items-center gap-2">
                <span className="w-8 text-right text-sm font-bold text-gray-700 dark:text-gray-300">
                  {mode === "dice" ? FACE_EMOJI[cat] : cat === 0 ? "앞" : "뒤"}
                </span>
                <div className="flex-1 h-6 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-300"
                    style={{
                      width: `${barWidth}%`,
                      background: `hsl(${(cat * 50) % 360}, 60%, 55%)`,
                    }}
                  />
                  {/* Expected line */}
                  {total > 10 && (
                    <div
                      className="absolute top-0 h-full w-0.5 bg-red-400 opacity-50"
                      style={{ left: `${(expected / 100) * maxFreq > 0 ? ((total * expected / 100) / maxFreq) * 100 : expected}%` }}
                    />
                  )}
                </div>
                <span className="w-16 text-right text-xs text-gray-500 dark:text-gray-400">
                  {count}회 ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
        {total > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            이론적 확률: {mode === "dice" ? "각 16.7%" : "각 50.0%"}
          </p>
        )}
      </div>
    </div>
  );
}
