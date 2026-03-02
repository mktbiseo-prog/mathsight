import type { ConceptData } from "@/types/concept";
import { seriesConvergence } from "./series-convergence";
import { differentiationMethods } from "./differentiation-methods";
import { substitutionIntegral } from "./substitution-integral";
import { velocityAcceleration } from "./velocity-acceleration";
import { volumeOfRevolution } from "./volume-of-revolution";

export const calculusConcepts: ConceptData[] = [
  seriesConvergence,
  differentiationMethods,
  substitutionIntegral,
  velocityAcceleration,
  volumeOfRevolution,
];
