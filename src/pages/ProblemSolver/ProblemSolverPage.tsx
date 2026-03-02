import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getSubject, getUnit } from "@/content";
import { usePyodide } from "@/hooks/usePyodide";
import { trackEvent } from "@/utils/analytics";
import { useSolverStore } from "@/store/useSolverStore";
import { problemToRequest } from "@/engine/step-generator";
import type { ParsedProblem } from "@/engine/step-generator";
import { getVerificationSummary } from "@/engine/verifier";
import { MathInput } from "@/components/MathInput/MathInput";
import { StepPlayer } from "@/components/StepPlayer/StepPlayer";
import { PyodideLoader } from "@/components/ProblemSolver/PyodideLoader";
import { ExampleProblems } from "@/components/ProblemSolver/ExampleProblems";
import { SolverViz } from "@/components/ProblemSolver/SolverViz";

export function ProblemSolverPage() {
  const { subjectId, unitId } = useParams();
  const navigate = useNavigate();
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
  const clearSolution = useSolverStore((s) => s.clearSolution);

  const handleSubmit = async (parsed: ParsedProblem) => {
    startComputation(parsed);
    trackEvent("problem_solve", { type: parsed.type });
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
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6">
        <button
          onClick={() => {
            if (solution || error) {
              clearSolution();
            } else if (subject && unit) {
              navigate("/");
            } else {
              navigate(-1);
            }
          }}
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {solution || error
            ? "예제 목록"
            : subject && unit
              ? `${subject.name} > ${unit.name}`
              : "뒤로가기"}
        </button>
      </div>

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

        {/* Right panel: 시각화 */}
        <div className="hidden md:flex flex-1 min-h-0 bg-bg-card dark:bg-surface-card/30">
          <SolverViz
            problem={currentProblem}
            solution={solution}
            activeStepIndex={activeStepIndex}
          />
        </div>
      </div>
    </div>
  );
}
