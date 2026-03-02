import { Link } from "react-router";
import { Sparkles, HelpCircle, Box } from "lucide-react";
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
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 max-w-2xl sm:max-w-none mx-auto">
        <div className="text-center">
          <Link
            to="/explore"
            className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-md shadow-primary/20 text-sm sm:text-base"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            자유 탐구
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2 hidden sm:block">
            3D 공간에서 함수를 자유롭게 탐험
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/calculus-viz"
            className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-[#009E73] text-white font-medium hover:bg-[#00805d] transition-colors shadow-md shadow-[#009E73]/20 text-sm sm:text-base"
          >
            미적분
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2 hidden sm:block">
            접선·극값·적분을 드래그로 체험
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/formula-viz"
            className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-[#7B1FA2] text-white font-medium hover:bg-[#6A1B9A] transition-colors shadow-md shadow-[#7B1FA2]/20 text-sm sm:text-base"
          >
            공식 유도
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2 hidden sm:block">
            공식을 외우지 말고 눈으로 이해
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/geometry-3d"
            className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-[#E65100] text-white font-medium hover:bg-[#BF360C] transition-colors shadow-md shadow-[#E65100]/20 text-sm sm:text-base"
          >
            <Box className="w-4 h-4 sm:w-5 sm:h-5" />
            도형 탐험
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2 hidden sm:block">
            3D 도형·전개도·단면 탐험
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/help"
            className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors shadow-md shadow-gray-600/20 text-sm sm:text-base"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            도움말
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2 hidden sm:block">
            사용법과 입력 방법 안내
          </p>
        </div>
      </div>
    </div>
  );
}
