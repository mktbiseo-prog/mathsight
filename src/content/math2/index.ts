import type { ConceptData } from "@/types/concept";
import { limitOfFunction } from "./limit-of-function";
import { derivative } from "./derivative";
import { extrema } from "./extrema";
import { definiteIntegral } from "./definite-integral";

export const math2Concepts: ConceptData[] = [
  limitOfFunction,
  derivative,
  extrema,
  definiteIntegral,
];
