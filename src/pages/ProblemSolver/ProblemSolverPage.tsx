import { useParams, Link } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getSubject, getUnit } from "@/content";
import { usePyodide } from "@/hooks/usePyodide";
import { useSolverStore } from "@/store/useSolverStore";
import { problemToRequest } from "@/engine/step-generator";
import type { ParsedProblem } from "@/engine/step-generator";
import { getVerificationSummary } from "@/engine/verifier";
import { MathInput } from "@/components/MathInput/MathInput";
import { StepPlayer } from "@/components/StepPlayer/StepPlayer";
import { PyodideLoader } from "@/components/ProblemSolver/PyodideLoader";
import { ExampleProblems } from "@/components/ProblemSolver/ExampleProblems";
import { KaTeX } from "@/components/common/KaTeX";

export function ProblemSolverPage() {
  const { subjectId, unitId } = useParams();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const unit = subject && unitId ? getUnit(subject.id, unitId) : undefined;

  const { isReady, solve: computeSolve } = usePyodide();

  const currentProblem = useSolverStore((s) => s.currentProblem);
  const solution = useSolverStore((s) => s.solution);
  const isComputing = useSolverStore((s) => s.isComputing);
  const error = useSolverStore((s) => s.error);
  const activeStepIndex = useSolverStore((s) => s.activeStepIndex);
  const setActiveStepIndex = useSolverStore((s) => s.setActiveStepIndex);
  const startComputation = useSolverStore((s) => s.startComputation);
  const setSolution = useSolverStore((s) => s.setSolution);
  const setError = useSolverStore((s) => s.setError);

  const handleSubmit = async (parsed: ParsedProblem) => {
    startComputation(parsed);
    try {
      const result = await computeSolve(problemToRequest(parsed));
      setSolution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  };

  const verification =
    solution && currentProblem
      ? getVerificationSummary(solution, currentProblem.type)
      : null;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      {subject && unit && (
        <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {subject.name} &gt; {unit.name}
          </Link>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Left panel: 풀이 */}
        <div className="w-full md:w-[45%] border-r border-border-warm dark:border-white/6 flex flex-col min-h-0">
          <div className="shrink-0 p-4 space-y-4 border-b border-gray-100 dark:border-white/5">
            <MathInput onSubmit={handleSubmit} disabled={isComputing} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isReady && <PyodideLoader />}

            {isReady && !solution && !isComputing && !error && (
              <ExampleProblems onSelect={handleSubmit} />
            )}

            {isComputing && (
              <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">계산 중...</span>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-lg bg-error-light dark:bg-error/10 border border-error/20">
                <p className="text-sm text-error">
                  {error}
                </p>
              </div>
            )}

            {solution && (
              <StepPlayer
                steps={solution.steps}
                activeIndex={activeStepIndex}
                onStepClick={setActiveStepIndex}
                verified={solution.verified}
                verificationDescription={verification?.description}
              />
            )}
          </div>
        </div>

        {/* Right panel: 결과 */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-bg-card dark:bg-surface-card/30 p-8">
          {solution ? (
            <div className="text-center space-y-6 max-w-lg">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  결과
                </p>
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-card border border-border-warm dark:border-white/6">
                  <KaTeX
                    latex={solution.resultLatex}
                    display
                    className="text-2xl"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                시각화 연동은 Phase 5에서 구현됩니다
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500 space-y-2">
              <p className="text-lg">수식을 입력하면</p>
              <p className="text-lg">풀이 결과가 여기에 표시됩니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
