import type { ParsedProblem } from "@/engine/step-generator";
import { parseProblemInput } from "@/engine/step-generator";

const EXAMPLES = [
  { label: "이차방정식", input: "x^2 - 5*x + 6 = 0", emoji: "🔢" },
  { label: "미분", input: "diff(x^3 + 2*x^2 - x)", emoji: "📐" },
  { label: "부정적분", input: "integrate(x^2 + 3*x)", emoji: "∫" },
  { label: "정적분", input: "integrate(x^2, 0, 1)", emoji: "📊" },
  { label: "극한", input: "limit(sin(x)/x, x, 0)", emoji: "∞" },
  { label: "간소화", input: "simplify((x^2-1)/(x-1))", emoji: "✨" },
];

interface ExampleProblemsProps {
  onSelect: (problem: ParsedProblem) => void;
}

export function ExampleProblems({ onSelect }: ExampleProblemsProps) {
  const handleClick = (input: string) => {
    const result = parseProblemInput(input);
    if ("error" in result) return;
    onSelect(result);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        예제 문제
      </p>
      <div className="grid grid-cols-2 gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.input}
            onClick={() => handleClick(ex.input)}
            className="text-left px-3 py-2.5 rounded-lg border border-border-warm dark:border-white/6 hover:bg-primary-light/50 dark:hover:bg-surface-hover transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{ex.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {ex.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                  {ex.input}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
