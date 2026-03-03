import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { DiceSimulator } from "./DiceSimulator";
import { LargeNumbersChart } from "./LargeNumbersChart";
import { ProbabilityTree } from "./ProbabilityTree";

type Tab = "dice" | "lln" | "tree";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dice", label: "시뮬레이션", icon: "🎲" },
  { id: "lln", label: "큰 수의 법칙", icon: "📈" },
  { id: "tree", label: "확률 트리", icon: "🌳" },
];

export function ProbabilityLabPage() {
  const [tab, setTab] = useState<Tab>("dice");

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          확률 실험실
        </Link>
      </div>

      {/* Tab bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border-warm dark:border-white/6 flex gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              tab === t.id
                ? "bg-[#1976D2] text-white font-bold"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10",
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto p-4">
          {tab === "dice" && <DiceSimulator />}
          {tab === "lln" && <LargeNumbersChart />}
          {tab === "tree" && <ProbabilityTree />}
        </div>
      </div>
    </div>
  );
}
