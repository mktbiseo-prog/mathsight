import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CalcGraph } from "@/components/CalculusViz/CalcGraph";
import { KaTeX } from "@/components/common/KaTeX";
import { f, fPrime, fDoublePrime, integrate } from "./math";
import { cn } from "@/utils/cn";

type TabId = "tangent" | "derivative" | "integral" | "connection";

const TABS: { id: TabId; label: string }[] = [
  { id: "tangent", label: "접선 & 기울기" },
  { id: "derivative", label: "극값 찾기" },
  { id: "integral", label: "넓이 (적분)" },
  { id: "connection", label: "전체 연결" },
];

function InfoCard({
  title,
  children,
  variant = "blue",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "blue" | "green" | "amber" | "purple";
}) {
  const styles = {
    blue: "bg-primary-light/50 border-primary/20 dark:bg-primary/10 dark:border-primary/20",
    green: "bg-success-light/50 border-success/20 dark:bg-success/10 dark:border-success/20",
    amber: "bg-amber-light/50 border-amber/20 dark:bg-amber/10 dark:border-amber/20",
    purple: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-500/20",
  };
  const titleColors = {
    blue: "text-primary",
    green: "text-success",
    amber: "text-amber",
    purple: "text-purple-700 dark:text-purple-400",
  };
  return (
    <div className={cn("p-4 rounded-2xl border mb-3", styles[variant])}>
      <p className={cn("text-sm font-bold mb-1.5", titleColors[variant])}>{title}</p>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "green" | "amber" | "red";
}) {
  const bg = {
    blue: "bg-[#0072B2]/5",
    green: "bg-[#009E73]/5",
    amber: "bg-[#E69F00]/5",
    red: "bg-error-light/50",
  };
  const text = {
    blue: "text-[#0072B2]",
    green: "text-[#009E73]",
    amber: "text-[#E69F00]",
    red: "text-error",
  };
  return (
    <div className={cn("p-3 rounded-xl text-center", bg[color])}>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className={cn("text-xl font-bold font-mono", text[color])}>{value}</p>
    </div>
  );
}

export function CalculusVizPage() {
  const [tab, setTab] = useState<TabId>("tangent");
  const [dragX, setDragX] = useState(3.5);
  const [integralEnd, setIntegralEnd] = useState(5);

  const slope = fPrime(dragX);
  const area = integrate(0, integralEnd);

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          미적분 시각화
        </Link>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex gap-1 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              tab === t.id
                ? "bg-primary-light dark:bg-primary/15 text-primary font-bold"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5",
            )}
          >
            <span className="mr-1 font-mono">{i + 1}.</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          {/* ====== TAB 1: TANGENT ====== */}
          {tab === "tangent" && (
            <>
              <InfoCard title="파란 점을 좌우로 드래그해 보세요!" variant="blue">
                곡선 위의 점을 움직이면, 그 점에서의 <b>접선(초록 직선)</b>이 함께 움직입니다.
                접선의 <b>기울기</b>가 바로 그 점에서의 <b>미분값(도함수)</b>이에요.
              </InfoCard>

              <div className="bg-white dark:bg-surface-card rounded-2xl p-3 border border-border-warm dark:border-white/6 mb-3">
                <CalcGraph
                  dragX={dragX}
                  onDrag={setDragX}
                  showTangent
                  showDerivative={false}
                  showIntegral={false}
                  integralEnd={5}
                />
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 mb-3">
                <StatBox label="위치 x" value={dragX.toFixed(1)} color="blue" />
                <StatBox label="기울기 f'(x)" value={slope.toFixed(2)} color="green" />
                <StatBox label="함수값 f(x)" value={f(dragX).toFixed(2)} color="amber" />
              </div>

              <InfoCard title="접선이란?" variant="green">
                곡선의 한 점에 살짝 대는 직선이에요. 이 직선의 <b>기울기</b>가 곧 <b>미분(도함수)</b>입니다.
                기울기가 양수면 함수가 올라가는 중이고, 음수면 내려가는 중이에요.
                <br /><br />
                <b>점을 드래그해서 기울기가 0이 되는 지점을 찾아보세요!</b> 접선이 수평이 되는 곳이 극값입니다.
              </InfoCard>
            </>
          )}

          {/* ====== TAB 2: DERIVATIVE / CRITICAL POINTS ====== */}
          {tab === "derivative" && (
            <>
              <InfoCard title="도함수와 극값 — f'(x) = 0 찾기" variant="amber">
                주황 점선이 <b>도함수 f&apos;(x)</b>이고, 이 선이 x축과 만나는 점(f&apos;=0)에서
                세로선이 그어집니다. 바로 그 점이 <b>극댓값</b>과 <b>극솟값</b>이에요.
              </InfoCard>

              <div className="bg-white dark:bg-surface-card rounded-2xl p-3 border border-border-warm dark:border-white/6 mb-3">
                <CalcGraph
                  dragX={dragX}
                  onDrag={setDragX}
                  showTangent
                  showDerivative
                  showIntegral={false}
                  integralEnd={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={cn(
                  "p-3 rounded-xl text-center border",
                  Math.abs(slope) < 0.1
                    ? "bg-success-light border-success dark:bg-success/10 dark:border-success/30"
                    : "bg-bg-card border-border-warm dark:bg-surface-card dark:border-white/6",
                )}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">현재 기울기</p>
                  <p className={cn(
                    "text-2xl font-bold font-mono",
                    Math.abs(slope) < 0.1 ? "text-success" : slope > 0 ? "text-[#0072B2]" : "text-error",
                  )}>
                    {slope.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {Math.abs(slope) < 0.1 ? "극값 근처!" : slope > 0 ? "상승 중" : "하강 중"}
                  </p>
                </div>
                <div className="p-3 rounded-xl text-center bg-bg-card border border-border-warm dark:bg-surface-card dark:border-white/6">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">이계도함수 f&apos;&apos;(x)</p>
                  <p className="text-2xl font-bold font-mono text-gray-800 dark:text-gray-200">
                    {fDoublePrime(dragX).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {fDoublePrime(dragX) < 0 ? "위로 볼록 (극댓값)" : "아래로 볼록 (극솟값)"}
                  </p>
                </div>
              </div>

              <InfoCard title="극값 판정법 요약" variant="blue">
                <div className="space-y-1">
                  <p><b>1단계:</b> f&apos;(x) = 0 인 점 x를 찾는다 (접선이 수평)</p>
                  <p><b>2단계:</b> f&apos;&apos;(x) 값을 확인한다</p>
                  <p className="pl-4">
                    f&apos;&apos;(x) &lt; 0 이면 <span className="text-error font-bold">극댓값</span> (산꼭대기)
                  </p>
                  <p className="pl-4">
                    f&apos;&apos;(x) &gt; 0 이면 <span className="text-success font-bold">극솟값</span> (골짜기)
                  </p>
                </div>
              </InfoCard>
            </>
          )}

          {/* ====== TAB 3: INTEGRAL ====== */}
          {tab === "integral" && (
            <>
              <InfoCard title="적분 = 곡선 아래의 넓이" variant="blue">
                슬라이더를 움직이면 파란 영역(넓이)이 늘어나고 줄어듭니다.
                <b>이 넓이를 구하는 것이 적분</b>이에요.
              </InfoCard>

              <div className="bg-white dark:bg-surface-card rounded-2xl p-3 border border-border-warm dark:border-white/6 mb-3">
                <CalcGraph
                  dragX={integralEnd}
                  onDrag={() => {}}
                  showTangent={false}
                  showDerivative={false}
                  showIntegral
                  integralEnd={integralEnd}
                />
              </div>

              {/* Integral slider */}
              <div className="p-4 rounded-2xl bg-white dark:bg-surface-card border border-border-warm dark:border-white/6 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    적분 범위: 0 → {integralEnd.toFixed(1)}
                  </span>
                  <span className="text-lg font-bold font-mono text-[#0072B2] px-3 py-0.5 bg-primary-light dark:bg-primary/15 rounded-lg">
                    넓이 = {area.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range" min={0.5} max={7} step={0.1}
                  value={integralEnd}
                  onChange={(e) => setIntegralEnd(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  <span>0.5</span>
                  <span>7.0</span>
                </div>
              </div>

              <InfoCard title="리만 합 → 적분" variant="amber">
                그래프 안의 반투명 직사각형들이 보이시죠? 이걸 <b>리만 합(Riemann Sum)</b>이라고 해요.
                직사각형을 점점 더 잘게 쪼개면(무한히 많이), 직사각형들의 넓이 합이 곡선 아래 실제 넓이에 수렴합니다.
                이 극한이 바로 <b>정적분</b>이에요.
                <br /><br />
                이 곡선을 축 중심으로 돌리면 3차원 <b>회전체</b>가 되어 부피를 구할 수 있습니다!
              </InfoCard>
            </>
          )}

          {/* ====== TAB 4: CONNECTION ====== */}
          {tab === "connection" && (
            <>
              <InfoCard title="미적분의 기본 정리 — 모든 것의 연결고리" variant="purple">
                <b>미분(기울기)</b>과 <b>적분(넓이)</b>은 서로 반대 연산이에요!
                기울기에 따라 넓이가 어떻게 바뀌는지 찾는 것이 바로
                <b> 미적분의 기본 정리(Fundamental Theorem of Calculus)</b>입니다.
              </InfoCard>

              <div className="bg-white dark:bg-surface-card rounded-2xl p-3 border border-border-warm dark:border-white/6 mb-3">
                <CalcGraph
                  dragX={dragX}
                  onDrag={setDragX}
                  showTangent
                  showDerivative
                  showIntegral
                  integralEnd={dragX}
                />
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-3 gap-1.5 mb-3">
                <StatBox label="기울기 (미분)" value={slope.toFixed(2)} color="green" />
                <StatBox label="넓이 (적분)" value={integrate(0, dragX).toFixed(2)} color="blue" />
                <StatBox label="함수값" value={f(dragX).toFixed(2)} color="amber" />
              </div>

              {/* Connection diagram */}
              <div className="p-4 rounded-2xl bg-white dark:bg-surface-card border border-border-warm dark:border-white/6 mb-3">
                <p className="text-sm font-bold text-center mb-4 text-gray-800 dark:text-gray-200">전체 연결 구조</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="p-3 rounded-xl text-center bg-primary-light dark:bg-primary/15 border-2 border-[#0072B2]">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">적분</p>
                    <p className="text-sm font-bold text-[#0072B2]">넓이</p>
                    <KaTeX latex="\int f(x)\,dx" className="text-lg" />
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] font-semibold text-[#009E73]">미분 →</span>
                    <span className="text-lg">⇄</span>
                    <span className="text-[11px] font-semibold text-[#0072B2]">← 적분</span>
                  </div>

                  <div className="p-3 rounded-xl text-center bg-success-light/50 dark:bg-success/10 border-2 border-success">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">미분</p>
                    <p className="text-sm font-bold text-success">기울기</p>
                    <KaTeX latex="f'(x)" className="text-lg" />
                  </div>

                  <span className="text-xl text-gray-400">→</span>

                  <div className="p-3 rounded-xl text-center bg-error-light/50 dark:bg-error/10 border-2 border-error">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">f&apos;(x)=0</p>
                    <p className="text-sm font-bold text-error">극값</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">최대·최소</p>
                  </div>
                </div>
              </div>

              <InfoCard title="사용된 함수" variant="blue">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-0.5 bg-[#0072B2] shrink-0 rounded" />
                    <KaTeX latex="f(x) = -0.08x^3 + 0.6x^2 - 0.5x + 1" className="text-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-0.5 bg-[#D55E00] shrink-0 rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg, #D55E00 0 4px, transparent 4px 7px)" }} />
                    <KaTeX latex="f'(x) = -0.24x^2 + 1.2x - 0.5" className="text-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-0.5 bg-[#009E73] shrink-0 rounded" />
                    <span className="text-sm">접선 (Tangent line)</span>
                  </div>
                </div>
              </InfoCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
