export type SubjectId = "math2" | "calculus" | "geometry" | "math1" | "prob-stat" | "middle-geo";

export type Math2UnitId =
  | "limit-of-function"
  | "derivative"
  | "extrema"
  | "definite-integral";

export type CalculusUnitId =
  | "series-convergence"
  | "differentiation-methods"
  | "substitution-integral"
  | "velocity-acceleration"
  | "volume-of-revolution";

export type GeometryUnitId =
  | "conic-sections"
  | "vector-operations"
  | "space-geometry";

export type Math1UnitId =
  | "trig-functions"
  | "exp-log"
  | "sequences";

export type ProbStatUnitId =
  | "probability"
  | "normal-dist"
  | "combinations";

export type MiddleGeoUnitId =
  | "trig-ratios"
  | "circle-properties"
  | "construction";

export type UnitId =
  | Math2UnitId
  | CalculusUnitId
  | GeometryUnitId
  | Math1UnitId
  | ProbStatUnitId
  | MiddleGeoUnitId;

export interface Unit {
  id: UnitId;
  name: string;
  description: string;
  icon: string;
  conceptCount: number;
  color: string;
}

export interface Subject {
  id: SubjectId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  units: Unit[];
}

export type Theme = "dark" | "light";

export type PageMode = "concept" | "problem" | "explore";
