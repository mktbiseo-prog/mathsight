import { cn } from "@/utils/cn";

/** Visualization-specific SVG colors (pedagogically meaningful) */
export const VC = {
  blue: "#1976D2",
  blueD: "#0D47A1",
  green: "#2E7D32",
  red: "#D32F2F",
  amber: "#F57F17",
  purple: "#7B1FA2",
  teal: "#00796B",
  orange: "#E65100",
  text: "#212121",
  textS: "#757575",
};

// --- Info box ---
type InfoVariant = "blue" | "green" | "teal" | "purple" | "amber" | "orange" | "red";

const infoBg: Record<InfoVariant, string> = {
  blue: "bg-primary-light/60 dark:bg-primary/10",
  green: "bg-success-light/60 dark:bg-success/10",
  teal: "bg-teal-50 dark:bg-teal-900/20",
  purple: "bg-purple-50 dark:bg-purple-900/20",
  amber: "bg-amber-light/60 dark:bg-amber/10",
  orange: "bg-orange-50 dark:bg-orange-900/20",
  red: "bg-error-light/60 dark:bg-error/10",
};

export function Info({ variant, children }: { variant: InfoVariant; children: React.ReactNode }) {
  return (
    <div className={cn("px-3.5 py-2.5 rounded-xl mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300", infoBg[variant])}>
      {children}
    </div>
  );
}

// --- Step navigation ---
export function StepNav({ step, setStep, max }: { step: number; setStep: (s: number) => void; max: number }) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => setStep(Math.max(0, step - 1))}
        disabled={step === 0}
        className={cn(
          "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors",
          step === 0
            ? "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-default"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer",
        )}
      >
        &larr; 이전
      </button>
      <button
        onClick={() => setStep(Math.min(max, step + 1))}
        disabled={step === max}
        className={cn(
          "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors",
          step === max
            ? "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-default"
            : "bg-primary text-white hover:bg-primary-dark cursor-pointer",
        )}
      >
        다음 &rarr;
      </button>
    </div>
  );
}

// --- SVG card wrapper ---
export function SvgCard({ viewBox, children }: { viewBox: string; children: React.ReactNode }) {
  return (
    <svg viewBox={viewBox} className="w-full h-auto rounded-xl bg-white dark:bg-surface-card">
      {children}
    </svg>
  );
}

// --- Slider ---
export function VizSlider({
  label,
  value,
  min,
  max,
  step,
  color,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  color?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-1">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
    </div>
  );
}
