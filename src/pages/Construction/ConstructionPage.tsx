import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Undo2, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { ConstructionCanvas } from "./ConstructionCanvas";
import { useConstructionStore } from "./constructionStore";
import type { ToolType } from "./constructionStore";

type Mode = "free" | "bisector" | "equilateral";

const TOOLS: { id: ToolType; label: string; icon: string }[] = [
  { id: "point", label: "점", icon: "•" },
  { id: "line", label: "직선", icon: "╱" },
  { id: "circle", label: "원", icon: "○" },
];

const GUIDES: { id: Mode; label: string }[] = [
  { id: "free", label: "자유 작도" },
  { id: "bisector", label: "수직이등분선" },
  { id: "equilateral", label: "정삼각형" },
];

export function ConstructionPage() {
  const [mode, setMode] = useState<Mode>("free");
  const { tool, setTool, undo, reset, points, lines, circles } = useConstructionStore();

  const guideSteps: Record<Mode, string[]> = {
    free: ["자유롭게 점, 직선, 원을 그려보세요!"],
    bisector: [
      "① 두 점 A, B를 찍으세요",
      "② 원 도구를 선택하세요",
      "③ A를 중심으로 원을 그리세요 (반지름 > AB/2)",
      "④ B를 중심으로 같은 크기의 원을 그리세요",
      "⑤ 두 원의 교점을 잇는 직선 = 수직이등분선!",
    ],
    equilateral: [
      "① 두 점 A, B를 찍으세요 (한 변)",
      "② 원 도구로 A 중심, B까지 원을 그리세요",
      "③ B 중심, A까지 원을 그리세요",
      "④ 두 원의 위쪽 교점 = 꼭짓점 C",
      "⑤ A-C, B-C 직선을 그리면 정삼각형!",
    ],
  };

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          작도 시뮬레이터
        </Link>
        <div className="flex gap-1.5">
          <button
            onClick={undo}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"
            title="되돌리기"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"
            title="초기화"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex gap-1.5">
        {GUIDES.map((g) => (
          <button
            key={g.id}
            onClick={() => { setMode(g.id); reset(); }}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors",
              mode === g.id
                ? "bg-[#E65100] text-white font-bold"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Tools */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex items-center gap-3">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">도구:</span>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={cn(
              "px-3 py-2.5 sm:py-1.5 rounded-lg text-sm font-bold transition-all",
              tool === t.id
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400",
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          점 {points.length} | 선 {lines.length} | 원 {circles.length}
        </span>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="max-w-2xl mx-auto">
          <ConstructionCanvas />

          {/* Guide steps */}
          <div className="mt-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {guideSteps[mode].map((step, i) => (
              <div key={i} className="mb-0.5">{step}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
