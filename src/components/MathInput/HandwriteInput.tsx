import { useRef, useEffect, useState, useCallback, type FormEvent } from "react";
import { Eraser, Search, Calculator } from "lucide-react";
import { cn } from "@/utils/cn";

interface HandwriteInputProps {
  onSubmit: (expr: string) => void;
  disabled?: boolean;
}

export function HandwriteInput({ onSubmit, disabled }: HandwriteInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [recognized, setRecognized] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(false);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#1976D2";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }, []);

  const onStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
  }, [getPos]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawingRef.current) return;
    const { x, y } = getPos(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
    setHasStrokes(true);
  }, [getPos]);

  const onEnd = useCallback(() => {
    drawingRef.current = false;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    setRecognized("");
  };

  const recognize = () => {
    if (!hasStrokes) return;
    setIsRecognizing(true);
    // Simulation: show result after delay
    setTimeout(() => {
      setIsRecognizing(false);
      setRecognized("x^2 - 4 = 0");
    }, 800);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!recognized.trim() || disabled) return;
    onSubmit(recognized.trim());
    clearCanvas();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10">
        <canvas
          ref={canvasRef}
          className="w-full bg-white dark:bg-surface-card cursor-crosshair"
          style={{ height: 160, touchAction: "none" }}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
        {!hasStrokes && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-gray-300 dark:text-gray-600">여기에 수식을 그려보세요</span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={clearCanvas}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors",
            "bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30",
          )}
        >
          <Eraser className="w-3.5 h-3.5" /> 지우기
        </button>
        <button
          type="button"
          onClick={recognize}
          disabled={!hasStrokes || isRecognizing}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors",
            "bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40",
          )}
        >
          <Search className="w-3.5 h-3.5" /> {isRecognizing ? "인식 중..." : "인식하기"}
        </button>
      </div>

      {/* Recognition result — editable */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={recognized}
          onChange={(e) => setRecognized(e.target.value)}
          placeholder="인식 결과가 여기에 표시됩니다 (수정 가능)"
          disabled={disabled}
          className={cn(
            "flex-1 px-3 py-2.5 rounded-xl text-sm font-mono",
            "bg-white dark:bg-surface-card border border-gray-300 dark:border-white/10",
            "text-gray-900 dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
          )}
        />
        <button
          type="submit"
          disabled={disabled || !recognized.trim()}
          className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 transition-colors"
        >
          <Calculator className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
        * 실제 손글씨 인식은 MyScript/Mathpix API 연동 시 활성화됩니다. 현재는 시뮬레이션입니다.
      </p>
    </form>
  );
}
