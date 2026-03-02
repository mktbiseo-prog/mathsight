import type { SceneManager } from "@/engine/SceneManager";
import type { UnitId } from "@/types";

export interface ParamDef {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface RenderContext {
  scene: SceneManager;
  params: Record<string, number>;
}

export interface ConceptStep {
  label: string;
  latex: string;
  description: string;
  params?: ParamDef[];
  render: (ctx: RenderContext) => void | (() => void);
}

export interface ConceptData {
  unitId: UnitId;
  title: string;
  is3D?: boolean;
  steps: ConceptStep[];
}
