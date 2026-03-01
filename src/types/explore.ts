import type { EvalFunction } from "mathjs";

export type NeonColor = "#39ff14" | "#00f0ff" | "#ff00ff" | "#ff6600";

export const NEON_PALETTE: NeonColor[] = ["#39ff14", "#00f0ff", "#ff00ff", "#ff6600"];

export interface GraphFunction {
  id: string;
  expression: string;
  normalizedExpr: string;
  compiled: EvalFunction;
  color: NeonColor;
  visible: boolean;
  parameters: string[];
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
  xRange: [number, number];
  yRange: [number, number];
  resolution: number;
}
