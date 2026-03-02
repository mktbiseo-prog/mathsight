import { Link } from "react-router";
import {
  Keyboard,
  Grid2X2,
  PenTool,
  MessageSquare,
  ArrowRight,
  Compass,
  BookOpen,
  Calculator,
  Mouse,
  Move,
  ZoomIn,
  RotateCcw,
} from "lucide-react";
import { KaTeX } from "@/components/common/KaTeX";
import { cn } from "@/utils/cn";

/* ── Section wrapper ───────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: typeof Keyboard;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("p-5 rounded-2xl border", color)}>
      <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
        <Icon className="w-5 h-5" />
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── Inline code ───────────────────────────────────────── */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-sm font-mono text-primary">
      {children}
    </code>
  );
}

/* ── Korean pattern row ────────────────────────────────── */

function PatternRow({ korean, expr, latex }: { korean: string; expr: string; latex: string }) {
  return (
    <tr className="border-b border-gray-100 dark:border-white/5 last:border-0">
      <td className="py-2 pr-3 text-sm text-amber-700 dark:text-amber-400 font-medium">
        &ldquo;{korean}&rdquo;
      </td>
      <td className="py-2 px-3">
        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
      </td>
      <td className="py-2 px-3">
        <code className="text-xs font-mono text-gray-500 dark:text-gray-400">{expr}</code>
      </td>
      <td className="py-2 pl-3">
        <KaTeX latex={latex} className="text-sm" />
      </td>
    </tr>
  );
}

/* ── Mode card ─────────────────────────────────────────── */

function ModeCard({
  icon: Icon,
  name,
  description,
  color,
}: {
  icon: typeof Keyboard;
  name: string;
  description: string;
  color: string;
}) {
  return (
    <div className={cn("flex gap-3 p-3 rounded-xl border", color)}>
      <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-white/60 dark:bg-white/10">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────── */

export function HelpPage() {
  return (
    <div className="px-4 py-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100">
          사용 가이드
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          MathSight의 모든 기능을 200% 활용하는 방법
        </p>
      </header>

      {/* ── 1. 수식 입력 4가지 모드 ────────────────────── */}
      <Section
        icon={Keyboard}
        title="수식 입력 방법 (4가지 모드)"
        color="border-primary/20 bg-primary/5 dark:bg-primary/5"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          문제 풀이 페이지에서 수식을 입력할 때 상단 탭으로 4가지 모드를 전환할 수 있습니다.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ModeCard
            icon={Keyboard}
            name="텍스트 모드"
            description="x^2 - 4 = 0 형식으로 직접 타이핑"
            color="border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
          />
          <ModeCard
            icon={Grid2X2}
            name="수학 키보드"
            description="버튼으로 분수·지수·루트를 조립"
            color="border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
          />
          <ModeCard
            icon={PenTool}
            name="손글씨 입력"
            description="캔버스에 수식을 그려서 인식"
            color="border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
          />
          <ModeCard
            icon={MessageSquare}
            name="한국어 입력"
            description="&ldquo;x의 4승 빼기 4 = 0&rdquo; 자연어로 입력"
            color="border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
          />
        </div>
      </Section>

      {/* ── 2. 지원하는 수식 형식 ──────────────────────── */}
      <Section
        icon={Calculator}
        title="지원하는 수식 형식"
        color="border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-900/10"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-green-200 dark:border-green-800/30">
                <th className="pb-2 font-semibold text-green-800 dark:text-green-400">유형</th>
                <th className="pb-2 font-semibold text-green-800 dark:text-green-400">입력 예시</th>
                <th className="pb-2 font-semibold text-green-800 dark:text-green-400">수식</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100 dark:divide-green-800/20">
              <tr>
                <td className="py-2.5 font-medium">방정식</td>
                <td className="py-2.5"><Code>x^2 - 4 = 0</Code></td>
                <td className="py-2.5"><KaTeX latex="x^2 - 4 = 0" className="text-sm" /></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">미분</td>
                <td className="py-2.5"><Code>diff(x^3)</Code></td>
                <td className="py-2.5"><KaTeX latex="\frac{d}{dx}(x^3)" className="text-sm" /></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">정적분</td>
                <td className="py-2.5"><Code>integrate(x^2, 0, 1)</Code></td>
                <td className="py-2.5"><KaTeX latex="\int_0^1 x^2\,dx" className="text-sm" /></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">부정적분</td>
                <td className="py-2.5"><Code>integrate(sin(x))</Code></td>
                <td className="py-2.5"><KaTeX latex="\int \sin(x)\,dx" className="text-sm" /></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">극한</td>
                <td className="py-2.5"><Code>limit(sin(x)/x, x, 0)</Code></td>
                <td className="py-2.5"><KaTeX latex="\lim_{x \to 0} \frac{\sin x}{x}" className="text-sm" /></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">간소화</td>
                <td className="py-2.5"><Code>simplify((x^2-1)/(x-1))</Code></td>
                <td className="py-2.5"><KaTeX latex="\frac{x^2 - 1}{x - 1}" className="text-sm" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 3. 한국어 입력 패턴표 ──────────────────────── */}
      <Section
        icon={MessageSquare}
        title="한국어 입력 패턴표"
        color="border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          한국어 모드에서 자연어로 수식을 입력하면 자동으로 변환됩니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-200 dark:border-amber-800/30">
                <th className="pb-2 text-left text-xs font-semibold text-amber-700 dark:text-amber-400">한국어 입력</th>
                <th className="pb-2" />
                <th className="pb-2 text-left text-xs font-semibold text-amber-700 dark:text-amber-400">변환</th>
                <th className="pb-2 text-left text-xs font-semibold text-amber-700 dark:text-amber-400">수식</th>
              </tr>
            </thead>
            <tbody>
              <PatternRow korean="x의 4승" expr="x^4" latex="x^4" />
              <PatternRow korean="x제곱" expr="x^2" latex="x^2" />
              <PatternRow korean="루트 x" expr="sqrt(x)" latex="\sqrt{x}" />
              <PatternRow korean="x분의 1" expr="(1)/(x)" latex="\frac{1}{x}" />
              <PatternRow korean="x의 4승 빼기 4 = 0" expr="x^4 - 4 = 0" latex="x^4 - 4 = 0" />
              <PatternRow korean="x의 3승 미분" expr="diff(x^3)" latex="\frac{d}{dx}(x^3)" />
              <PatternRow korean="0에서 파이까지 sinx 적분" expr="integrate(sin(x), 0, pi)" latex="\int_0^{\pi} \sin(x)\,dx" />
              <PatternRow korean="x가 0으로 갈 때 극한 sinx 나누기 x" expr="limit(sin(x)/x, x, 0)" latex="\lim_{x \to 0} \frac{\sin x}{x}" />
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
          * 더하기, 빼기, 곱하기, 나누기, 플러스, 마이너스도 인식됩니다.
        </p>
      </Section>

      {/* ── 4. 자유 탐구 모드 ──────────────────────────── */}
      <Section
        icon={Compass}
        title="자유 탐구 모드"
        color="border-violet-200 dark:border-violet-800/30 bg-violet-50/50 dark:bg-violet-900/10"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          함수를 입력하면 실시간 3D 그래프로 시각화합니다.
        </p>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-violet-100 dark:border-violet-800/20">
            <p className="text-sm font-semibold mb-1.5">함수 입력</p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>2D 함수: <Code>sin(x)</Code>, <Code>x^2 - 4</Code>, <Code>log(x)</Code></li>
              <li>3D 곡면: <Code>x^2 + y^2</Code>, <Code>sin(x) * cos(y)</Code> (y 변수 포함 시 자동 3D)</li>
              <li>파라미터: <Code>a*sin(b*x)</Code> → 슬라이더로 a, b 값 조절</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-violet-100 dark:border-violet-800/20">
            <p className="text-sm font-semibold mb-1.5">마우스 / 터치 조작</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-violet-500" />
                <span>왼쪽 드래그: 360도 회전</span>
              </div>
              <div className="flex items-center gap-2">
                <Move className="w-3.5 h-3.5 text-violet-500" />
                <span>우클릭 드래그: 이동</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomIn className="w-3.5 h-3.5 text-violet-500" />
                <span>스크롤: 확대/축소</span>
              </div>
              <div className="flex items-center gap-2">
                <Mouse className="w-3.5 h-3.5 text-violet-500" />
                <span>터치: 한 손가락 회전, 두 손가락 줌/이동</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            자유 탐구 모드 바로가기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Section>

      {/* ── 5. 개념 시각화 & 문제 풀이 ─────────────────── */}
      <Section
        icon={BookOpen}
        title="개념 시각화 & 문제 풀이"
        color="border-blue-200 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10"
      >
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-blue-100 dark:border-blue-800/20">
            <p className="text-sm font-semibold mb-1.5">개념 시각화</p>
            <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>홈 화면에서 단원 선택 (수학II / 미적분 / 기하와 벡터)</li>
              <li>단계별 3D 애니메이션으로 개념 이해</li>
              <li>파라미터 슬라이더로 값을 바꿔가며 실험</li>
            </ol>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-blue-100 dark:border-blue-800/20">
            <p className="text-sm font-semibold mb-1.5">문제 풀이</p>
            <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>수식 입력 (4가지 모드 중 택 1)</li>
              <li>SymPy 엔진이 자동으로 풀이</li>
              <li>단계별 해설 + KaTeX 수식 렌더링</li>
              <li>3D 시각화로 풀이 과정 확인</li>
            </ol>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            개념 탐색하기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/solve"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            문제 풀기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
