import { useParams, Link } from "react-router";
import { ArrowLeft, Calculator } from "lucide-react";
import { getSubject, getUnit } from "@/content";

export function ProblemSolverPage() {
  const { subjectId, unitId } = useParams();
  const subject = getSubject(subjectId ?? "");
  const unit = subject ? getUnit(subject.id, unitId ?? "") : undefined;

  if (!subject || !unit) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🔍</p>
          <p className="text-gray-500 dark:text-gray-400">단원을 찾을 수 없습니다</p>
          <Link to="/" className="inline-block text-neon-blue hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {subject.name}
      </Link>

      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <span className={`text-6xl ${unit.color}`}>{unit.icon}</span>
          <h1 className="text-3xl font-bold">{unit.name} — 문제 풀이</h1>
          <p className="text-gray-500 dark:text-gray-400">{unit.description}</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-sm text-gray-500 dark:text-gray-400">
            <Calculator className="w-4 h-4" />
            SymPy 풀이 엔진 — Phase 3에서 구현 예정
          </div>
        </div>
      </div>
    </div>
  );
}
