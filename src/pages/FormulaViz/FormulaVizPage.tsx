import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { trackEvent } from "@/utils/analytics";
import { SquareExpansion } from "@/components/FormulaViz/SquareExpansion";
import { DiffOfSquares } from "@/components/FormulaViz/DiffOfSquares";
import { CircleArea } from "@/components/FormulaViz/CircleArea";
import { Pythagoras } from "@/components/FormulaViz/Pythagoras";
import { ArithmeticSum } from "@/components/FormulaViz/ArithmeticSum";
import { UnitCircleTrig } from "@/components/FormulaViz/UnitCircleTrig";
import { DerivativeTangent } from "@/components/FormulaViz/DerivativeTangent";
import { IntegralArea } from "@/components/FormulaViz/IntegralArea";
import { QuadraticFormula } from "@/components/FormulaViz/QuadraticFormula";
import { TrigWave } from "@/components/FormulaViz/TrigWave";
import { ExpLogMirror } from "@/components/FormulaViz/ExpLogMirror";
import { SequenceBlocks } from "@/components/FormulaViz/SequenceBlocks";
import { BellCurve } from "@/components/FormulaViz/BellCurve";
import { PascalTriangle } from "@/components/FormulaViz/PascalTriangle";

type Category = "middle" | "high" | "prob";

interface TabDef {
  id: string;
  label: string;
  cat: Category;
  icon: string;
  color: string;
}

const ALL_TABS: TabDef[] = [
  { id: "sq", label: "(a+b)²", cat: "middle", icon: "🟦", color: "#1976D2" },
  { id: "diff", label: "a²−b²", cat: "middle", icon: "✂️", color: "#00796B" },
  { id: "circle", label: "원넓이", cat: "middle", icon: "🔴", color: "#2E7D32" },
  { id: "pyth", label: "피타고라스", cat: "middle", icon: "📐", color: "#7B1FA2" },
  { id: "gauss", label: "등차수열합", cat: "middle", icon: "📊", color: "#E65100" },
  { id: "trig", label: "삼각함수", cat: "high", icon: "🎯", color: "#F57F17" },
  { id: "deriv", label: "미분", cat: "high", icon: "📈", color: "#1976D2" },
  { id: "integ", label: "적분", cat: "high", icon: "📉", color: "#D32F2F" },
  { id: "quad", label: "근의공식", cat: "high", icon: "🧮", color: "#7B1FA2" },
  { id: "trigWave", label: "삼각파동", cat: "high", icon: "🌊", color: "#F57F17" },
  { id: "expLog", label: "지수·로그", cat: "high", icon: "📈", color: "#E65100" },
  { id: "seqBlocks", label: "수열 블록", cat: "high", icon: "🧱", color: "#00796B" },
  { id: "bellCurve", label: "정규분포", cat: "prob", icon: "🔔", color: "#1976D2" },
  { id: "pascal", label: "파스칼", cat: "prob", icon: "△", color: "#7B1FA2" },
];

const COMPONENTS: Record<string, React.FC> = {
  sq: SquareExpansion,
  diff: DiffOfSquares,
  circle: CircleArea,
  pyth: Pythagoras,
  gauss: ArithmeticSum,
  trig: UnitCircleTrig,
  deriv: DerivativeTangent,
  integ: IntegralArea,
  quad: QuadraticFormula,
  trigWave: TrigWave,
  expLog: ExpLogMirror,
  seqBlocks: SequenceBlocks,
  bellCurve: BellCurve,
  pascal: PascalTriangle,
};

export function FormulaVizPage() {
  const [cat, setCat] = useState<Category>("middle");
  const [tab, setTab] = useState("sq");

  const filtered = ALL_TABS.filter((t) => t.cat === cat);
  const ActiveComponent = COMPONENTS[tab];

  function switchCat(c: Category) {
    setCat(c);
    setTab(ALL_TABS.filter((t) => t.cat === c)[0].id);
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          공식 시각화
        </Link>
      </div>

      {/* Category toggle */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6">
        <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-0.5">
          {([
            { id: "middle" as Category, label: "📘 중등" },
            { id: "high" as Category, label: "📕 고등" },
            { id: "prob" as Category, label: "📊 확통" },
          ]).map((c) => (
            <button
              key={c.id}
              onClick={() => switchCat(c.id)}
              className={cn(
                "flex-1 py-2 rounded-md text-sm font-bold transition-all",
                cat === c.id
                  ? "bg-white dark:bg-surface-card text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formula tabs */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex gap-1.5 overflow-x-auto">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); trackEvent("formula_viz_view", { tab: t.id }); }}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              tab === t.id
                ? "text-white font-bold"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10",
            )}
            style={tab === t.id ? { background: t.color } : undefined}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          {ActiveComponent && <ActiveComponent />}

          {/* Connection map */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary-light/50 to-success-light/50 dark:from-primary/10 dark:to-success/10 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">💡 개념 연결 맵:</p>
            (a+b)² → 피타고라스 증명에 사용 → sin²+cos²=1 의 원리<br />
            원의 넓이(부채꼴 펼치기) → 구분구적법 → 적분<br />
            완전제곱식 → 근의 공식 유도 → 이차함수의 꼭짓점<br />
            등차수열 합 → 시그마(Σ) → 적분의 이산 버전
          </div>
        </div>
      </div>
    </div>
  );
}
