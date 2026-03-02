import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getSubject, getUnit, getConceptData } from "@/content";
import { useConceptStore } from "@/store/useConceptStore";
import { ConceptScene } from "@/components/ConceptView/ConceptScene";
import { ConceptPlayer } from "@/components/ConceptView/ConceptPlayer";
import { ConceptParams } from "@/components/ConceptView/ConceptParams";

export function ConceptViewPage() {
  const { subjectId, unitId } = useParams();
  const subject = getSubject(subjectId ?? "");
  const unit = subject ? getUnit(subject.id, unitId ?? "") : undefined;
  const concept = unitId ? getConceptData(unitId) : undefined;

  const activeStep = useConceptStore((s) => s.activeStep);
  const reset = useConceptStore((s) => s.reset);
  const resetParams = useConceptStore((s) => s.resetParams);

  // Reset state when unit changes
  useEffect(() => {
    reset();
  }, [unitId, reset]);

  // Initialize params when step changes
  useEffect(() => {
    if (!concept) return;
    const step = concept.steps[activeStep];
    if (!step?.params) {
      resetParams({});
      return;
    }
    const defaults: Record<string, number> = {};
    for (const p of step.params) {
      defaults[p.name] = p.default;
    }
    resetParams(defaults);
  }, [activeStep, concept, resetParams]);

  if (!subject || !unit) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🔍</p>
          <p className="text-gray-500 dark:text-gray-400">단원을 찾을 수 없습니다</p>
          <Link to="/" className="inline-block text-primary hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">{unit.icon}</p>
          <h1 className="text-2xl font-bold">{unit.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            이 단원의 시각화 데이터가 준비 중입니다.
          </p>
          <Link to="/" className="inline-block text-primary hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = concept.steps[activeStep];
  const currentParams = currentStep?.params ?? [];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {subject.name} &gt; {unit.name}
        </Link>
        <Link
          to={`/solve/${subjectId}/${unitId}`}
          className="text-xs px-3 py-1 rounded-md bg-primary-light dark:bg-white/5 text-primary dark:text-gray-400 hover:bg-primary/10 dark:hover:bg-white/10 transition-colors"
        >
          문제 풀기
        </Link>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left panel: step player */}
        <div className="w-full md:w-[320px] border-r border-border-warm dark:border-white/6 flex flex-col min-h-0">
          <ConceptPlayer concept={concept} />
        </div>

        {/* Right panel: 3D visualization */}
        <div className="hidden md:flex flex-1 relative">
          <ConceptScene concept={concept} />
          <ConceptParams paramDefs={currentParams} />
        </div>
      </div>
    </div>
  );
}
