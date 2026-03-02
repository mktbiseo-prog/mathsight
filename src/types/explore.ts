import type { EvalFunction } from "mathjs";

export const GRAPH_PALETTE = [
  "#0072B2", "#D55E00", "#009E73", "#E69F00", "#CC79A7", "#56B4E9",
] as const;

export const GRAPH_PALETTE_DARK = [
  "#64B5F6", "#FFB74D", "#81C784", "#FFE082", "#F48FB1", "#90CAF9",
] as const;

export interface GraphFunction {
  id: string;
  expression: string;
  normalizedExpr: string;
  compiled: EvalFunction;
  color: string;
  colorIndex: number;
  visible: boolean;
  parameters: string[];
  is3D: boolean;
}

export interface SliderParam {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface ViewSettings {
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  showZAxis: boolean;
  xRange: [number, number];
  yRange: [number, number];
  resolution: number;
}
