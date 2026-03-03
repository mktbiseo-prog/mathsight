import { useEffect, useCallback } from "react";
import {
  initPyodide,
  solve as solveBridge,
  getStatus,
  onProgress,
  resetForRetry,
} from "@/engine/sympy-bridge";
import type { SolveRequest, SolveResult } from "@/engine/sympy-bridge";
import { useSolverStore } from "@/store/useSolverStore";

export function usePyodide() {
  const setPyodideProgress = useSolverStore((s) => s.setPyodideProgress);
  const pyodideStatus = useSolverStore((s) => s.pyodideStatus);

  useEffect(() => {
    const currentStatus = getStatus();

    if (currentStatus === "ready") {
      setPyodideProgress("ready", "준비 완료", 100);
      return;
    }

    // If a previous attempt errored, reset and retry
    if (currentStatus === "error") {
      resetForRetry();
    }

    // Register progress listener
    const unsubscribe = onProgress((progress) => {
      setPyodideProgress(progress.status, progress.message, progress.percent);
    });

    // Start init (covers both "idle" and reset-from-error)
    const bridgeStatus = getStatus();
    if (bridgeStatus === "idle") {
      setPyodideProgress("loading", "SymPy 엔진 준비 중...", 0);
      initPyodide().catch((err) => {
        setPyodideProgress(
          "error",
          err instanceof Error ? err.message : "로딩 실패",
          0,
        );
      });
    } else if (bridgeStatus === "loading") {
      // Already loading from Layout preload — sync store to loading state
      setPyodideProgress("loading", "SymPy 엔진 준비 중...", 0);
    }

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const computeSolution = useCallback(
    async (request: SolveRequest): Promise<SolveResult> => {
      return solveBridge(request);
    },
    [],
  );

  return {
    status: pyodideStatus,
    isReady: pyodideStatus === "ready",
    solve: computeSolution,
  };
}
