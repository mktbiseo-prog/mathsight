export type ProblemType = "solve" | "diff" | "integrate" | "limit" | "simplify";
export type PyodideStatus = "idle" | "loading" | "ready" | "error";

export interface SolveRequest {
  type: ProblemType;
  expression: string;
  variable?: string;
  lower?: string;
  upper?: string;
  point?: string;
}

export interface SolutionStep {
  label: string;
  latex: string;
  description?: string;
}

export interface SolveResult {
  result: string | string[];
  resultLatex: string;
  resultSymPy?: string | string[];
  steps: SolutionStep[];
  verified: boolean;
}

export interface PyodideProgress {
  status: PyodideStatus;
  message: string;
  percent: number;
}

interface WorkerResponse {
  id: string;
  type: "result" | "error" | "progress" | "ready";
  payload: unknown;
}

// Singleton worker
let worker: Worker | null = null;
let status: PyodideStatus = "idle";

const pendingRequests = new Map<
  string,
  { resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();
const progressListeners = new Set<(progress: PyodideProgress) => void>();

function getOrCreateWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./sympy.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = handleMessage;
    worker.onerror = handleError;
  }
  return worker;
}

function handleMessage(event: MessageEvent<WorkerResponse>) {
  const { id, type, payload } = event.data;

  if (type === "progress") {
    const p = payload as { message: string; percent: number };
    status = "loading";
    progressListeners.forEach((cb) =>
      cb({ status: "loading", message: p.message, percent: p.percent }),
    );
    return;
  }

  if (type === "ready") {
    status = "ready";
    progressListeners.forEach((cb) =>
      cb({ status: "ready", message: "준비 완료", percent: 100 }),
    );
    // Resolve ALL pending init requests (including secondary callers waiting on "loading" state)
    pendingRequests.forEach(({ resolve }) => resolve(undefined));
    pendingRequests.clear();
    return;
  }

  const pending = pendingRequests.get(id);
  if (!pending) return;
  pendingRequests.delete(id);

  if (type === "result") {
    pending.resolve(payload);
  } else if (type === "error") {
    pending.reject(new Error(payload as string));
  }
}

function handleError(event: ErrorEvent) {
  status = "error";
  pendingRequests.forEach(({ reject }) => reject(new Error(event.message)));
  pendingRequests.clear();
}

export async function initPyodide(): Promise<void> {
  if (status === "ready") return;
  if (status === "loading") {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      pendingRequests.set(id, {
        resolve: resolve as (v: unknown) => void,
        reject,
      });
    });
  }

  status = "loading";
  const w = getOrCreateWorker();
  const id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingRequests.delete(id);
      status = "error";
      progressListeners.forEach((cb) =>
        cb({ status: "error", message: "엔진 로딩 시간 초과 (90초). 새로고침 해주세요.", percent: 0 }),
      );
      reject(new Error("Pyodide 로딩 시간 초과 (90초)"));
    }, 90_000);

    pendingRequests.set(id, {
      resolve: (v) => {
        clearTimeout(timer);
        (resolve as (v: unknown) => void)(v);
      },
      reject: (err) => {
        clearTimeout(timer);
        reject(err);
      },
    });
    w.postMessage({ id, type: "init", payload: {} });
  });
}

export async function solve(request: SolveRequest): Promise<SolveResult> {
  if (status !== "ready") {
    await initPyodide();
  }

  const w = getOrCreateWorker();
  const id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingRequests.delete(id);
      reject(new Error("계산 시간이 초과되었습니다 (30초)"));
    }, 30_000);

    pendingRequests.set(id, {
      resolve: (val) => {
        clearTimeout(timer);
        resolve(val as SolveResult);
      },
      reject: (err) => {
        clearTimeout(timer);
        reject(err);
      },
    });

    w.postMessage({
      id,
      type: request.type,
      payload: {
        expression: request.expression,
        variable: request.variable ?? "x",
        lower: request.lower,
        upper: request.upper,
        point: request.point,
      },
    });
  });
}

export function getStatus(): PyodideStatus {
  return status;
}

export function onProgress(
  callback: (progress: PyodideProgress) => void,
): () => void {
  progressListeners.add(callback);
  return () => progressListeners.delete(callback);
}
