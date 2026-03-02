import { Link } from "react-router";
import { Sparkles } from "lucide-react";
import { SUBJECTS } from "@/content";
import { useAppStore } from "@/store/useAppStore";
import { SubjectSection } from "@/components/Home/SubjectSection";

export function HomePage() {
  const { expandedSubject, toggleExpandSubject } = useAppStore();

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Hero */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display text-gray-900 dark:text-gray-100">
          Math<span className="text-primary">Sight</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          수학을 눈으로 보고 이해하다
        </p>
        <p className="text-gray-400 dark:text-gray-500 mt-1 text-sm">
          3D 시각화로 공식의 원리를 직관적으로 체험하세요
        </p>
      </header>

      {/* Subject Cards */}
      <div className="space-y-4">
        {SUBJECTS.map((subject) => (
          <SubjectSection
            key={subject.id}
            subject={subject}
            isExpanded={expandedSubject === subject.id}
            onToggle={() => toggleExpandSubject(subject.id)}
          />
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
          >
            <Sparkles className="w-5 h-5" />
            자유 탐구 모드
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            3D 공간에서 함수를 자유롭게 탐험
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/calculus-viz"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#009E73] text-white font-medium hover:bg-[#00805d] transition-colors shadow-md shadow-[#009E73]/20"
          >
            미적분 인터랙티브
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            접선·극값·적분을 드래그로 체험
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/formula-viz"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7B1FA2] text-white font-medium hover:bg-[#6A1B9A] transition-colors shadow-md shadow-[#7B1FA2]/20"
          >
            🧮 공식 시각 유도
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            공식을 외우지 말고 눈으로 이해
          </p>
        </div>
      </div>
    </div>
  );
}
