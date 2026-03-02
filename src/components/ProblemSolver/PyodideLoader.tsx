import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSolverStore } from "@/store/useSolverStore";

const MATH_FACTS = [
  "0은 자연수가 아니지만, 짝수입니다.",
  "1729는 두 가지 방법으로 세제곱 합으로 나타낼 수 있는 가장 작은 수입니다. (라마누잔 수)",
  "원주율 π는 무리수이면서 동시에 초월수입니다.",
  "모든 짝수 완전수는 2^(p-1) × (2^p - 1) 형태입니다. (유클리드-오일러 정리)",
  "정17각형은 자와 컴퍼스만으로 작도할 수 있습니다. (가우스, 19세 때 증명)",
  "e^(iπ) + 1 = 0 은 수학에서 가장 아름다운 공식으로 불립니다. (오일러 항등식)",
  "무한집합에도 크기가 다른 종류가 있습니다. (칸토어의 대각선 논법)",
];

export function PyodideLoader() {
  const status = useSolverStore((s) => s.pyodideStatus);
  const message = useSolverStore((s) => s.loadingMessage);
  const percent = useSolverStore((s) => s.loadingPercent);
  const [factIdx, setFactIdx] = useState(() => Math.floor(Math.random() * MATH_FACTS.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIdx((i) => (i + 1) % MATH_FACTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{message || "엔진 로딩 실패"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          새로고침
        </button>
      </div>
    );
  }

  if (status !== "loading" && status !== "idle") return null;

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-12">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <div className="text-center space-y-3 max-w-xs">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {message || "SymPy 엔진 준비 중..."}
        </p>
        <div className="w-56 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          첫 로딩 시 약 20MB 다운로드 (이후 캐시됨)
        </p>
      </div>

      {/* Math fact */}
      <div className="mt-2 px-4 py-3 rounded-xl bg-primary-light/60 dark:bg-primary/10 max-w-xs">
        <p className="text-xs font-medium text-primary mb-1">알고 계셨나요?</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed transition-opacity duration-300">
          {MATH_FACTS[factIdx]}
        </p>
      </div>
    </div>
  );
}
