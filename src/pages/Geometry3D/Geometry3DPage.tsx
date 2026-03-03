import { useState, useMemo } from "react";
import { Link } from "react-router";
import * as THREE from "three";
import { ArrowLeft } from "lucide-react";
import { KaTeX } from "@/components/common/KaTeX";
import { cn } from "@/utils/cn";
import { GeometryScene } from "./GeometryScene";
import type { ShapeConfig } from "./GeometryScene";
import { UnfoldSVG } from "./UnfoldSVG";

/* ── Helpers ──────────────────────────────────────── */

function K(tex: string) {
  return <KaTeX latex={tex} className="text-sm" />;
}

function StatBox({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  const bg = { blue: "bg-blue-50 dark:bg-blue-900/15", green: "bg-green-50 dark:bg-green-900/15", red: "bg-red-50 dark:bg-red-900/15", amber: "bg-amber-50 dark:bg-amber-900/15" }[color] ?? "bg-gray-50 dark:bg-white/5";
  const fg = { blue: "text-blue-700 dark:text-blue-400", green: "text-green-700 dark:text-green-400", red: "text-red-700 dark:text-red-400", amber: "text-amber-700 dark:text-amber-400" }[color] ?? "text-gray-700 dark:text-gray-300";
  return (
    <div className={cn("p-2.5 rounded-xl text-center", bg)}>
      <div className={cn("text-[10px] font-semibold opacity-70", fg)}>{label}</div>
      <div className={cn("text-sm font-bold mt-0.5", fg)}>{value}</div>
    </div>
  );
}

function InfoCard({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const cls = { blue: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30", green: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30", purple: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30", orange: "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30", red: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30" }[color] ?? "";
  return <div className={cn("p-3 rounded-xl border text-xs leading-relaxed text-gray-600 dark:text-gray-400", cls)}>{children}</div>;
}

function CtrlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[60px] shrink-0">{label}</span>
      {children}
    </div>
  );
}

function CtrlBtn({ on, onClick, children }: { on?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
        on ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15",
      )}
    >
      {children}
    </button>
  );
}

/* ── Tabs ─────────────────────────────────────────── */

type TabId = "explore" | "inscribe" | "unfold" | "net" | "cross";

const TABS: { id: TabId; label: string; color: string }[] = [
  { id: "explore", label: "3D 도형", color: "#1976D2" },
  { id: "inscribe", label: "내접·외접", color: "#D32F2F" },
  { id: "unfold", label: "원 펼치기", color: "#2E7D32" },
  { id: "net", label: "전개도", color: "#7B1FA2" },
  { id: "cross", label: "단면", color: "#E65100" },
];

/* ── Shape data ──────────────────────────────────── */

const SHAPES = [
  { id: "tetra", label: "정사면체", icon: "🔺" },
  { id: "cube", label: "정육면체", icon: "🟦" },
  { id: "octa", label: "정팔면체", icon: "💎" },
  { id: "dodeca", label: "정십이면체", icon: "⬡" },
  { id: "icosa", label: "정이십면체", icon: "🔶" },
  { id: "sphere", label: "구", icon: "🔴" },
  { id: "cone", label: "원뿔", icon: "🔻" },
  { id: "cylinder", label: "원기둥", icon: "🛢️" },
] as const;

type ShapeId = (typeof SHAPES)[number]["id"];

function getShapeData(id: ShapeId, r = 1.2) {
  switch (id) {
    case "tetra": return { geo: new THREE.TetrahedronGeometry(r), name: "정사면체", vol: "\\frac{\\sqrt{2}}{12}a^3", surf: "\\sqrt{3}\\,a^2" };
    case "cube": return { geo: new THREE.BoxGeometry(r * 1.3, r * 1.3, r * 1.3), name: "정육면체", vol: "a^3", surf: "6a^2" };
    case "octa": return { geo: new THREE.OctahedronGeometry(r), name: "정팔면체", vol: "\\frac{\\sqrt{2}}{3}a^3", surf: "2\\sqrt{3}\\,a^2" };
    case "dodeca": return { geo: new THREE.DodecahedronGeometry(r), name: "정십이면체", vol: "\\frac{15+7\\sqrt{5}}{4}a^3", surf: "3\\sqrt{25+10\\sqrt{5}}\\,a^2" };
    case "icosa": return { geo: new THREE.IcosahedronGeometry(r), name: "정이십면체", vol: "\\frac{5(3+\\sqrt{5})}{12}a^3", surf: "5\\sqrt{3}\\,a^2" };
    case "sphere": return { geo: new THREE.SphereGeometry(r, 32, 32), name: "구", vol: "\\frac{4}{3}\\pi r^3", surf: "4\\pi r^2" };
    case "cone": return { geo: new THREE.ConeGeometry(r, r * 2, 32), name: "원뿔", vol: "\\frac{1}{3}\\pi r^2 h", surf: "\\pi r(r+l)" };
    case "cylinder": return { geo: new THREE.CylinderGeometry(r * 0.8, r * 0.8, r * 1.8, 32), name: "원기둥", vol: "\\pi r^2 h", surf: "2\\pi r(r+h)" };
  }
}

const INSCRIBE_MODES = [
  { id: "sph_in_cube", label: "정육면체 안에 구" },
  { id: "sph_in_tetra", label: "정사면체 안에 구" },
  { id: "sph_in_cone", label: "원뿔 안에 구" },
  { id: "cyl_in_sph", label: "구 안에 원기둥" },
  { id: "cone_in_sph", label: "구 안에 원뿔" },
] as const;

type InscribeId = (typeof INSCRIBE_MODES)[number]["id"];

/* ── Main page ───────────────────────────────────── */

export function Geometry3DPage() {
  const [tab, setTab] = useState<TabId>("explore");

  // Tab 1: Explore
  const [shapeId, setShapeId] = useState<ShapeId>("cube");
  const [opacity, setOpacity] = useState(0.85);
  const [wireframe, setWireframe] = useState(false);

  // Tab 2: Inscribe
  const [inscribeId, setInscribeId] = useState<InscribeId>("sph_in_cube");

  // Tab 3: Unfold
  const [unfoldR, setUnfoldR] = useState(3);
  const [unfoldSpread, setUnfoldSpread] = useState(0);

  // Tab 4: Net
  const [netShape, setNetShape] = useState<"cube" | "tetra" | "cylinder">("cube");
  const [netOpen, setNetOpen] = useState(0);

  // Tab 5: Cross
  const [crossShape, setCrossShape] = useState<"cube" | "sphere" | "cone" | "cylinder">("cube");
  const [crossHeight, setCrossHeight] = useState(0.5);

  /* ── Build shapes for each tab ── */

  const exploreShapes = useMemo((): ShapeConfig[] => {
    const d = getShapeData(shapeId);
    return [{ geometry: d.geo, color: 0x4488ff, opacity, wireframe, edges: !wireframe, edgeColor: 0x88bbff }];
  }, [shapeId, opacity, wireframe]);

  const inscribeShapes = useMemo((): ShapeConfig[] => {
    const a = 1.5;
    switch (inscribeId) {
      case "sph_in_cube":
        return [
          { geometry: new THREE.BoxGeometry(a * 2, a * 2, a * 2), color: 0x4488ff, opacity: 0.25, edges: true, edgeColor: 0x6699cc },
          { geometry: new THREE.SphereGeometry(a, 32, 32), color: 0xff4444, opacity: 0.6 },
        ];
      case "sph_in_tetra":
        return [
          { geometry: new THREE.TetrahedronGeometry(a * 1.6), color: 0x4488ff, opacity: 0.25, edges: true, edgeColor: 0x6699cc },
          { geometry: new THREE.SphereGeometry(a * 0.45, 32, 32), color: 0xff4444, opacity: 0.6 },
        ];
      case "sph_in_cone": {
        const h = 2.2, r = 1.2;
        const l = Math.sqrt(r * r + h * h);
        const rs = r * h / (r + l);
        return [
          { geometry: new THREE.ConeGeometry(r, h, 32), color: 0x4488ff, opacity: 0.25, edges: true },
          { geometry: new THREE.SphereGeometry(rs, 32, 32), color: 0xff4444, opacity: 0.6, position: [0, rs - h / 2 + h / 3, 0] },
        ];
      }
      case "cyl_in_sph": {
        const R = 1.4;
        const cr = R * Math.sqrt(2 / 3), ch = 2 * R / Math.sqrt(3);
        return [
          { geometry: new THREE.SphereGeometry(R, 32, 32), color: 0xff4444, opacity: 0.2 },
          { geometry: new THREE.CylinderGeometry(cr, cr, ch, 32), color: 0x4488ff, opacity: 0.6, edges: true },
        ];
      }
      case "cone_in_sph": {
        const R = 1.4;
        const ch = 4 * R / 3, cr = R * Math.sqrt(8 / 9);
        return [
          { geometry: new THREE.SphereGeometry(R, 32, 32), color: 0xff4444, opacity: 0.2 },
          { geometry: new THREE.ConeGeometry(cr, ch, 32), color: 0x4488ff, opacity: 0.6, edges: true, position: [0, -R + ch / 2, 0] },
        ];
      }
      default: return [];
    }
  }, [inscribeId]);

  const inscribeStats = useMemo(() => {
    const a = 1.5, R = 1.4, PI = Math.PI;
    switch (inscribeId) {
      case "sph_in_cube": { const ov = (2 * a) ** 3, iv = 4 / 3 * PI * a ** 3; return { outerV: "(2a)^3 = 8a^3", innerV: "\\frac{4}{3}\\pi a^3", ratio: (iv / ov * 100).toFixed(1), desc: "정육면체(한 변=2a) 안에 꼭 맞는 구의 반지름은 a" }; }
      case "sph_in_tetra": return { outerV: "\\frac{\\sqrt{2}}{12}a^3", innerV: "r = \\frac{a}{2\\sqrt{6}}", ratio: "12.3", desc: "정사면체 안의 내접구는 매우 작아요. 꼭짓점이 뾰족할수록 내접구가 작아져요" };
      case "sph_in_cone": { const h = 2.2, r = 1.2, l = Math.sqrt(r * r + h * h), rs = r * h / (r + l); return { outerV: "\\frac{1}{3}\\pi r^2 h", innerV: `r_s = \\frac{rh}{r+l}`, ratio: (4 / 3 * PI * rs ** 3 / (1 / 3 * PI * r * r * h) * 100).toFixed(1), desc: "원뿔 안에 꼭 맞는 구! 원뿔이 뾰족할수록 내접구가 작아져요" }; }
      case "cyl_in_sph": { const cr = R * Math.sqrt(2 / 3), ch = 2 * R / Math.sqrt(3); return { outerV: "\\frac{4}{3}\\pi R^3", innerV: "\\frac{4\\pi R^3}{3\\sqrt{3}}", ratio: (PI * cr * cr * ch / (4 / 3 * PI * R ** 3) * 100).toFixed(1), desc: "구 안에 넣을 수 있는 가장 큰 원기둥!" }; }
      case "cone_in_sph": { const ch = 4 * R / 3, cr = R * Math.sqrt(8 / 9); return { outerV: "\\frac{4}{3}\\pi R^3", innerV: "\\frac{32\\pi R^3}{81}", ratio: (1 / 3 * PI * cr * cr * ch / (4 / 3 * PI * R ** 3) * 100).toFixed(1), desc: "구 안에 넣을 수 있는 최대 원뿔!" }; }
      default: return { outerV: "", innerV: "", ratio: "0", desc: "" };
    }
  }, [inscribeId]);

  const netShapes = useMemo((): ShapeConfig[] => {
    const open = netOpen;
    const s = 0.8;
    const faceMat = (c: number): ShapeConfig => ({ geometry: new THREE.PlaneGeometry(s * 2, s * 2), color: c, opacity: 0.8, doubleSide: true });

    if (netShape === "cube") {
      // Simplified: show cube becoming more transparent as it opens, show flat faces
      if (open < 0.1) {
        return [{ geometry: new THREE.BoxGeometry(s * 2, s * 2, s * 2), color: 0x4488ff, opacity: 0.8, edges: true, edgeColor: 0x88bbff }];
      }
      // Show individual colored faces spread apart
      const spread = open * 2;
      return [
        { ...faceMat(0x4488ff), position: [0, -s - spread * 0.3, 0] },
        { ...faceMat(0x44cc88), position: [0, 0, s + spread * 0.5] },
        { ...faceMat(0xff8844), position: [0, 0, -s - spread * 0.5] },
        { ...faceMat(0xffcc44), position: [-s - spread * 0.5, 0, 0] },
        { ...faceMat(0xff44aa), position: [s + spread * 0.5, 0, 0] },
        { ...faceMat(0xaa44ff), position: [0, s + spread * 0.3, 0] },
      ];
    }
    if (netShape === "tetra") {
      if (open < 0.1) {
        return [{ geometry: new THREE.TetrahedronGeometry(1.2), color: 0x4488ff, opacity: 0.8, edges: true, edgeColor: 0x88bbff }];
      }
      const spread = open * 1.5;
      return [
        { geometry: new THREE.TetrahedronGeometry(0.6), color: 0x4488ff, opacity: 0.6, position: [0, -spread, 0] },
        { geometry: new THREE.TetrahedronGeometry(0.6), color: 0x44cc88, opacity: 0.6, position: [-spread * 0.8, spread * 0.3, 0] },
        { geometry: new THREE.TetrahedronGeometry(0.6), color: 0xff8844, opacity: 0.6, position: [spread * 0.8, spread * 0.3, 0] },
        { geometry: new THREE.TetrahedronGeometry(0.6), color: 0xffcc44, opacity: 0.6, position: [0, spread * 0.3, spread * 0.8] },
      ];
    }
    // cylinder
    if (open < 0.1) {
      return [{ geometry: new THREE.CylinderGeometry(0.7, 0.7, 1.8, 32), color: 0x44cc88, opacity: 0.8, edges: true }];
    }
    const spread = open * 1.5;
    return [
      { geometry: new THREE.CylinderGeometry(0.7, 0.7, 1.8, 32, 1, true), color: 0x44cc88, opacity: 0.7 },
      { geometry: new THREE.CircleGeometry(0.7, 32), color: 0x4488ff, opacity: 0.8, doubleSide: true, position: [0, 0.9 + spread, 0] },
      { geometry: new THREE.CircleGeometry(0.7, 32), color: 0xff8844, opacity: 0.8, doubleSide: true, position: [0, -0.9 - spread, 0] },
    ];
  }, [netShape, netOpen]);

  const crossShapes = useMemo((): ShapeConfig[] => {
    const size = 1.3, h = crossHeight;
    const shapes: ShapeConfig[] = [];

    if (crossShape === "cube") {
      shapes.push({ geometry: new THREE.BoxGeometry(size * 2, size * 2, size * 2), color: 0x4488ff, opacity: 0.2, edges: true, edgeColor: 0x6699cc });
      const planeY = -size + h * size * 2;
      shapes.push({ geometry: new THREE.PlaneGeometry(size * 2.2, size * 2.2), color: 0xff4444, opacity: 0.5, doubleSide: true, position: [0, planeY, 0] });
    } else if (crossShape === "sphere") {
      shapes.push({ geometry: new THREE.SphereGeometry(size, 32, 32), color: 0x4488ff, opacity: 0.2 });
      const planeY = -size + h * size * 2;
      const cr = Math.sqrt(Math.max(0, size * size - planeY * planeY));
      if (cr > 0.01) shapes.push({ geometry: new THREE.CircleGeometry(cr, 32), color: 0xff4444, opacity: 0.6, doubleSide: true, position: [0, planeY, 0] });
    } else if (crossShape === "cone") {
      shapes.push({ geometry: new THREE.ConeGeometry(size, size * 2.5, 32), color: 0x4488ff, opacity: 0.2, edges: true });
      const cH = size * 2.5;
      const planeY = -cH / 2 + h * cH;
      const cr = size * (1 - h);
      if (cr > 0.01) shapes.push({ geometry: new THREE.CircleGeometry(cr, 32), color: 0xff4444, opacity: 0.6, doubleSide: true, position: [0, planeY, 0] });
    } else {
      const cylR = size * 0.8;
      shapes.push({ geometry: new THREE.CylinderGeometry(cylR, cylR, size * 2, 32), color: 0x4488ff, opacity: 0.2, edges: true });
      const planeY = -size + h * size * 2;
      shapes.push({ geometry: new THREE.CircleGeometry(cylR, 32), color: 0xff4444, opacity: 0.6, doubleSide: true, position: [0, planeY, 0] });
    }
    return shapes;
  }, [crossShape, crossHeight]);

  const crossInfo = useMemo(() => {
    const size = 1.3, h = crossHeight;
    if (crossShape === "cube") return { shape2D: "정사각형", desc: "정육면체를 수평으로 자르면 항상 정사각형! 어디를 잘라도 같은 모양이에요." };
    if (crossShape === "sphere") { const py = -size + h * size * 2; const cr = Math.sqrt(Math.max(0, size * size - py * py)); return { shape2D: `원 (r=${cr.toFixed(2)})`, desc: `구를 자르면 항상 원! 가운데를 자를수록 원이 커져요. 현재 단면 반지름: ${cr.toFixed(2)}` }; }
    if (crossShape === "cone") { const cr = size * (1 - h); return { shape2D: `원 (r=${cr.toFixed(2)})`, desc: `원뿔을 수평으로 자르면 원! 위로 갈수록 작아져요. 비스듬히 자르면 타원, 포물선, 쌍곡선이 됩니다(원뿔곡선!)` }; }
    return { shape2D: `원 (r=${(size * 0.8).toFixed(2)})`, desc: "원기둥을 수평으로 자르면 항상 같은 크기의 원! 어디를 잘라도 동일해요." };
  }, [crossShape, crossHeight]);

  const shapeData = getShapeData(shapeId);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-border-warm dark:border-white/6 bg-white/90 dark:bg-surface-dark/90 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-bold text-gray-800 dark:text-gray-200">📐 도형 탐험 3D</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-border-warm dark:border-white/6">
        <div className="max-w-2xl mx-auto flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                tab === t.id ? "text-white shadow-sm" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400",
              )}
              style={tab === t.id ? { background: t.color } : undefined}
            >
              {i + 1}. {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-3 sm:p-4 space-y-3">

          {/* ── Tab 1: 3D 도형 탐험 ── */}
          {tab === "explore" && (
            <>
              <GeometryScene shapes={exploreShapes} />
              <div className="p-3 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 space-y-2.5">
                <div className="flex gap-1.5 flex-wrap">
                  {SHAPES.map((s) => (
                    <CtrlBtn key={s.id} on={shapeId === s.id} onClick={() => setShapeId(s.id)}>
                      {s.icon} {s.label}
                    </CtrlBtn>
                  ))}
                </div>
                <CtrlRow label="투명도">
                  <input type="range" className="flex-1 accent-primary" min={0.2} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(+e.target.value)} />
                  <span className="text-xs font-bold text-primary w-8 text-right">{opacity.toFixed(2)}</span>
                </CtrlRow>
                <CtrlRow label="와이어프레임">
                  <CtrlBtn on={wireframe} onClick={() => setWireframe(!wireframe)}>{wireframe ? "ON" : "OFF"}</CtrlBtn>
                </CtrlRow>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatBox label="부피 (V)" value={K(shapeData.vol)} color="blue" />
                <StatBox label="겉넓이 (S)" value={K(shapeData.surf)} color="green" />
              </div>
              <InfoCard>
                <b>{shapeData.name}</b>을 직접 돌려보세요! 드래그로 회전, 스크롤로 확대/축소. 투명도를 낮추면 내부가 보여요.
              </InfoCard>
            </>
          )}

          {/* ── Tab 2: 내접·외접 ── */}
          {tab === "inscribe" && (
            <>
              <GeometryScene shapes={inscribeShapes} />
              <div className="p-3 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10">
                <div className="flex gap-1.5 flex-wrap">
                  {INSCRIBE_MODES.map((m) => (
                    <CtrlBtn key={m.id} on={inscribeId === m.id} onClick={() => setInscribeId(m.id)}>
                      {m.label}
                    </CtrlBtn>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatBox label="외부 V" value={K(inscribeStats.outerV)} color="blue" />
                <StatBox label="내부 V" value={K(inscribeStats.innerV)} color="red" />
                <StatBox label="비율" value={`${inscribeStats.ratio}%`} color="green" />
              </div>
              <InfoCard color="red">
                {inscribeStats.desc}. 부피의 <b>{inscribeStats.ratio}%</b>를 차지해요!
              </InfoCard>
            </>
          )}

          {/* ── Tab 3: 원 펼치기 ── */}
          {tab === "unfold" && (
            <>
              <UnfoldSVG radius={unfoldR} spread={unfoldSpread} />
              <div className="p-3 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 space-y-2.5">
                <CtrlRow label="반지름 r">
                  <input type="range" className="flex-1 accent-primary" min={1} max={5} step={0.1} value={unfoldR} onChange={(e) => setUnfoldR(+e.target.value)} />
                  <span className="text-xs font-bold text-primary w-8 text-right">{unfoldR.toFixed(1)}</span>
                </CtrlRow>
                <CtrlRow label="펼치기">
                  <input type="range" className="flex-1 accent-green-600" min={0} max={1} step={0.02} value={unfoldSpread} onChange={(e) => setUnfoldSpread(+e.target.value)} />
                  <span className="text-xs font-bold text-green-600 w-8 text-right">{Math.round(unfoldSpread * 100)}%</span>
                </CtrlRow>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatBox label="반지름" value={unfoldR.toFixed(1)} color="blue" />
                <StatBox label="둘레" value={(2 * Math.PI * unfoldR).toFixed(2)} color="red" />
                <StatBox label="넓이" value={(Math.PI * unfoldR * unfoldR).toFixed(2)} color="green" />
              </div>
              <InfoCard color="green">
                <b>원의 둘레를 일자로 펼치면?</b> 길이가 2πr인 직선이 돼요!<br />
                이걸 반으로 접어서(πr) 높이 r인 직사각형을 만들면 → 넓이 = πr² (원의 넓이!)
                {unfoldSpread > 0.6 && <><br /><b>핵심:</b> 둘레 ÷ 지름 = 항상 π! 이게 원주율의 정의예요.</>}
              </InfoCard>
            </>
          )}

          {/* ── Tab 4: 전개도 ── */}
          {tab === "net" && (
            <>
              <GeometryScene shapes={netShapes} />
              <div className="p-3 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 space-y-2.5">
                <div className="flex gap-1.5">
                  <CtrlBtn on={netShape === "cube"} onClick={() => { setNetShape("cube"); setNetOpen(0); }}>🟦 정육면체</CtrlBtn>
                  <CtrlBtn on={netShape === "tetra"} onClick={() => { setNetShape("tetra"); setNetOpen(0); }}>🔺 정사면체</CtrlBtn>
                  <CtrlBtn on={netShape === "cylinder"} onClick={() => { setNetShape("cylinder"); setNetOpen(0); }}>🛢️ 원기둥</CtrlBtn>
                </div>
                <CtrlRow label="펼치기">
                  <input type="range" className="flex-1 accent-purple-600" min={0} max={1} step={0.02} value={netOpen} onChange={(e) => setNetOpen(+e.target.value)} />
                  <span className="text-xs font-bold text-purple-600 w-8 text-right">{Math.round(netOpen * 100)}%</span>
                </CtrlRow>
              </div>
              <InfoCard color="purple">
                {netShape === "cube" && <><b>📦 정육면체 전개도</b> — 6개의 면이 어떻게 접혀서 상자가 되는지 직접 봐보세요! 겉넓이 = 6면 × {K("a^2")} = {K("6a^2")}</>}
                {netShape === "tetra" && <><b>🔺 정사면체 전개도</b> — 4개의 정삼각형으로 이루어져 있어요. 한 면을 기준으로 3면이 접히면 피라미드!</>}
                {netShape === "cylinder" && <><b>🛢️ 원기둥 전개도</b> — 옆면을 펼치면 직사각형! 가로 = {K("2\\pi r")} (원둘레), 세로 = h. 겉넓이 = {K("2\\pi r^2 + 2\\pi rh")}</>}
              </InfoCard>
            </>
          )}

          {/* ── Tab 5: 단면 자르기 ── */}
          {tab === "cross" && (
            <>
              <GeometryScene shapes={crossShapes} />
              <div className="p-3 rounded-xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 space-y-2.5">
                <div className="flex gap-1.5 flex-wrap">
                  <CtrlBtn on={crossShape === "cube"} onClick={() => setCrossShape("cube")}>🟦 정육면체</CtrlBtn>
                  <CtrlBtn on={crossShape === "sphere"} onClick={() => setCrossShape("sphere")}>🔴 구</CtrlBtn>
                  <CtrlBtn on={crossShape === "cone"} onClick={() => setCrossShape("cone")}>🔻 원뿔</CtrlBtn>
                  <CtrlBtn on={crossShape === "cylinder"} onClick={() => setCrossShape("cylinder")}>🛢️ 원기둥</CtrlBtn>
                </div>
                <CtrlRow label="자르는 높이">
                  <input type="range" className="flex-1 accent-orange-600" min={0.05} max={0.95} step={0.02} value={crossHeight} onChange={(e) => setCrossHeight(+e.target.value)} />
                  <span className="text-xs font-bold text-orange-600 w-8 text-right">{Math.round(crossHeight * 100)}%</span>
                </CtrlRow>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatBox label="자른 높이" value={`${Math.round(crossHeight * 100)}%`} color="amber" />
                <StatBox label="단면 모양" value={crossInfo.shape2D} color="red" />
              </div>
              <InfoCard color="orange">{crossInfo.desc}</InfoCard>
            </>
          )}

          {/* Connection note */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            <b className="text-gray-700 dark:text-gray-300">도형 개념 연결:</b><br />
            원 펼치기 → 원의 넓이 πr² 유도 → 적분(구분구적법)의 원리<br />
            내접·외접 → 최적화 문제 → 미분으로 최대/최소 구하기<br />
            단면 자르기 → 원뿔곡선(타원, 포물선, 쌍곡선) → 이차곡선<br />
            전개도 → 겉넓이 계산 → 표면적분
          </div>
        </div>
      </div>
    </div>
  );
}
