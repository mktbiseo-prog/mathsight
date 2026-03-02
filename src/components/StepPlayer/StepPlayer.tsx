import { CheckCircle, XCircle } from "lucide-react";
import type { SolutionStep } from "@/engine/sympy-bridge";
import { KaTeX } from "@/components/common/KaTeX";
import { cn } from "@/utils/cn";

interface StepPlayerProps {
  steps: SolutionStep[];
  activeIndex: number;
  onStepClick: (index: number) => void;
  verified: boolean;
  verificationDescription?: string;
}

export function StepPlayer({
  steps,
  activeIndex,
  onStepClick,
  verified,
  verificationDescription,
}: StepPlayerProps) {
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <button
          key={i}
          onClick={() => onStepClick(i)}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg transition-all",
            "border-l-2",
            activeIndex === i
              ? "border-l-primary bg-primary-light dark:bg-primary/10"
              : "border-l-transparent hover:bg-gray-50 dark:hover:bg-white/5",
          )}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                activeIndex === i
                  ? "bg-primary/15 text-primary"
                  : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400",
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {step.label}
              </p>
              <div className="overflow-x-auto">
                <KaTeX latex={step.latex} display className="text-sm" />
              </div>
            </div>
          </div>
        </button>
      ))}

      {/* Verification badge */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg mt-2",
          verified
            ? "bg-success-light dark:bg-success/10"
            : "bg-error-light dark:bg-error/10",
        )}
      >
        {verified ? (
          <CheckCircle className="w-5 h-5 text-success shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-error shrink-0" />
        )}
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              verified ? "text-success" : "text-error",
            )}
          >
            {verified ? "검증 완료" : "검증 실패"}
          </p>
          {verificationDescription && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {verificationDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
