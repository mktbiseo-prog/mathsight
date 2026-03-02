import { useState, type FormEvent } from "react";
import { Delete, Calculator } from "lucide-react";
import { KaTeX } from "@/components/common/KaTeX";
import { cn } from "@/utils/cn";

interface MathKeyboardProps {
  onSubmit: (expr: string) => void;
  disabled?: boolean;
}

interface Token {
  type: "char" | "superStart" | "superEnd" | "fracStart" | "fracNum" | "fracDen" | "sqrtStart" | "sqrtEnd";
  val: string;
}

function buildExpr(tokens: Token[], mode: string): { expr: string; latex: string } {
  let expr = "";
  let latex = "";

  for (const t of tokens) {
    switch (t.type) {
      case "char":
        expr += t.val;
        latex += t.val === "*" ? " \\cdot " : t.val === "pi" ? "\\pi " : t.val + " ";
        break;
      case "superStart":
        expr += "^(";
        latex += "^{";
        break;
      case "superEnd":
        expr += t.val + ")";
        latex += t.val + "}";
        break;
      case "fracStart":
        expr += "(";
        latex += "\\frac{";
        break;
      case "fracNum":
        expr += t.val + ")/(";
        latex += t.val + "}{";
        break;
      case "fracDen":
        expr += t.val + ")";
        latex += t.val + "}";
        break;
      case "sqrtStart":
        expr += "sqrt(";
        latex += "\\sqrt{";
        break;
      case "sqrtEnd":
        expr += t.val + ")";
        latex += t.val + "}";
        break;
    }
  }

  // Add placeholders for open structures
  if (mode === "super") { latex += "\\square}"; }
  if (mode === "frac_num") { latex += "\\square}{\\square}"; }
  if (mode === "frac_den") { latex += "\\square}"; }
  if (mode === "sqrt") { latex += "\\square}"; }

  return { expr: expr.replace(/\s+/g, "").trim(), latex: latex.trim() };
}

export function MathKeyboard({ onSubmit, disabled }: MathKeyboardProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [mode, setMode] = useState<"normal" | "super" | "frac_num" | "frac_den" | "sqrt">("normal");

  const { expr, latex } = buildExpr(tokens, mode);

  const insert = (ch: string) => {
    if (mode === "super") {
      setTokens([...tokens, { type: "superEnd", val: ch }]);
      setMode("normal");
    } else if (mode === "frac_num") {
      setTokens([...tokens, { type: "fracNum", val: ch }]);
      setMode("frac_den");
    } else if (mode === "frac_den") {
      setTokens([...tokens, { type: "fracDen", val: ch }]);
      setMode("normal");
    } else if (mode === "sqrt") {
      setTokens([...tokens, { type: "sqrtEnd", val: ch }]);
      setMode("normal");
    } else {
      setTokens([...tokens, { type: "char", val: ch }]);
    }
  };

  const startSuper = () => {
    setTokens([...tokens, { type: "superStart", val: "" }]);
    setMode("super");
  };

  const startFrac = () => {
    setTokens([...tokens, { type: "fracStart", val: "" }]);
    setMode("frac_num");
  };

  const startSqrt = () => {
    setTokens([...tokens, { type: "sqrtStart", val: "" }]);
    setMode("sqrt");
  };

  const backspace = () => {
    if (tokens.length === 0) return;
    const last = tokens[tokens.length - 1];
    // If we're removing a start token, reset mode
    if (last.type === "superStart" || last.type === "fracStart" || last.type === "sqrtStart") {
      setMode("normal");
    }
    setTokens(tokens.slice(0, -1));
  };

  const clear = () => {
    setTokens([]);
    setMode("normal");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!expr || disabled || mode !== "normal") return;
    onSubmit(expr);
    clear();
  };

  const keyClass = cn(
    "py-3 sm:py-2.5 rounded-lg border border-gray-200 dark:border-white/10",
    "bg-white dark:bg-surface-card text-sm font-medium",
    "hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all",
    "text-gray-700 dark:text-gray-200",
    disabled && "opacity-50 pointer-events-none",
  );

  const specialClass = cn(
    keyClass,
    "bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary font-bold text-xs",
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Display */}
      <div className={cn(
        "min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between",
        "bg-white dark:bg-surface-card border border-gray-300 dark:border-white/10",
      )}>
        <div className="flex-1 overflow-x-auto">
          {latex ? (
            <KaTeX latex={latex} className="text-base" />
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">버튼을 눌러 수식을 조립하세요</span>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || !expr || mode !== "normal"}
          className="ml-2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 disabled:opacity-30"
        >
          <Calculator className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard grid */}
      <div className="grid grid-cols-4 xs:grid-cols-5 gap-1">
        <button type="button" className={keyClass} onClick={() => insert("x")}>x</button>
        <button type="button" className={keyClass} onClick={() => insert("y")}>y</button>
        <button type="button" className={keyClass} onClick={() => insert("1")}>1</button>
        <button type="button" className={keyClass} onClick={() => insert("2")}>2</button>
        <button type="button" className={keyClass} onClick={() => insert("3")}>3</button>

        <button type="button" className={keyClass} onClick={() => insert("+")}>+</button>
        <button type="button" className={keyClass} onClick={() => insert("-")}>−</button>
        <button type="button" className={keyClass} onClick={() => insert("4")}>4</button>
        <button type="button" className={keyClass} onClick={() => insert("5")}>5</button>
        <button type="button" className={keyClass} onClick={() => insert("6")}>6</button>

        <button type="button" className={keyClass} onClick={() => insert("*")}>×</button>
        <button type="button" className={keyClass} onClick={() => insert("(")}>{"("}</button>
        <button type="button" className={keyClass} onClick={() => insert("7")}>7</button>
        <button type="button" className={keyClass} onClick={() => insert("8")}>8</button>
        <button type="button" className={keyClass} onClick={() => insert("9")}>9</button>

        <button type="button" className={specialClass} onClick={startSuper}>x□</button>
        <button type="button" className={specialClass} onClick={startFrac}>□/□</button>
        <button type="button" className={specialClass} onClick={startSqrt}>√□</button>
        <button type="button" className={keyClass} onClick={() => insert(")")}>{")"}</button>
        <button type="button" className={keyClass} onClick={() => insert("0")}>0</button>

        <button type="button" className={specialClass} onClick={() => insert("sin")}>sin</button>
        <button type="button" className={specialClass} onClick={() => insert("cos")}>cos</button>
        <button type="button" className={keyClass} onClick={() => insert("=")}>{"="}</button>
        <button type="button" className={cn(keyClass, "text-gray-400")} onClick={backspace}>
          <Delete className="w-4 h-4 mx-auto" />
        </button>
        <button type="button" className={cn(keyClass, "bg-red-50 dark:bg-red-900/20 text-red-500 font-bold")} onClick={clear}>C</button>
      </div>
    </form>
  );
}
