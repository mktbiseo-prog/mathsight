import { Link } from "react-router";
import { Sparkles, Eye, Grip, BookOpen } from "lucide-react";
import { SUBJECTS } from "@/content";

const FEATURES = [
  {
    icon: Eye,
    title: "3D 시각화",
    desc: "공간 도형과 그래프를 3D로 직접 회전하며 관찰",
    color: "#1976D2",
  },
  {
    icon: Grip,
    title: "실시간 조작",
    desc: "슬라이더와 드래그로 값을 바꾸며 변화를 체험",
    color: "#D55E00",
  },
  {
    icon: BookOpen,
    title: "단계별 풀이",
    desc: "수식을 입력하면 AI가 풀이 과정을 단계별로 시각화",
    color: "#009E73",
  },
];

export function LandingPage() {
  return (
    <div className="px-4 py-12 max-w-4xl mx-auto space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display text-gray-900 dark:text-gray-100">
          수학을 <span className="text-primary">눈으로</span> 이해하다
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          공식을 외우는 대신 3D 시각화로 원리를 직접 체험하세요.
          중등·고등 수학의 핵심 개념을 직관적으로 마스터합니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            <Sparkles className="w-5 h-5" />
            지금 시작하기
          </Link>
          <Link
            to="/formula-viz"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white dark:bg-surface-card text-gray-700 dark:text-gray-200 font-medium border border-border-warm dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            공식 시각화 둘러보기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-2xl bg-white dark:bg-surface-card border border-border-warm dark:border-white/6 space-y-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${f.color}15` }}
            >
              <f.icon className="w-5 h-5" style={{ color: f.color }} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Subjects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          과목별 시각화 콘텐츠
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {SUBJECTS.map((s) => (
            <Link
              key={s.id}
              to={`/concept/${s.id}/${s.units[0]?.id ?? ""}`}
              className="p-5 rounded-2xl bg-white dark:bg-surface-card border border-border-warm dark:border-white/6 hover:shadow-md transition-shadow space-y-2"
            >
              <span className="text-3xl">{s.icon}</span>
              <h3 className="font-bold text-gray-900 dark:text-white">{s.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.description}</p>
              <p className="text-xs text-primary font-medium">
                {s.units.length}개 단원
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 dark:text-gray-500 pt-8 border-t border-border-warm dark:border-white/6">
        <p className="font-display text-lg text-gray-900 dark:text-gray-100 mb-1">
          Math<span className="text-primary">Sight</span>
        </p>
        <p>수학을 눈으로 보고 이해하는 시각화 학습 서비스</p>
      </footer>
    </div>
  );
}
