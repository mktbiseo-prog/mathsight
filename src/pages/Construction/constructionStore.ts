import { create } from "zustand";

export type ToolType = "point" | "line" | "circle" | "select";

export interface CPoint {
  id: string;
  x: number;
  y: number;
}

export interface CLine {
  id: string;
  p1: string; // point id
  p2: string;
}

export interface CCircle {
  id: string;
  center: string; // point id
  edgePoint: string; // point id (defines radius)
}

interface ConstructionState {
  tool: ToolType;
  points: CPoint[];
  lines: CLine[];
  circles: CCircle[];
  selectedPointId: string | null;
  undoStack: { points: CPoint[]; lines: CLine[]; circles: CCircle[] }[];

  setTool: (tool: ToolType) => void;
  addPoint: (x: number, y: number) => string;
  addLine: (p1: string, p2: string) => void;
  addCircle: (center: string, edge: string) => void;
  selectPoint: (id: string | null) => void;
  undo: () => void;
  reset: () => void;
}

let nextId = 1;
function genId(prefix: string) {
  return `${prefix}-${nextId++}`;
}

export const useConstructionStore = create<ConstructionState>((set, get) => ({
  tool: "point",
  points: [],
  lines: [],
  circles: [],
  selectedPointId: null,
  undoStack: [],

  setTool: (tool) => set({ tool, selectedPointId: null }),

  addPoint: (x, y) => {
    const state = get();
    const id = genId("pt");
    set({
      undoStack: [...state.undoStack, { points: state.points, lines: state.lines, circles: state.circles }],
      points: [...state.points, { id, x, y }],
    });
    return id;
  },

  addLine: (p1, p2) => {
    const state = get();
    set({
      undoStack: [...state.undoStack, { points: state.points, lines: state.lines, circles: state.circles }],
      lines: [...state.lines, { id: genId("ln"), p1, p2 }],
      selectedPointId: null,
    });
  },

  addCircle: (center, edge) => {
    const state = get();
    set({
      undoStack: [...state.undoStack, { points: state.points, lines: state.lines, circles: state.circles }],
      circles: [...state.circles, { id: genId("cr"), center, edgePoint: edge }],
      selectedPointId: null,
    });
  },

  selectPoint: (id) => set({ selectedPointId: id }),

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    set({
      points: prev.points,
      lines: prev.lines,
      circles: prev.circles,
      undoStack: state.undoStack.slice(0, -1),
      selectedPointId: null,
    });
  },

  reset: () => set({
    points: [],
    lines: [],
    circles: [],
    undoStack: [],
    selectedPointId: null,
    tool: "point",
  }),
}));
