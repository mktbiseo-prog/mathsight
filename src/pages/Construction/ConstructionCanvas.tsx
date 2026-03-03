import { useCallback, useRef } from "react";
import { useConstructionStore } from "./constructionStore";

const GRID = 20;
const W = 500;
const H = 400;

function snap(v: number): number {
  return Math.round(v / GRID) * GRID;
}

export function ConstructionCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    tool, points, lines, circles,
    selectedPointId,
    addPoint, addLine, addCircle, selectPoint,
  } = useConstructionStore();

  const getPoint = useCallback((id: string) => points.find((p) => p.id === id), [points]);

  const findNearPoint = useCallback((x: number, y: number, threshold = 12) => {
    for (const p of points) {
      if (Math.hypot(p.x - x, p.y - y) < threshold) return p;
    }
    return null;
  }, [points]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;
    const x = snap(rawX);
    const y = snap(rawY);

    if (tool === "point") {
      addPoint(x, y);
      return;
    }

    const near = findNearPoint(rawX, rawY);

    if (tool === "line") {
      if (!selectedPointId) {
        if (near) {
          selectPoint(near.id);
        } else {
          const id = addPoint(x, y);
          selectPoint(id);
        }
      } else {
        if (near && near.id !== selectedPointId) {
          addLine(selectedPointId, near.id);
        } else if (!near) {
          const id = addPoint(x, y);
          addLine(selectedPointId, id);
        }
      }
      return;
    }

    if (tool === "circle") {
      if (!selectedPointId) {
        if (near) {
          selectPoint(near.id);
        } else {
          const id = addPoint(x, y);
          selectPoint(id);
        }
      } else {
        if (near && near.id !== selectedPointId) {
          addCircle(selectedPointId, near.id);
        } else if (!near) {
          const id = addPoint(x, y);
          addCircle(selectedPointId, id);
        }
      }
      return;
    }
  }, [tool, selectedPointId, addPoint, addLine, addCircle, selectPoint, findNearPoint]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full block bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-white/10"
      style={{ touchAction: "none", cursor: tool === "select" ? "default" : "crosshair" }}
      onClick={handleClick}
    >
      {/* Grid */}
      {Array.from({ length: Math.floor(W / GRID) + 1 }, (_, i) => (
        <line key={`gv-${i}`} x1={i * GRID} y1={0} x2={i * GRID} y2={H} stroke="#e0e0e0" strokeWidth={0.3} className="dark:stroke-white/5" />
      ))}
      {Array.from({ length: Math.floor(H / GRID) + 1 }, (_, i) => (
        <line key={`gh-${i}`} x1={0} y1={i * GRID} x2={W} y2={i * GRID} stroke="#e0e0e0" strokeWidth={0.3} className="dark:stroke-white/5" />
      ))}

      {/* Circles */}
      {circles.map((c) => {
        const center = getPoint(c.center);
        const edge = getPoint(c.edgePoint);
        if (!center || !edge) return null;
        const r = Math.hypot(edge.x - center.x, edge.y - center.y);
        return (
          <circle
            key={c.id}
            cx={center.x}
            cy={center.y}
            r={r}
            fill="none"
            stroke="#1976D2"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Lines */}
      {lines.map((l) => {
        const p1 = getPoint(l.p1);
        const p2 = getPoint(l.p2);
        if (!p1 || !p2) return null;
        // Extend line beyond points
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy);
        if (len < 0.1) return null;
        const ext = 800;
        const x1 = p1.x - (dx / len) * ext;
        const y1 = p1.y - (dy / len) * ext;
        const x2 = p2.x + (dx / len) * ext;
        const y2 = p2.y + (dy / len) * ext;
        return (
          <line
            key={l.id}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#2E7D32"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Points */}
      {points.map((p) => (
        <g key={p.id}>
          <circle
            cx={p.x} cy={p.y} r={5}
            fill={selectedPointId === p.id ? "#D32F2F" : "#333"}
            stroke="#fff"
            strokeWidth={1.5}
          />
        </g>
      ))}

      {/* Selection indicator */}
      {selectedPointId && (() => {
        const sp = getPoint(selectedPointId);
        if (!sp) return null;
        return (
          <circle cx={sp.x} cy={sp.y} r={10} fill="none" stroke="#D32F2F" strokeWidth={1.5} strokeDasharray="4,3" />
        );
      })()}
    </svg>
  );
}
