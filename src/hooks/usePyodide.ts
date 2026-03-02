import { useEffect, useCallback } from "react";
import {
  initPyodide,
  solve as solveBridge,
  getStatus,
  onProgress,
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

    // Register progress listener for both idle AND loading states
    const unsubscribe = onProgress((progress) => {
      setPyodideProgress(progress.status, progress.message, progress.percent);
    });

    if (currentStatus === "idle") {
      initPyodide().catch((err) => {
        setPyodideProgress(
          "error",
          err instanceof Error ? err.message : "로딩 실패",
          0,
        );
      });
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
