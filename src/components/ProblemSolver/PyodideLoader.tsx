import { Loader2 } from "lucide-react";
import { useSolverStore } from "@/store/useSolverStore";

export function PyodideLoader() {
  const status = useSolverStore((s) => s.pyodideStatus);
  const message = useSolverStore((s) => s.loadingMessage);
  const percent = useSolverStore((s) => s.loadingPercent);

  if (status !== "loading" && status !== "idle") return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {message || "SymPy 엔진 준비 중..."}
        </p>
        <div className="w-48 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          첫 로딩 시 약 20MB 다운로드 (이후 캐시됨)
        </p>
      </div>
    </div>
  );
}
