import { useState } from "react";

interface TreeNode {
  label: string;
  prob: number;
  children?: TreeNode[];
}

export function ProbabilityTree() {
  const [scenario, setScenario] = useState<"bag" | "weather">("bag");

  const trees: Record<string, TreeNode> = {
    bag: {
      label: "주머니",
      prob: 1,
      children: [
        {
          label: "빨강 (3/5)",
          prob: 3 / 5,
          children: [
            { label: "빨강 (2/4)", prob: 2 / 4 },
            { label: "파랑 (2/4)", prob: 2 / 4 },
          ],
        },
        {
          label: "파랑 (2/5)",
          prob: 2 / 5,
          children: [
            { label: "빨강 (3/4)", prob: 3 / 4 },
            { label: "파랑 (1/4)", prob: 1 / 4 },
          ],
        },
      ],
    },
    weather: {
      label: "날씨",
      prob: 1,
      children: [
        {
          label: "맑음 (0.7)",
          prob: 0.7,
          children: [
            { label: "소풍O (0.9)", prob: 0.9 },
            { label: "소풍X (0.1)", prob: 0.1 },
          ],
        },
        {
          label: "비 (0.3)",
          prob: 0.3,
          children: [
            { label: "소풍O (0.2)", prob: 0.2 },
            { label: "소풍X (0.8)", prob: 0.8 },
          ],
        },
      ],
    },
  };

  const tree = trees[scenario];
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const w = 460, h = 280;
  const levelX = [60, 200, 370];
  const colors = ["#1976D2", "#2E7D32", "#D32F2F", "#F57F17", "#7B1FA2"];

  function renderNode(node: TreeNode, x: number, y: number, level: number, parentY: number, path: string): React.ReactElement[] {
    const elements: React.ReactElement[] = [];
    const isHl = highlighted === path;

    // Connection line from parent
    if (level > 0) {
      elements.push(
        <line
          key={`line-${path}`}
          x1={levelX[level - 1] + 10}
          y1={parentY}
          x2={x - 10}
          y2={y}
          stroke={isHl ? "#D32F2F" : "#ccc"}
          strokeWidth={isHl ? 2.5 : 1}
        />,
      );
      // Probability on edge
      elements.push(
        <text
          key={`prob-${path}`}
          x={(levelX[level - 1] + x) / 2}
          y={y < parentY ? (parentY + y) / 2 - 4 : (parentY + y) / 2 + 12}
          textAnchor="middle"
          fontSize={10}
          fill={isHl ? "#D32F2F" : "#999"}
          fontWeight={isHl ? 700 : 400}
        >
          {node.prob < 1 ? node.prob.toFixed(2) : ""}
        </text>,
      );
    }

    // Node
    elements.push(
      <g
        key={`node-${path}`}
        onMouseEnter={() => setHighlighted(path)}
        onMouseLeave={() => setHighlighted(null)}
        style={{ cursor: "pointer" }}
      >
        <rect x={x - 40} y={y - 12} width={80} height={24} rx={8}
          fill={isHl ? "#FFF3E0" : "#f5f5f5"} stroke={colors[level % colors.length]}
          strokeWidth={isHl ? 2 : 1} />
        <text x={x} y={y + 4} textAnchor="middle" fontSize={10}
          fill={colors[level % colors.length]} fontWeight={600}>
          {node.label}
        </text>
      </g>,
    );

    // Children
    if (node.children) {
      const childCount = node.children.length;
      const spacing = Math.min(80, 200 / childCount);
      const startY = y - ((childCount - 1) * spacing) / 2;

      node.children.forEach((child, i) => {
        const childY = startY + i * spacing;
        elements.push(
          ...renderNode(child, levelX[level + 1], childY, level + 1, y, `${path}-${i}`),
        );
      });
    }

    return elements;
  }

  // Calculate total probabilities for leaf paths
  const leafProbs: { path: string; prob: number }[] = [];
  if (tree.children) {
    tree.children.forEach((c1) => {
      if (c1.children) {
        c1.children.forEach((c2) => {
          leafProbs.push({
            path: `${c1.label} → ${c2.label}`,
            prob: c1.prob * c2.prob,
          });
        });
      }
    });
  }

  return (
    <div>
      {/* Scenario toggle */}
      <div className="flex gap-2 mb-3">
        {([
          { id: "bag" as const, label: "🎒 공 뽑기" },
          { id: "weather" as const, label: "🌤️ 날씨 & 소풍" },
        ]).map((s) => (
          <button
            key={s.id}
            onClick={() => { setScenario(s.id); setHighlighted(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              scenario === s.id
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Tree diagram */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-white/10 p-2 overflow-hidden">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full block">
          {renderNode(tree, levelX[0], h / 2, 0, h / 2, "root")}
        </svg>
      </div>

      {/* Probability table */}
      <div className="mt-3 bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-white/10 p-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">경로별 확률</p>
        <div className="space-y-1">
          {leafProbs.map((lp, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">{lp.path}</span>
              <span className="font-bold text-primary">{(lp.prob * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between text-xs font-bold">
          <span className="text-gray-700 dark:text-gray-300">전체 확률 합</span>
          <span className="text-green-600">{(leafProbs.reduce((s, lp) => s + lp.prob, 0) * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <b>조건부 확률:</b> 트리의 각 가지 확률을 곱하면 해당 경로의 전체 확률이 됩니다. 모든 경로의 확률 합 = 1 (100%)
      </div>
    </div>
  );
}
