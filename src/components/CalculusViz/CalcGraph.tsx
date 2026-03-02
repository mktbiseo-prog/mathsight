import { useRef, useCallback } from "react";
import {
  f, fPrime, criticalPoints,
  W, H, PAD, X_MIN, X_MAX, Y_MIN, Y_MAX,
  toSvgX, toSvgY, fromSvgX,
} from "@/pages/CalculusViz/math";

interface CalcGraphProps {
  dragX: number;
  onDrag: (x: number) => void;
  showTangent: boolean;
  showDerivative: boolean;
  showIntegral: boolean;
  integralEnd: number;
}

export function CalcGraph({
  dragX, onDrag, showTangent, showDerivative, showIntegral, integralEnd,
}: CalcGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (W / rect.width);
    const x = Math.max(X_MIN + 0.1, Math.min(X_MAX - 0.1, fromSvgX(sx)));
    onDrag(x);
  }, [onDrag]);

  // Function path
  const steps = 300;
  const curvePath = Array.from({ length: steps + 1 }, (_, i) => {
    const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
    return `${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(f(x)).toFixed(1)}`;
  }).join(" ");

  // Derivative path
  const derivPath = Array.from({ length: steps + 1 }, (_, i) => {
    const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
    return `${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(fPrime(x)).toFixed(1)}`;
  }).join(" ");

  // Integral area
  const intA = 0, intB = integralEnd;
  const areaSteps = 150;
  let areaPath = `M${toSvgX(intA).toFixed(1)},${toSvgY(0).toFixed(1)}`;
  for (let i = 0; i <= areaSteps; i++) {
    const x = intA + (i / areaSteps) * (intB - intA);
    areaPath += ` L${toSvgX(x).toFixed(1)},${toSvgY(Math.max(0, f(x))).toFixed(1)}`;
  }
  areaPath += ` L${toSvgX(intB).toFixed(1)},${toSvgY(0).toFixed(1)} Z`;

  // Tangent line
  const tx = dragX;
  const ty = f(tx);
  const slope = fPrime(tx);
  const tanLen = 2;
  const tX1 = tx - tanLen, tY1 = ty - slope * tanLen;
  const tX2 = tx + tanLen, tY2 = ty + slope * tanLen;

  // Riemann rectangles
  const rectCount = 20;
  const rectW = (intB - intA) / rectCount;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto cursor-crosshair"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => { dragging.current = true; handlePointer(e); e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (dragging.current) handlePointer(e); }}
      onPointerUp={() => { dragging.current = false; }}
    >
      {/* Background */}
      <rect width={W} height={H} fill="#FAFAFA" rx={16} />

      {/* Grid */}
      {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
        const x = X_MIN + i;
        return <line key={`gx${i}`} x1={toSvgX(x)} y1={PAD.t} x2={toSvgX(x)} y2={H - PAD.b} stroke="#D8D0C8" strokeWidth={0.5} opacity={0.5} />;
      })}
      {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
        const y = Y_MIN + i;
        return <line key={`gy${i}`} x1={PAD.l} y1={toSvgY(y)} x2={W - PAD.r} y2={toSvgY(y)} stroke="#D8D0C8" strokeWidth={0.5} opacity={0.5} />;
      })}

      {/* Axes */}
      <line x1={PAD.l} y1={toSvgY(0)} x2={W - PAD.r} y2={toSvgY(0)} stroke="#555555" strokeWidth={1.5} />
      <line x1={toSvgX(0)} y1={PAD.t} x2={toSvgX(0)} y2={H - PAD.b} stroke="#555555" strokeWidth={1.5} />

      {/* Axis labels */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
        <text key={`xl${n}`} x={toSvgX(n)} y={toSvgY(0) + 14} fill="#666666" fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">{n}</text>
      ))}
      {[-1, 1, 2, 3, 4, 5].map(n => (
        <text key={`yl${n}`} x={toSvgX(0) - 8} y={toSvgY(n) + 3} fill="#666666" fontSize={9} textAnchor="end" fontFamily="'JetBrains Mono', monospace">{n}</text>
      ))}

      {/* Integral area */}
      {showIntegral && intB > intA + 0.1 && (
        <path d={areaPath} fill="#0072B2" opacity={0.15} />
      )}

      {/* Riemann rectangles */}
      {showIntegral && intB > intA + 0.1 && Array.from({ length: rectCount }, (_, i) => {
        const rx = intA + i * rectW;
        const ry = Math.max(0, f(rx + rectW / 2));
        return (
          <rect
            key={`rect${i}`}
            x={toSvgX(rx)}
            y={toSvgY(ry)}
            width={Math.max(0, toSvgX(rx + rectW) - toSvgX(rx) - 1)}
            height={Math.max(0, toSvgY(0) - toSvgY(ry))}
            fill="#0072B2"
            opacity={0.08}
            stroke="#0072B2"
            strokeWidth={0.5}
            strokeOpacity={0.3}
          />
        );
      })}

      {/* Derivative curve */}
      {showDerivative && (
        <path d={derivPath} fill="none" stroke="#D55E00" strokeWidth={2} strokeDasharray="6,4" opacity={0.8} />
      )}

      {/* Main function curve */}
      <path d={curvePath} fill="none" stroke="#0072B2" strokeWidth={2.5} strokeLinecap="round" />

      {/* Tangent line */}
      {showTangent && (
        <>
          <line
            x1={toSvgX(tX1)} y1={toSvgY(tY1)}
            x2={toSvgX(tX2)} y2={toSvgY(tY2)}
            stroke="#009E73" strokeWidth={2} opacity={0.8}
          />
          {/* Slope triangle */}
          <line x1={toSvgX(tx)} y1={toSvgY(ty)} x2={toSvgX(tx + 1)} y2={toSvgY(ty)} stroke="#E69F00" strokeWidth={1} strokeDasharray="3,2" />
          <line x1={toSvgX(tx + 1)} y1={toSvgY(ty)} x2={toSvgX(tx + 1)} y2={toSvgY(ty + slope)} stroke="#E69F00" strokeWidth={1} strokeDasharray="3,2" />
          <text x={toSvgX(tx + 1) + 4} y={toSvgY(ty + slope / 2)} fill="#E69F00" fontSize={9} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            기울기={slope.toFixed(2)}
          </text>
        </>
      )}

      {/* Critical points */}
      {showDerivative && criticalPoints.map((cp, i) => (
        cp > X_MIN && cp < X_MAX && (
          <g key={`cp${i}`}>
            <line x1={toSvgX(cp)} y1={PAD.t} x2={toSvgX(cp)} y2={H - PAD.b} stroke="#F44336" strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
            <circle cx={toSvgX(cp)} cy={toSvgY(f(cp))} r={5} fill="#fff" stroke={i === 0 ? "#4CAF50" : "#F44336"} strokeWidth={2} />
            <text x={toSvgX(cp)} y={toSvgY(f(cp)) - 10} fill={i === 0 ? "#4CAF50" : "#F44336"} fontSize={9} textAnchor="middle" fontWeight={700}>
              {i === 0 ? "극솟값" : "극댓값"}
            </text>
            <circle cx={toSvgX(cp)} cy={toSvgY(0)} r={4} fill="#D55E00" opacity={0.6} />
            <text x={toSvgX(cp)} y={toSvgY(0) + 24} fill="#D55E00" fontSize={8} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">
              {"f'=0"}
            </text>
          </g>
        )
      ))}

      {/* Draggable point */}
      {showTangent && (
        <>
          <circle cx={toSvgX(tx)} cy={toSvgY(ty)} r={7} fill="#0072B2" stroke="#fff" strokeWidth={2} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
          <text x={toSvgX(tx)} y={toSvgY(ty) - 14} fill="#0072B2" fontSize={9} textAnchor="middle" fontWeight={700} fontFamily="'JetBrains Mono', monospace">
            ({tx.toFixed(1)}, {ty.toFixed(1)})
          </text>
        </>
      )}

      {/* Legend */}
      <g transform={`translate(${W - PAD.r - 130}, ${PAD.t + 8})`}>
        <rect x={-6} y={-6} width={126} height={showDerivative ? 56 : 36} rx={8} fill="white" opacity={0.9} stroke="#E8E0D8" strokeWidth={0.5} />
        <line x1={0} y1={6} x2={20} y2={6} stroke="#0072B2" strokeWidth={2.5} />
        <text x={26} y={10} fill="#333" fontSize={10}>f(x) 원래 함수</text>
        {showTangent && (
          <>
            <line x1={0} y1={22} x2={20} y2={22} stroke="#009E73" strokeWidth={2} />
            <text x={26} y={26} fill="#333" fontSize={10}>접선 (Tangent)</text>
          </>
        )}
        {showDerivative && (
          <>
            <line x1={0} y1={38} x2={20} y2={38} stroke="#D55E00" strokeWidth={2} strokeDasharray="4,3" />
            <text x={26} y={42} fill="#333" fontSize={10}>{"f'(x) 도함수"}</text>
          </>
        )}
      </g>
    </svg>
  );
}
