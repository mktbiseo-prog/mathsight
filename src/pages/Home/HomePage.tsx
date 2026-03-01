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
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Math<span className="text-neon-blue">Sight</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
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

      {/* Free Explore CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white/10 text-white font-medium hover:bg-gray-800 dark:hover:bg-white/15 transition-colors border border-transparent dark:border-white/10"
        >
          <Sparkles className="w-5 h-5 text-neon-blue" />
          자유 탐구 모드
        </Link>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          3D 공간에서 함수를 자유롭게 탐험해보세요
        </p>
      </div>
    </div>
  );
}
